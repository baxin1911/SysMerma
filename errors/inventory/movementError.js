import { AppError } from "../AppError.js";

export class MovementDetailRelationConflict extends AppError {

    constructor () {
        super('El detalle del movimiento no está asociado a un producto o proveedor', 'MOVEMENT_DETAIL_RELATION_CONFLICT', 409);
    }
}