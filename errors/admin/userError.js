import { AppError } from "../AppError.js";

export class UserCreateDatabaseError extends AppError {
    constructor() {
        super('Error de base de datos al crear usuario', 'USER_CREATE_DATABASE_ERROR', 500);
    }
}

export class UserFindDatabaseError extends AppError {
    constructor() {
        super('Error de base de datos al buscar usuario', 'USER_FIND_DATABASE_ERROR', 500);
    }
}

export class UserUpdateDatabaseError extends AppError {
    constructor() {
        super('Error de base de datos al actualizar usuario', 'USER_UPDATE_DATABASE_ERROR', 500);
    }
}

export class UserNotFound extends AppError {
    constructor() {
        super('Usuario no encontrado', 'USER_NOT_FOUND', 404);
    }
}
