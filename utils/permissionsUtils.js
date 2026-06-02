export const departments = {
    warehouse: 'ALMACÉN Y PROVEDURÍA',
    systems: 'SISTEMAS',
    sales: 'VENTAS Y PROYECTOS ESPECIALES'
};

export const productManagerRoles = ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'];

export const hasAccess = (user = {}, department, allowedRoles = []) => (user.accesses || []).some(access =>
    access.department === department && (allowedRoles.length === 0 || allowedRoles.includes(access.role))
);

export const canManageProducts = (user = {}) =>
    hasAccess(user, departments.warehouse, productManagerRoles) ||
    hasAccess(user, departments.systems, productManagerRoles);

export const canAdjustProductStock = (user = {}) =>
    hasAccess(user, departments.systems, productManagerRoles);
