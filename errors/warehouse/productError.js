import e from "express";
import { AppError } from "../AppError.js";

export class ProductNotFound extends AppError {

    constructor () {
        super('Producto no encontrado', 'PRODUCT_NOT_FOUND', 404);
    }
}

export class ExcededMaxRetriesSkuError extends AppError {

    constructor () {
        super('Excedido el número máximo de intentos para generar un SKU único', 'EXCEDED_MAX_RETRIES_SKU', 500);
    }
}

export class SupplierProductCreateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al relacionar el producto a un proveedor', 'SUPPLIER_PRODUCT_CREATE_DB_ERROR', 500);
    }
}

export class SupplierProductDeleteDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al eliminar la relación entre producto y proveedor', 'SUPPLIER_PRODUCT_DELETE_DB_ERROR', 500);
    }
}

export class ProductSnapshotFindDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al buscar los datos históricos del producto', 'PRODUCT_SNAPSHOT_FIND_DB_ERROR', 500);
    }
}

export class ProductCreateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al crear el producto', 'PRODUCT_CREATE_DB_ERROR', 500);
    }
}

export class ProductUpdateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al editar el producto', 'PRODUCT_UPDATE_DB_ERROR', 500);
    }
}

export class ProductStockAdjustmentDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al editar el ajuste de stock del product', 'PRODUCT_STOCK_ADJUSTMENT_DB_ERROR', 500);
    }
}

export class ProductUnitCostUpdateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al editar el costo unitario del producto', 'PRODUCT_UNIT_COST_UPDATE_DB_ERROR', 500);
    }
}