import { AppError } from "../AppError.js";

export class SupplierNotFound extends AppError {

    constructor () {
        super('Proveedor no encontrado', 'SUPPLIER_NOT_FOUND', 404);
    }
}

export class SupplierCodeNotFound extends AppError {

    constructor () {
        super('Código del proveedor no encontrado', 'SUPPLIER_CODE_NOT_FOUND', 404);
    }
}

export class SupplierCreateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al crear el proveedor', 'SUPPLIER_CREATE_DB_ERROR', 500);
    }
}

export class SupplierUpdateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al editar el proveedor', 'SUPPLIER_UPDATE_DB_ERROR', 500);
    }
}

export class SupplierCodeFindDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al buscar el código del proveedor', 'SUPPLIER_CODE_FIND_DB_ERROR', 500);
    }
}