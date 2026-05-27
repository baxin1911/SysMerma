import { AppError } from "../AppError.js";

export class ProfileFindDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al buscar el perfil', 'PROFILE_FIND_DB_ERROR', 500);
    }
}

export class ProfileCreateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al crear el perfil', 'PROFILE_CREATE_DB_ERROR', 500);
    }
}

export class ProfileUpdateDatabaseError extends AppError {

    constructor () {
        super('Error de base de datos al actualizar el perfil', 'PROFILE_UPDATE_DB_ERROR', 500);
    }
}