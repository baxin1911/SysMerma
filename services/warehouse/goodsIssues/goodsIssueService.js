import { GoodsIssueInsufficientStock } from "../../../errors/inventory/stockError.js";
import {
    GoodsIssueNotFound,
    GoodsIssueRequesterProfileNotFound,
    GoodsIssueUpdateDatabaseError,
    GoodsIssueAdvisorProfileNotFound
} from "../../../errors/warehouse/goodsIssueError.js";
import { prisma } from "../../../lib/prisma.js";
import { findProfileById } from "../../admin/profileService.js";
import { findDepartmentById } from "../../admin/departmentService.js";
import { generateReferenceNumber } from "../../document/referenceNumberService.js";
import { findClientById } from "../../sales/clientService.js";
import { buildGoodsIssueDetails } from "./goodsIssueHelpers.js";

const ROLE_SYSTEM_ADMIN = 'Administrador del sistema';
const ROLE_COORDINATOR = 'Coordinador';
const DEPARTMENT_WAREHOUSE = 'ALMACÉN Y PROVEDURÍA';
const STATUS_PENDING = 'Pendiente';
const STATUS_APPROVED = 'Aprobada';
const REFERENCE_NUMBER_TYPE = 'SAL';
const FLOAT_EPSILON = 0.000001;
const FULFILLMENT_PENDING = 'Pendiente';
const FULFILLMENT_PARTIAL = 'Surtido parcial';
const FULFILLMENT_COMPLETE = 'Surtido';

export const findAllGoodsIssues = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'referenceNumber',
    orderDir = 'asc',
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
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
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

    const goodsIssues = await prisma.goodsIssue.findMany({
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
            details: {
                select: {
                    id: true,
                    productId: true,
                    productName: true,
                    productBase: true,
                    productHeight: true,
                    quantity: true,
                    presentationId: true,
                    presentationName: true,
                    convertedQuantity: true,
                    unitMeasureId: true,
                    unitMeasureName: true,
                    unitMeasureSymbol: true,
                    maxUnitCost: true,
                    projectConvertedQuantity: true,
                    convertedQuantityDifference: true,
                    supplierName: true,
                }
            },
            movements: true
        }
    });

    const goodsIssuesWithDispatchStatus = goodsIssues.map((goodsIssue) => ({
        ...goodsIssue,
        dispatchStatus: getDispatchStatus({
            details: goodsIssue.details,
            movement: goodsIssue.movements
        })
    }));

    const total = await prisma.goodsIssue.count();
    const filtered = await prisma.goodsIssue.count({ where });

    return {
        data: goodsIssuesWithDispatchStatus,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const addQuantityToMap = (map, productId, quantity) => {
    const current = map.get(productId) || 0;
    map.set(productId, current + Number(quantity));
};

const getDispatchStatus = ({ details, movement }) => {
    const requestedByProduct = new Map();
    details.forEach((detail) => {
        addQuantityToMap(requestedByProduct, detail.productId, detail.quantity);
    });

    const deliveredByProduct = new Map();
    movement.forEach((entry) => {
        entry.details.forEach((detail) => {
            addQuantityToMap(deliveredByProduct, detail.productId, detail.quantity);
        });
    });

    const totalDelivered = Array.from(deliveredByProduct.values()).reduce((acc, qty) => acc + qty, 0);

    if (totalDelivered <= FLOAT_EPSILON) return DISPATCH_STATUS_NOT_DISPATCHED;

    const isFullyDispatched = Array.from(requestedByProduct.entries()).every(
        ([productId, requestedQuantity]) =>
            ((deliveredByProduct.get(productId) || 0) + FLOAT_EPSILON) >= requestedQuantity
    );

    return isFullyDispatched ? DISPATCH_STATUS_COMPLETE : DISPATCH_STATUS_PARTIAL;
};

export const createGoodsIssue = async ({
    goodsIssueDto
}) => {

    const { requesterId, advisorId, departmentId, clientId, details, ...goodsIssueData } = goodsIssueDto;

    const requester = await findProfileById({ id: requesterId });

    if (!requester) throw new GoodsIssueRequesterProfileNotFound();
    
    const advisor = await findProfileById({ id: advisorId });

    if (!advisor) throw new GoodsIssueAdvisorProfileNotFound();

    const client = await findClientById({ id: clientId });
    const department = await findDepartmentById({ id: departmentId });

    const processedDetails = await buildGoodsIssueDetails({ details });

    const result = await prisma.$transaction(async (tx) => {

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
};

export const updateGoodsIssue = async ({ id, goodsIssueDto }) => {
    const { details = [] } = goodsIssueDto;

    try {
        return await prisma.$transaction(async (tx) => {
            const goodsIssue = await tx.goodsIssue.findUnique({
                where: { id },
                select: {
                    id: true,
                    details: {
                        select: {
                            id: true,
                            productId: true,
                            quantity: true,
                            convertedQuantity: true
                        }
                    }
                }
            });

            if (!goodsIssue) throw new GoodsIssueNotFound();

            const detailIds = details.map((d) => d.id).filter(Boolean);
            const currentDetails = goodsIssue.details.filter((d) => detailIds.includes(d.id));
            const currentById = new Map(currentDetails.map((d) => [d.id, d]));

            const productTotals = new Map();
            const movementDetails = [];

            for (const detail of details) {
                const current = currentById.get(detail.id);
                if (!current) continue;

                const requested = Number(current.convertedQuantity);
                const supplied = Number(detail.projectConvertedQuantity || 0);
                const difference = requested - supplied;
                const isSupplied = supplied + FLOAT_EPSILON >= requested;

                await tx.goodsIssueDetail.update({
                    where: { id: current.id },
                    data: {
                        projectConvertedQuantity: supplied,
                        suppliedQuantity: supplied,
                        convertedQuantityDifference: difference,
                        isSupplied,
                        fulfillmentStatus: {
                            connect: { name: isSupplied ? FULFILLMENT_COMPLETE : (supplied > 0 ? FULFILLMENT_PARTIAL : FULFILLMENT_PENDING) }
                        }
                    }
                });

                if (supplied > FLOAT_EPSILON) {
                    const prev = productTotals.get(current.productId) || 0;
                    productTotals.set(current.productId, prev + supplied);
                    movementDetails.push({ productId: current.productId, goodsIssueDetailId: current.id, quantity: supplied });
                }
            }

            const products = await tx.product.findMany({
                where: { id: { in: Array.from(productTotals.keys()) } },
                select: { id: true, currentStock: true }
            });
            const stockById = new Map(products.map((p) => [p.id, Number(p.currentStock)]));
            for (const [productId, qty] of productTotals.entries()) {
                if ((stockById.get(productId) || 0) + FLOAT_EPSILON < qty) throw new GoodsIssueInsufficientStock();
            }

            if (movementDetails.length) {
                await tx.inventoryMovement.create({
                    data: {
                        goodsIssueId: id,
                        date: new Date(),
                        details: { create: movementDetails }
                    }
                });

                for (const [productId, qty] of productTotals.entries()) {
                    await tx.product.update({ where: { id: productId }, data: { currentStock: { decrement: qty } } });
                }
            }

            const refreshed = await tx.goodsIssueDetail.findMany({ where: { goodsIssueId: id }, select: { isSupplied: true, suppliedQuantity: true } });
            const allSupplied = refreshed.every((d) => d.isSupplied);
            const anySupplied = refreshed.some((d) => Number(d.suppliedQuantity || 0) > FLOAT_EPSILON);
            const fulfillmentName = allSupplied ? FULFILLMENT_COMPLETE : (anySupplied ? FULFILLMENT_PARTIAL : FULFILLMENT_PENDING);

            return await tx.goodsIssue.update({
                where: { id },
                data: {
                    fulfillmentStatus: { connect: { name: fulfillmentName } },
                    status: { connect: { name: STATUS_APPROVED } }
                },
                select: { id: true, fulfillmentStatus: true, status: true }
            });
        });
    } catch (err) {
        if (err instanceof GoodsIssueNotFound || err instanceof GoodsIssueInsufficientStock) throw err;
        throw new GoodsIssueUpdateDatabaseError();
    }
}
