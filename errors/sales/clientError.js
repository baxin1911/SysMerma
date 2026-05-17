import { AppError } from "../AppError.js";

export class ClientNotFound extends AppError {

    constructor () {
        super('Cliente no encontrado', 'CLIENT_NOT_FOUND', 404);
    }
}

export class ClientFindDatabaseError extends AppError {

    constructor () {
        super('Error de la base de datos al buscar el cliente', 'CLIENT_FIND_DB_ERROR', 500);
    }
}

export class ClientCreateDatabaseError extends AppError {

    constructor () {
        super('Error de la base de datos al crear el cliente', 'CLIENT_CREATE_DB_ERROR', 500);
    }
}