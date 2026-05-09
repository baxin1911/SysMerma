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