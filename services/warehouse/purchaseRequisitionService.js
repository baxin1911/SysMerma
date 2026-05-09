import {
    ProjectNotFound,
    PurchaseRequisitionNotFound,
    PurchaseRequisitionStatusUpdateDatabaseError,
    PurchaseRequisitionStatusNotFound,
    PurchaseRequisitionUpdateDatabaseError,
    RequesterProfileNotFound,
    PurchaseRequisitionApproverProfileNotFound
} from "../../errors/warehouse/purchaseRequisitionError.js";
import { getDb } from "../../repository/baseRepository.js";
import { generateReferenceNumber } from "../document/referenceNumberService.js";

const allowedDepartments = ['Almcén', 'Sistemas'];
const allowedUsers = ['Coordinador', 'Administrador del sistema'];
const REFERENCE_NUMBER_TYPE = 'REQ';
const STATUS_OPEN = 'Abierta';
const STATUS_CONFIRMED = 'Confirmada';
const STATUS_CANCELED = 'Cancelada';
const PRISMA_RECORD_NOT_FOUND = 'P2025';

export const findAllPurchaseRequisitions = async ({
    currentDepartment = '',
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'requestDate',
    orderDir = 'asc',
    userDepartment = '',
    userRole = ''
}) => {

    const canViewAll = allowedUsers.includes(userRole) && allowedDepartments.includes(userDepartment);

    const where = {
        ...(search && {
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
            }
        }),
        ...(!canViewAll && userDepartment && {
            department: {
                name: userDepartment
            }
        })
    };

    const purchaseRequisitions = await getDb().purchaseRequisition.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        include: {
            department: true,
            approver: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            requester: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            project: {
                select: {
                    id: true,
                    referenceNumber: true,
                    name: true,
                    client: true,
                    date: true
                }
            },
            status: {
                select: {
                    id: true,
                    name: true
                }
            },
            details: {
                select: {
                    id: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            presentation: true
                        }
                    },
                    quantity: true
                }
            }
        }
    });

    const total = await getDb().purchaseRequisition.count({
        where: currentDepartment && !allowedDepartments.includes(currentDepartment)
            ? {
                department: {
                    name: currentDepartment
                }
            }
            : {}
    });
    const filtered = await getDb().purchaseRequisition.count({ where });

    return {
        data: purchaseRequisitions,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const validatePurchaseRequisitionRelations = async ({ projectId, userId }) => {

    const [project, user] = await Promise.all([
        prisma.project.findFirst({
            where: { id: projectId }
        }),
        prisma.user.findUnique({
            where: { 
                id: userId
            },
            include: {
                profiles: true
            }
        })
    ]);

    const requester = user?.profiles[0];
    const departmentId = user?.departmentId;

    if (!project) throw new ProjectNotFound();
    if (!requester) throw new RequesterProfileNotFound();

    return { project, requester, departmentId };
};

export const createPurchaseRequisition = async ({
    purchaseRequisitionDto,
    userId
}) => {

    const { projectId, details, ...purchaseRequisitionData } = purchaseRequisitionDto;

    const { requester, departmentId } = await validatePurchaseRequisitionRelations({ projectId, userId });

    const result = await getDb().$transaction(async (tx) => {

        const referenceNumber = await generateReferenceNumber({ type: REFERENCE_NUMBER_TYPE, tx });

        const purchaseRequisition = await tx.purchaseRequisition.create({
            data: {
                ...purchaseRequisitionData,
                status: {
                    connect: {
                        name: STATUS_OPEN
                    }
                },
                project: {
                    connect: {
                        id: projectId
                    }
                },
                requester: {
                    connect: {
                        id: requester.id
                    }
                },
                department: {
                    connect: {
                        id: departmentId
                    }
                },
                referenceNumber,
                details: {
                    create: details.map(({ productId, ...rest }) => ({
                        ...rest,
                        product: {
                            connect: {
                                id: productId
                            }
                        }
                    }))
                }
            }
        });

        return { purchaseRequisition };
    });

    return result.purchaseRequisition;
};

export const updatePurchaseRequisition = async ({
    purchaseRequisitionDto, 
    id,
    userId
}) => {

    const { projectId, details, ...purchaseRequisitionData } = purchaseRequisitionDto;

    const { requester } = await validatePurchaseRequisitionRelations({ projectId, userId });

    const purchaseRequisitionExists = await getDb().purchaseRequisition.findUnique({
        where: { id },
        select: {
            id: true
        }
    });

    if (!purchaseRequisitionExists) throw new PurchaseRequisitionNotFound();

    try {

        const result = await getDb().$transaction(async (prisma) => {

            const purchaseRequisition = await getDb().purchaseRequisition.update({
                data: {
                    ...purchaseRequisitionData,
                    project: {
                        connect: {
                            id: projectId
                        }
                    },
                    requester: {
                        connect: {
                            id: requester.id
                        }
                    }
                },
                where: { id }
            });

            const incomingDetailsIds = details.map(detail => detail.id).filter(Boolean);
            const deleteFilter = { purchaseRequisitionId: id };

            if (incomingDetailsIds.length) deleteFilter.id = { notIn: incomingDetailsIds };

            await getDb().detailPurchaseRequisitionProduct.deleteMany({
                where: deleteFilter
            });

            const detailsPurchaseRequisition = await Promise.all(details.map(async detail => {

                return await getDb().detailPurchaseRequisitionProduct.create({
                    data: {
                        ...detail,
                        purchaseRequisitionId: id
                    }
                });
            }));

            purchaseRequisition.details = detailsPurchaseRequisition;

            return { purchaseRequisition };
        });

        return result;

    } catch (err) {

        if (err.code === PRISMA_RECORD_NOT_FOUND) throw new PurchaseRequisitionNotFound();

        throw new PurchaseRequisitionUpdateDatabaseError();
    }
};

const updatePurchaseRequisitionStatus = async ({ id, statusName, userId }) => {

    const purchaseRequisition = await getDb().purchaseRequisition.findUnique({
        where: { id },
        select: {
            id: true,
            referenceNumber: true,
            details: {
                select: {
                    id: true
                }
            },
            department: {
                select: {
                    id: true,
                    name: true
                }
            },
            status: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!purchaseRequisition) throw new PurchaseRequisitionNotFound();
    if (purchaseRequisition.status?.name !== STATUS_OPEN) throw new PurchaseRequisitionStatusNotFound();

    try {

        const data = {
            status: {
                connect: {
                    name: statusName
                }
            }
        };

        if (statusName === STATUS_CONFIRMED) {
            const approver = await getDb().profile.findFirst({
                where: {
                    isActive: true,
                    users: {
                        some: {
                            id: userId,
                            isActive: true
                        }
                    }
                },
                select: {
                    id: true
                }
            });

            if (!approver) throw new PurchaseRequisitionApproverProfileNotFound();

            data.approver = {
                connect: {
                    id: approver.id
                }
            };
            data.approveDate = new Date();
        }

        const updatedPurchaseRequisition = await getDb().purchaseRequisition.update({
            where: { id },
            data,
            select: {
                id: true,
                status: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return {
            ...updatedPurchaseRequisition,
            referenceNumber: purchaseRequisition.referenceNumber,
            department: purchaseRequisition.department,
            totalRequestedProducts: purchaseRequisition.details.length
        };
    } catch (err) {

        if (err.code === PRISMA_RECORD_NOT_FOUND) throw new PurchaseRequisitionStatusNotFound();
        throw new PurchaseRequisitionStatusUpdateDatabaseError();
    }
};

export const confirmPurchaseRequisition = async ({ id, userId }) =>
    await updatePurchaseRequisitionStatus({ id, statusName: STATUS_CONFIRMED, userId });

export const cancelPurchaseRequisition = async ({ id, userId }) =>
    await updatePurchaseRequisitionStatus({ id, statusName: STATUS_CANCELED, userId });
