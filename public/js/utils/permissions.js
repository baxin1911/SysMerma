export const hasPermission = (user) => {

    const accesses = user.accesses || [];
    const departments = accesses.map(a => a.department);
    const roles = accesses.map(a => a.role);

    const hasDepartment = (dept) => departments.includes(dept);
    const hasRole = (role) => roles.includes(role);

    return {
        hasDepartment,
        hasRole,
        isAdmin: hasRole('Administrador del sistema'),
        isWarehouse: hasDepartment('ALMACÉN Y PROVEDURÍA'),
        isSystem: hasDepartment('SISTEMAS'),
        isSales: hasDepartment('VENTAS Y PROYECTOS ESPECIALES'),
        isCoordinatorOfArea: (dept) => hasRole('Coordinador') && hasDepartment(dept)
    }
}
