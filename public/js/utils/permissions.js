export const departments = {
    warehouse: 'ALMACÉN Y PROVEDURÍA',
    systems: 'SISTEMAS',
    sales: 'VENTAS Y PROYECTOS ESPECIALES'
};

export const productManagerRoles = ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'];

export const hasUserAccess = (user = {}, department, allowedRoles = []) => (user.accesses || []).some(access =>
    access.department === department && (allowedRoles.length === 0 || allowedRoles.includes(access.role))
);

export const canManageProducts = (user = {}) =>
    hasUserAccess(user, departments.warehouse, productManagerRoles) ||
    hasUserAccess(user, departments.systems, productManagerRoles);

export const canAdjustProductStock = (user = {}) =>
    hasUserAccess(user, departments.systems, productManagerRoles);

export const hasPermission = (user) => {

    const accesses = user.accesses || [];
    const departmentsList = accesses.map(a => a.department);
    const roles = accesses.map(a => a.role);

    const hasDepartment = (dept) => departmentsList.includes(dept);
    const hasRole = (role) => roles.includes(role);

    return {
        hasDepartment,
        hasRole,
        hasAccess: (department, allowedRoles = []) => hasUserAccess(user, department, allowedRoles),
        isAdmin: hasRole('Administrador del sistema'),
        isWarehouse: hasDepartment(departments.warehouse),
        isSystem: hasDepartment(departments.systems),
        isSales: hasDepartment(departments.sales),
        isCoordinatorOfArea: (dept) => hasRole('Coordinador') && hasDepartment(dept)
    }
}
