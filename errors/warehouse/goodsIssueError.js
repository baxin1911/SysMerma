import { AppError } from "../AppError.js";

export class GoodsIssueNotFound extends AppError {

    constructor () {
        super('Salida de almacén no encontrada', 'GOODS_ISSUE_NOT_FOUND', 404);
    }
}

export class GoodsIssueFulfillmentCompleteConflict extends AppError {

    constructor () {
        super('La salida ya está completamente surtida y no puede modificarse', 'GOODS_ISSUE_FULFILLMENT_COMPLETE_CONFLICT', 409);
    }
}


export class GoodsIssueNotPendingConflict extends AppError {

    constructor () {
        super('La salida solo puede editarse cuando está pendiente', 'GOODS_ISSUE_NOT_PENDING_CONFLICT', 409);
    }
}

export class GoodsIssueSuppliedConflict extends AppError {

    constructor () {
        super('La salida ya tiene productos surtidos y no puede editarse en general', 'GOODS_ISSUE_SUPPLIED_CONFLICT', 409);
    }
}

export class GoodsIssueRequesterProfileNotFound extends AppError {

    constructor () {
        super('Perfil solicitante no encontrado', 'REQUESTER_PROFILE_NOT_FOUND', 404);
    }
}

export class GoodsIssueAdvisorProfileNotFound extends AppError {

    constructor () {
        super('Perfil de asesor no encontrado', 'ADVISOR_PROFILE_NOT_FOUND', 404);
    }
}

export class GoodsIssueDetailNotFound extends AppError {

    constructor () {
        super('Detalle de salida de almacén no encontrado', 'GOODS_ISSUE_DETAIL_NOT_FOUND', 404);
    }
}

export class GoodsIssueSuppliedDetailConflict extends AppError {

    constructor () {
        super('No se pueden editar o eliminar detalles que ya fueron surtidos', 'GOODS_ISSUE_SUPPLIED_DETAIL_CONFLICT', 409);
    }
}

export class GoodsIssueCreateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al crear la salida de almacén', 'GOODS_ISSUE_CREATE_DB_ERROR', 500);
    }
}

export class GoodsIssueUpdateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al editar la salida de almacén', 'GOODS_ISSUE_UPDATE_DB_ERROR', 500);
    }
}
