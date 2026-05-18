import {
    GoodsIssueNotFound,
    GoodsIssueRequesterProfileNotFound,
    GoodsIssueUpdateDatabaseError,
    GoodsIssueAdvisorProfileNotFound,
    GoodsIssueNotPendingConflict,
    GoodsIssueSuppliedConflict,
    GoodsIssueCreateDatabaseError,
    GoodsIssueInternalClientAdvisorDepartmentConflict
} from "../../../errors/warehouse/goodsIssueError.js";
import { getDb } from "../../../repository/baseRepository.js";
import { findProfileById } from "../../admin/profileService.js";
import { findDepartmentById } from "../../admin/departmentService.js";
import { generateReferenceNumber } from "../../document/referenceNumberService.js";
import { findClientById } from "../../sales/clientService.js";
import { buildGoodsIssueDetails, isValidInternalClientAdvisor, resolveFulfillmentStatus } from "./goodsIssueHelpers.js";
import { applyInventoryMovement } from "../../inventory/movementService.js";
import { buildStockKey, parseStockKey } from "../../../utils/formattersUtils.js";
import { findSupplierProduct } from "../products/supplierProductService.js";
import { AppError } from "../../../errors/AppError.js";

const ROLE_SYSTEM_ADMIN = 'Administrador del sistema';
const ROLE_COORDINATOR = 'Coordinador';
const DEPARTMENT_WAREHOUSE = 'ALMACÉN Y PROVEDURÍA';
const FULFILLMENT_PENDING = 'Pendiente';
const FULFILLMENT_COMPLETE = 'Surtido';
const STATUS_APPROVED = 'Aprobada';
const REFERENCE_NUMBER_TYPE = 'SAL';
const MOVEMENT_TYPE_OUT = 'OUT';
const FLOAT_EPSILON = 0.000001;

export const findAllGoodsIssues = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'referenceNumber',
    orderDir = 'asc',
    onlyPending = true,
    accesses = []
}) => {

    const isAdmin = accesses.some(access => access.role === ROLE_SYSTEM_ADMIN);
    const isWarehouseCoordinator = accesses.some(access => 
        access.role === ROLE_COORDINATOR && 
        access.department === DEPARTMENT_WAREHOUSE
    );
    const canViewAll = isAdmin || isWarehouseCoordinator;
    const userDepartments = accesses.map(a => a.department);

    const where = {
        ...(search && {
            OR: [
                {
                    referenceNumber: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    projectNumber: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    clientName: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    departmentName: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }),
        ...(onlyPending && {
            fulfillmentStatus: {
                name: {
                    not: FULFILLMENT_COMPLETE
                }
            }
        }),
        ...(!canViewAll && {
            department: {
                name: {
                    in: userDepartments
                }
            }
        })
    };

    const goodsIssues = await getDb().goodsIssue.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        include: {
            status: true,
            approver: {
                select: {
                    id: true,
                    fullName: true,
                }
            },
            warehouseStaff: {
                select: {
                    id: true,
                    fullName: true,
                }
            },
            fulfillmentStatus: true,
            details: {
                select: {
                    id: true,
                    productId: true,
                    quantity: true,
                    convertedQuantity: true,
                    maxUnitCost: true,
                    productName: true,
                    productBase: true,
                    productHeight: true,
                    presentationId: true,
                    presentationName: true,
                    unitMeasureId: true,
                    unitMeasureName: true,
                    unitMeasureSymbol: true,
                    projectConvertedQuantity: true,
                    convertedQuantityDifference: true,
                    suppliedQuantity: true,
                    isSupplied: true,
                    fulfillmentStatus: true,
                    supplierId: true,
                    supplierName: true
                }
            },
            movements: true
        }
    });

    const total = await getDb().goodsIssue.count({ where });
    const filtered = total;

    return {
        data: goodsIssues,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const createGoodsIssue = async ({
    goodsIssueDto
}) => {

    try {

        const { requesterId, advisorId, departmentId, clientId, details, ...goodsIssueData } = goodsIssueDto;

        const requester = await findProfileById({ id: requesterId });

        if (!requester) throw new GoodsIssueRequesterProfileNotFound();
        
        const advisor = await findProfileById({ id: advisorId });

        if (!advisor) throw new GoodsIssueAdvisorProfileNotFound();

        const client = await findClientById({ id: clientId });
        const department = await findDepartmentById({ id: departmentId });

        if (!isValidInternalClientAdvisor({ client, advisor })) {
            throw new GoodsIssueInternalClientAdvisorDepartmentConflict();
        }

        const processedDetails = await buildGoodsIssueDetails({ details });

        const result = await getDb().$transaction(async (tx) => {

            const referenceNumber = await generateReferenceNumber({ type: REFERENCE_NUMBER_TYPE, tx });

            const goodsIssue = await tx.goodsIssue.create({
                data: {
                    ...goodsIssueData,
                    referenceNumber,
                    departmentName: department.name,
                    requesterName: requester.fullName,
                    advisorName: advisor.fullName,
                    clientName: client.name,
                    status: {
                        connect: {
                            name: STATUS_APPROVED
                        }
                    },
                    requester: {
                        connect: {
                            id: requesterId
                        }
                    },
                    advisor: {
                        connect: {
                            id: advisorId
                        }
                    },
                    department: {
                        connect: {
                            id: departmentId
                        }
                    },
                    client: {
                        connect: {
                            id: clientId
                        }
                    },
                    fulfillmentStatus: {
                        connect: {
                            name: FULFILLMENT_PENDING
                        }
                    },
                    details: {
                        createMany: {
                            data: processedDetails
                        }
                    }
                },
                include: {
                    details: {
                        select: {
                            productId: true,
                            quantity: true,
                            convertedQuantity: true,
                            maxUnitCost: true,
                            productName: true,
                            productBase: true,
                            productHeight: true,
                            presentationId: true,
                            presentationName: true,
                            unitMeasureId: true,
                            unitMeasureName: true,
                            unitMeasureSymbol: true
                        }
                    }
                }
            });

            return { goodsIssue };
        });

        return result.goodsIssue;

    } catch (err) {

        if (err instanceof AppError) throw err;

        throw new GoodsIssueCreateDatabaseError();
    }
};

export const updateGoodsIssue = async ({ id, goodsIssueDto }) => {

    try {

        const { requesterId, advisorId, departmentId, clientId, details, ...goodsIssueData } = goodsIssueDto;

        const goodsIssue = await getDb().goodsIssue.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                fulfillmentStatus: true,
                details: {
                    select: {
                        id: true,
                        productId: true,
                        supplierId: true,
                        quantity: true,
                        presentationId: true,
                        suppliedQuantity: true,
                        isSupplied: true
                    }
                }
            }
        });

        if (!goodsIssue) throw new GoodsIssueNotFound();

        if (goodsIssue.fulfillmentStatus?.name !== FULFILLMENT_PENDING) throw new GoodsIssueNotPendingConflict();

        const hasSuppliedInAnyDetail = goodsIssue.details.some(
            detail => Number(detail.suppliedQuantity ?? 0) > FLOAT_EPSILON || detail.isSupplied
        );

        if (hasSuppliedInAnyDetail) throw new GoodsIssueSuppliedConflict();

        const requester = await findProfileById({ id: requesterId });

        if (!requester) throw new GoodsIssueRequesterProfileNotFound();

        const advisor = await findProfileById({ id: advisorId });

        if (!advisor) throw new GoodsIssueAdvisorProfileNotFound();

        const client = await findClientById({ id: clientId });
        const department = await findDepartmentById({ id: departmentId });

        if (!isValidInternalClientAdvisor({ client, advisor })) {
            throw new GoodsIssueInternalClientAdvisorDepartmentConflict();
        }

        const processedDetails = await buildGoodsIssueDetails({ details });

        return await getDb().$transaction(async (tx) => {

            await tx.goodsIssueDetail.deleteMany({
                where: { goodsIssueId: id }
            });

            await tx.goodsIssueDetail.createMany({
                data: processedDetails.map(d => ({
                    ...d,
                    goodsIssueId: id
                }))
            });

            return await tx.goodsIssue.update({
                where: { id },
                data: {
                    ...goodsIssueData,
                    departmentName: department.name,
                    requesterName: requester.fullName,
                    advisorName: advisor.fullName,
                    clientName: client.name,

                    department: {
                        connect: { id: departmentId }
                    },

                    requester: {
                        connect: { id: requesterId }
                    },

                    advisor: {
                        connect: { id: advisorId }
                    },

                    client: {
                        connect: { id: clientId }
                    },

                    status: {
                        connect: {
                            name: STATUS_APPROVED
                        }
                    },

                    fulfillmentStatus: {
                        connect: {
                            name: FULFILLMENT_PENDING
                        }
                    }
                },
                include: {
                    details: true,
                    status: true,
                    fulfillmentStatus: true
                }
            });
        });

    } catch (err) {
console.log(err)
        if (err instanceof AppError) throw err;

        throw new GoodsIssueUpdateDatabaseError();
    }
};

export const updateGoodsIssueDetails = async ({ id, goodsIssueDto }) => {

    const { details = [] } = goodsIssueDto;

    try {

        const goodsIssue = await getDb().goodsIssue.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                fulfillmentStatus: true,
                details: {
                    select: {
                        id: true,
                        productId: true,
                        supplierId: true,
                        quantity: true,
                        suppliedQuantity: true,
                        convertedQuantity: true,
                        projectConvertedQuantity: true
                    }
                }
            }
        });

        if (!goodsIssue) throw new GoodsIssueNotFound();

        if (goodsIssue.fulfillmentStatus?.name !== FULFILLMENT_PENDING) {
            throw new GoodsIssueNotPendingConflict();
        }
        const detailIds = details.map(d => d.id).filter(Boolean);
        const currentDetails = goodsIssue.details.filter(d => detailIds.includes(d.id));
        const currentById = new Map(currentDetails.map(d => [d.id, d]));

        return await getDb().$transaction(async (tx) => {

            const movementDetails = [];
            const updates = [];

            for (const detail of details) {

                const current = currentById.get(detail.id);
                if (!current) continue;

                const pending = current.quantity - (current.suppliedQuantity ?? 0);
                const convertedQuantityDifference = current.convertedQuantity - detail.projectConvertedQuantity;

                if (!detail.isSupplied) {
                    updates.push({
                        id: current.id,
                        data: {
                            projectConvertedQuantity: detail.projectConvertedQuantity,
                            convertedQuantityDifference
                        }
                    });
                    continue;
                }

                const quantityToSupply = pending;

                if (quantityToSupply <= FLOAT_EPSILON) continue;

                movementDetails.push({
                    productId: current.productId,
                    supplierId: current.supplierId,
                    goodsIssueDetailId: current.id,
                    quantity: quantityToSupply
                });

                const newSupplied = (current.suppliedQuantity ?? 0) + quantityToSupply;

                updates.push({
                    id: current.id,
                    data: {
                        suppliedQuantity: newSupplied,
                        isSupplied: newSupplied >= current.quantity,
                        projectConvertedQuantity: detail.projectConvertedQuantity,
                        convertedQuantityDifference
                    }
                });
            }

            for (const u of updates) {
                await tx.goodsIssueDetail.update({
                    where: { id: u.id },
                    data: u.data
                });
            }

            if (movementDetails.length) {

                const grouped = new Map();

                for (const d of movementDetails) {
                    const key = buildStockKey(d.productId, d.supplierId);
                    grouped.set(
                        key,
                        Number((grouped.get(key) || 0)) + Number(d.quantity)
                    );
                }

                const filters = Array.from(grouped.keys()).map(parseStockKey);

                const supplierProducts = await findSupplierProduct({
                    tx,
                    where: { OR: filters },
                    select: {
                        id: true,
                        productId: true,
                        supplierId: true,
                        currentStock: true,
                        convertedQuantity: true,
                        product: {
                            select: {
                                base: true,
                                height: true,
                                name: true
                            }
                        },
                        supplier: {
                            select: {
                                tradeName: true
                            }
                        }
                    }
                });

                await applyInventoryMovement({
                    tx,
                    reference: { goodsIssueId: goodsIssue.id },
                    details: movementDetails,
                    movementType: MOVEMENT_TYPE_OUT,
                    grouped,
                    supplierProducts
                });
            }

            const refreshed = await tx.goodsIssueDetail.findMany({
                where: { goodsIssueId: id },
                select: {
                    isSupplied: true,
                    quantity: true,
                    suppliedQuantity: true
                }
            });

            const fulfillmentName = resolveFulfillmentStatus(refreshed);

            return await tx.goodsIssue.update({
                where: { id },
                data: {
                    fulfillmentStatus: {
                        connect: { name: fulfillmentName }
                    },
                    status: {
                        connect: { name: STATUS_APPROVED }
                    }
                },
                select: {
                    id: true,
                    status: true,
                    fulfillmentStatus: true,
                }
            });

        });

    } catch (err) {

        if (err instanceof AppError) throw err;

        throw new GoodsIssueUpdateDatabaseError();
    }
};
