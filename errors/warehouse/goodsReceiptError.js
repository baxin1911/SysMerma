import { AppError } from "../AppError.js";

export class GoodsReceiptNotFound extends AppError {

    constructor() {
        super('Recibo de mercancía no encontrado', 'GOODS_RECEIPT_NOT_FOUND', 404);
    }
}

export class SupplierNotFound extends AppError {

    constructor() {
        super('Proveedor no encontrado', 'SUPPLIER_NOT_FOUND', 404);
    }
}

export class GoodsReceiptCreateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al crear la compra', 'GOODS_RECEIPT_CREATE_DB_ERROR', 500);
    }
}

export class ProfileReceivedByNotFound extends AppError {

    constructor() {
        super('Perfil de quien recibe no encontrado', 'PROFILE_RECEIVED_BY_NOT_FOUND', 404);
    }
}
