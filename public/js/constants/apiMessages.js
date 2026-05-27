export const errorMessages = {
    // 🔐 AUTH / GENERALES
    LOGIN_ERROR: 'Usuario o contraseña incorrectos.',
    VALIDATION_ERROR: 'Errores de validación.',
    INVALID_AUTH: 'Sesión inválida. Inicia sesión nuevamente.',
    INVALID_LINK: 'Enlace inválido. Solicita uno nuevo.',
    SERVER_ERROR: 'Error del servidor.',
    DETECTED_REUSE: 'Reuso de sesión detectado.',

    // SUPPLIER
    SUPPLIER_ID_REQUIRED: 'El proveedor es requerido.',
    SUPPLIER_ID_INVALID_UUID: 'El proveedor no es válido.',
    SUPPLIER_NOT_FOUND: 'Proveedor no encontrado.',
    SUPPLIER_CODE_NOT_FOUND: 'Código del proveedor no encontrado.',
    SUPPLIER_FIND_DB_ERROR: 'Error de base de datos al buscar el proveedor',
    SUPPLIER_CREATE_DB_ERROR: 'Error de base de datos al crear el proveedor',
    SUPPLIER_UPDATE_DB_ERROR: 'Error de base de datos al editar el proveedor.',
    SUPPLIER_CODE_FIND_DB_ERROR: 'Error de base de datos al buscar el código del proveedor',

    // RECEIVED BY
    RECEIVED_BY_ID_REQUIRED: 'La person que recibe es requerida.',
    RECEIVED_BY_ID_INVALID_UUID: 'La persona que recibe no es válida.',
    PROFILE_RECEIVED_BY_NOT_FOUND: 'Perfil de quien recibe no encontrado.',

    ADVISOR_ID_REQUIRED: 'El asesor es requerido.',
    ADVISOR_ID_INVALID_UUID: 'El asesor no es válido.',
    ADVISOR_PROFILE_NOT_FOUND: 'Perfil de asesor no encontrado.',

    REQUESTER_ID_REQUIRED: 'El solicitante es requerido.',
    REQUESTER_ID_INVALID_UUID: 'El solicitante no es válido.',
    REQUESTER_PROFILE_NOT_FOUND: 'Perfil solicitante no encontrado.',

    PROFILE_CREATE_DB_ERROR: 'Error de base de datos al crear el perfil.',
    PROFILE_UPDATE_DB_ERROR: 'Error de base de datos al editar el perfil.',

    PROJECT_NUMBER_REQUIRED: 'El número de proyecto es requerido.',
    PROJECT_NUMBER_INVALID_TYPE: 'El número de proyecto debe ser texto.',
    PROJECT_NUMBER_TOO_LONG: 'El número de proyecto no debe exceder 50 caracteres.',

    CLIENT_ID_REQUIRED: 'El cliente es requerido.',
    CLIENT_ID_INVALID_UUID: 'El cliente no es válido.',

    DEPARTMENT_ID_REQUIRED: 'El departamento es requerido.',
    DEPARTMENT_ID_INVALID_UUID: 'El departamento no es válido.',
    DEPARTMENT_NOT_FOUND: 'Departamento no encontrado.',

    PRESENTATION_ID_REQUIRED: 'La presentación es requerida.',
    PRESENTATION_ID_INVALID_UUID: 'La presentación no es válida.',
    PRESENTATION_NOT_FOUND: 'Presentación no encontrada.',
    PRESENTATION_FIND_DB_ERROR: 'Error de base de datos al buscar la presentación.',

    UNIT_MEASURE_ID_REQUIRED: 'La unidad es requerida.',
    UNIT_MEASURE_ID_INVALID_UUID: 'La unidad no es válida.',
    UNIT_MEASURE_NOT_FOUND: 'Unidad no encontrada.',
    UNIT_MEASURE_FIND_DB_ERROR: 'Error de base de datos al buscar la unidad.',

    DEPARTMENT_FIND_DB_ERROR: 'Error de la base de datos al buscar el área.',

    CLIENT_NOT_FOUND: 'Cliente no encontrado.',
    CLIENT_FIND_DB_ERROR: 'Error de la base de datos al buscar el cliente.',
    CLIENT_CREATE_DB_ERROR: 'Error de la base de datos al crear el cliente.',
    CLIENT_UPDATE_DB_ERROR: 'Error de la base de datos al editar el cliente.',

    REQUEST_DATE_REQUIRED: 'La fecha de solicitud es requerida.',
    REQUEST_DATE_INVALID_FORMAT: 'La fecha de solicitud no es válida.',

    REASON_ID_REQUIRED: 'La razón es requerida.',
    REASON_ID_INVALID_UUID: 'La razón no es válida.',

    DEPARTMENTS_REQUIRED: 'Los departamentos son requeridos.',
    DEPARTMENTS_INVALID_FORMAT: 'Los departamentos seleccionados no son válidos.',

    // 👤 USERNAME
    USERNAME_REQUIRED: 'El nombre de usuario es requerido.',
    USERNAME_INVALID_TYPE: 'El nombre de usuario debe ser texto.',
    USERNAME_NO_SPACES: 'El nombre de usuario no debe contener espacios.',
    USERNAME_INVALID_FORMAT: 'Solo se permiten letras, números y guiones bajos.',
    USERNAME_TOO_LONG: 'El nombre de usuario no debe exceder 50 caracteres.',

    // 🔑 PASSWORD
    PASSWORD_REQUIRED: 'La contraseña es requerida.',
    PASSWORD_INVALID_TYPE: 'La contraseña debe ser texto.',
    PASSWORD_NEEDS_NUMBER: 'La contrañse debe contener al menos un número.',
    PASSWORD_NEEDS_UPPERCASE: 'La contraseña debe contener al menos una mayúscula.',
    PASSWORD_INVALID_FORMAT: 'La contraseña debe contener al menos un carácter especial.',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres.',
    PASSWORD_TOO_LONG: 'La contraseña no debe exceder 50 caracteres.',

    // 🧑 NAME
    NAME_REQUIRED: 'El nombre es requerido.',
    NAME_INVALID_TYPE: 'El nombre debe ser texto.',
    NAME_TOO_LONG: (meta) => `El nombre no debe exceder ${meta.value} caracteres.`,
    NAME_INVALID_FORMAT: 'El nombre contiene caracteres no válidos.',

    INVOICE_REQUIRED: 'El número de factura es requerido.',
    INVOICE_INVALIDA_TYPE: 'El número de factura debe ser texto.',
    INVOICE_TOO_LONG: (meta) => `El número de factura no debe exceder ${meta.value} caracteres.`,
    INVOICE_INVALIDA_FORMAT: 'El número de factura debe contener letras, números y guiones',

    // 📉 MIN STOCK
    MIN_STOCK_REQUIRED: 'El stock mínimo es requerido.',
    MIN_STOCK_INVALID_NUMBER: 'Debe ser un número.',
    MIN_STOCK_GREATER_THAN_MAX: 'El stock mínimo no puede ser mayor al máximo.',

    // 📈 NEW STOCK
    NEW_STOCK_REQUIRED: 'El stock nuevo es requerido.',
    NEW_STOCK_INVALID_NUMBER: 'El stock nuevo debe ser un número.',

    REQUIRED_QUANTITY: 'La cantidad es requerido.',
    INVALID_FORMAT_QUANTITY: 'La cantidad debe ser un número mayor a cero.',

    // RECEPTION DATE
    RECEPTION_DATE_REQUIRED: 'La fecha de recepción es requerida.',
    RECEPTION_DATE_INVALID_FORMAT: 'La fecha de recepción no es válida.',

    // 📐 BASE
    BASE_INVALID_NUMBER: 'Debe ser un número.',
    BASE_TOO_LONG: 'El valor es demasiado grande.',

    // 📏 HEIGHT
    HEIGHT_INVALID_NUMBER: 'Debe ser un número.',
    HEIGHT_TOO_LONG: 'El valor es demasiado grande.',

    // OBSERVATIONS
    OBSERVATIONS_INVALID_TYPE: 'Las observaciones deben ser texto.',
    OBSERVATIONS_TOO_LONG: (meta) => `Las observaciones no deben exceder más de ${meta.value} caracteres.`,

    INVOICED_REQUIRED: 'El tipo de factura debe ser seleccionado.',
    INVOICED_INVALID_BOOLEAN: 'El estado de la factura debe ser verdadero o falso.',

    // 🔘 ACTIVE
    ACTIVE_REQUIRED: 'El estado activo es requerido.',
    ACTIVE_INVALID_BOOLEAN: 'El estado activo debe ser verdadero o falso.',

    SUPPLIED_REQUIRED: 'El estado surtido es requerido.',
    SUPPLIED_INVALID_BOOLEAN: 'El estado surtido debe ser verdadero o falso',

    // DETAILS
    DETAILS_REQUIRED: 'La lista de detalles debe contener al menos un producto.',
    DETAILS_INVALID_FORMAT_REQUIRED: 'Cada detalle debe contener un producto, una cantidad y un costo por presentación.',
    DETAILS_INVALID_FORMAT_QUANTITY: 'La cantidad de cada detalle debe ser un número mayor a cero.',
    DETAILS_INVALID_FORMAT_SUPPLIER: 'El proveedor de cada detalle es requerido.',
    DETAILS_INVALID_FORMAT_COST_PER_UNIT_TYPE: 'El costo por presentación de cada detalle debe ser un número mayor a cero.',
    DETAILS_INVALID_FORMAT_ID: 'El identificador de cada detalle debe ser un UUID válido.',

    // Códigos de errores de dominio (/errors)
    // Admin / catálogos
    PROFILE_NOT_FOUND: 'Perfil no encontrado.',
    PROFILE_FIND_DB_ERROR: 'Error de base de datos al buscar el perfil.',
    PROFILE_CREATE_DB_ERROR: 'Error de base de datos al crear el perfil.',
    PROFILE_UPDATE_DB_ERROR: 'Error de base de datos al editar el perfil.',

    // Warehouse
    EXCEDED_MAX_RETRIES_SKU: 'Excedido el número máximo de intentos para generar un SKU único.',
    GOODS_RECEIPT_NOT_FOUND: 'Recibo de mercancía no encontrado.',
    GOODS_RECEIPT_CREATE_DB_ERROR: 'Error de base de datos al crear la compra.',
    PRODUCT_NOT_FOUND: 'Producto no encontrado.',
    PRODUCT_CREATE_DB_ERROR: 'Error de base de datos al crear el producto.',
    PRODUCT_UPDATE_DB_ERROR: 'Error de base de datos al editar el producto.',
    PRODUCT_SNAPSHOT_FIND_DB_ERROR: 'Error de base de datos al buscar los datos históricos del producto.',
    PRODUCT_STOCK_UPDATE_DB_ERROR: 'Error de base de datos al editar el stock del producto.',
    PRODUCT_UNIT_COST_UPDATE_DB_ERROR: 'Error de base de datos al editar el costo unitario del producto.',
    SUPPLIER_PRODUCT_CREATE_DB_ERROR: 'Error de base de datos al relacionar el producto a un proveedor.',
    SUPPLIER_PRODUCT_DELETE_DB_ERROR: 'Error de base de datos al eliminar la relación entre producto y proveedor.',
    GOODS_ISSUE_NOT_FOUND: 'Salida de almacén no encontrada.',
    GOODS_ISSUE_DETAIL_NOT_FOUND: 'Detalle de salida de almacén no encontrado.',
    GOODS_ISSUE_CREATE_DB_ERROR: 'Error de base de datos al crear la salida de almacén.',
    GOODS_ISSUE_UPDATE_DB_ERROR: 'Error de base de datos al editar la salida de almacén.',
    GOODS_ISSUE_INEXISTENT_STOCK: (meta) => {

        const hasDimensions =
            meta.base != null &&
            meta.height != null;

        const dimensions = hasDimensions
            ? ` (${ meta.base } x ${ meta.height })`
            : '';

        const supplier = meta.supplierName
            ? meta.supplierName
            : '';

        return `Stock inexistente para realizar la salida con el producto: ${ meta.productName }${ dimensions } y proveedor: ${ supplier }.`;
    },
    GOODS_ISSUE_INSUFFICIENT_STOCK: (meta) => {

        const hasDimensions =
            meta.base != null &&
            meta.height != null;

        const dimensions = hasDimensions
            ? ` (${ meta.base } x ${ meta.height })`
            : '';

        const supplier = meta.supplierName
            ? meta.supplierName
            : '';

        return `Stock insuficiente para realizar la salida con el producto: ${ meta.productName }${ dimensions } y proveedor: ${ supplier }.`;
    },
    GOODS_ISSUE_MISSING_MAX_UNIT_COST: (meta) => {

        const hasDimensions =
            meta.base != null &&
            meta.height != null;

        const dimensions = hasDimensions
            ? ` (${ meta.base } x ${ meta.height })`
            : '';

        const supplier = meta.supplierName
            ? meta.supplierName
            : '';
        
        return `No se puede realizar la salida porque el producto: ${ meta.productName } y proveedor: ${ meta.supplierName } no tiene costo unitario máximo configurado.`
    },
    GOODS_ISSUE_NOT_PENDING_CONFLICT: 'La salida solo puede editarse cuando está pendiente.',
    GOODS_ISSUE_SUPPLIED_CONFLICT: 'La salida ya tiene productos surtidos y no puede editarse en general.',
    GOODS_ISSUE_SUPPLIED_DETAIL_CONFLICT: 'No se pueden editar o eliminar detalles que ya fueron surtidos.',
    GOODS_ISSUE_INTERNAL_CLIENT_ADVISOR_DEPARTMENT_CONFLICT: 'Para el cliente GPG INTERNO, el asesor debe pertenecer al área de almacén.',
    GOODS_ISSUE_INTERNAL_CLIENT_PROJECT_NUMBER_CONFLICT: (meta) => `Para el cliente GPG INTERNO, el número de proyecto ${ meta.projectNumber } no coincide con el área ${ meta.departmentName }.`,
    MOVEMENT_DETAIL_RELATION_CONFLICT: 'El detalle del movimiento no está asociado a un producto o proveedor.',
    PURCHASE_REQUISITION_NOT_FOUND: 'Requisición de compra no encontrada.',
    PROJECT_NOT_FOUND: 'Proyecto no encontrado.',
    PURCHASE_REQUISITION_STATUS_NOT_FOUND: 'Estado de requisición no encontrado.',
    PURCHASE_REQUISITION_UPDATE_DB_ERROR: 'Error de base de datos al editar la requisición de compra.',
    PURCHASE_REQUISITION_STATUS_UPDATE_DB_ERROR: 'Error de base de datos al editar el estado de la requisición.',
    PURCHASE_REQUISITION_APPROVER_PROFILE_NOT_FOUND: 'Perfil aprobador activo no encontrado para el usuario.',

    // Documento / folios
    REFERENCE_NUMBER_UPDATE_DB_ERROR: 'Error de base de datos al actualizar el folio.'
};

const successMessages = {
    CREATED_ACCOUNT: '¡Cuenta registrada exitosamente!',
    UPDATED_ACCOUNT: '¡Cuenta actualizada con éxito!',
    SUCCESS_LOGIN: '¡Inicio de sesión exitoso!',
    SUCCESS_LOGOUT: 'Sesión cerrada exitosamente.',
    CREATED_PROFILE: '¡Perfil creado exitosamente!',
    UPDATED_PROFILE: '¡Perfil actualizado exitosamente!',
    CREATED_PRODUCT: '¡Producto creado exitosamente!',
    UPDATED_PRODUCT: '¡Producto actuallizado exitosamente!',
    CREATED_SUPPLIER: '¡Proveedor creado exitosamente!',
    UPDATED_SUPPLIER: '¡Proveedor actualizado exitosamente!',
    CREATED_GOODS_RECEIPT: '¡Entrada de mercancía creada exitosamente!',
    CREATED_GOODS_ISSUE: '¡Salida de almacén creada exitosamente!',
    UPDATED_GOODS_ISSUE: '¡Salida de almacén actualizada exitosamente!',
    CREATED_PURCHASE_REQUISITION: '¡Requisición de compra creada exitosamente!',
    UPDATED_PURCHASE_REQUISITION: '¡Requisición de compra actualizada exitosamente!',
    CONFIRMED_PURCHASE_REQUISITION: '¡Requisición de compra confirmada exitosamente!',
    CANCELED_PURCHASE_REQUISITION: '¡Requisición de compra cancelada exitosamente!',
    CREATED_CLIENT: '¡Cliente creado exitosamente!',
    UPDATED_CLIENT: '¡Cliente actualizado exitosamente!',
};

export const getErrorMessage = (data = {}) => {

    const { code, meta } = data ?? {};

    if (meta) {

        const fn = errorMessages[code];

        return typeof fn === 'function' ? fn(meta) : code;
    }

    if (code) return errorMessages[code] ?? code;
    
    return null;
}

export const getSuccessMessage = (code) => successMessages[code] ?? code;
