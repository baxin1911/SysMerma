import { AppError } from "../AppError.js";

export class UserCreateDatabaseError extends AppError {
    constructor() {
        super('USER_CREATE_DATABASE_ERROR', 500);
    }
}

export class UserFindDatabaseError extends AppError {
    constructor() {
        super('USER_FIND_DATABASE_ERROR', 500);
    }
}

export class UserUpdateDatabaseError extends AppError {
    constructor() {
        super('USER_UPDATE_DATABASE_ERROR', 500);
    }
}

export class UserNotFound extends AppError {
    constructor() {
        super('USER_NOT_FOUND', 404);
    }
}
