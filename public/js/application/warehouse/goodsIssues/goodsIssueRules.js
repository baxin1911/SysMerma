import { normalizeText } from "../../../utils/formatters.js";

export const internalClientName = 'GPG INTERNO';
export const warehouseDepartmentName = 'ALMACÉN Y PROVEDURÍA';
export const salesDepartmentName = 'VENTAS Y PROYECTOS ESPECIALES';
export const managementDepartmentName = 'DIRECCIÓN';

export const projectNumberByDepartment = new Map([
    ['DIRECCIÓN', '120000'],
    ['ACABADOS', '120001'],
    ['ADMINISTRATIVO', '120002'],
    ['ALMACÉN Y PROVEDURÍA', '120003'],
    ['DISEÑO', '120004'],
    ['INSTALACIONES', '120005'],
    ['IMPRESIÓN', '120006'],
    ['ROUTER', '120007'],
    ['PT/TRÁFICO', '120008'],
    ['SERVICIOS Y VIGILANCIA', '120009'],
    ['SISTEMAS', '120010'],
    ['TALLER 3D', '120011'],
    ['VENTAS Y PROYECTOS ESPECIALES', '120012']
]);

export const isInternalClientName = (clientName = '') => (
    normalizeText(clientName) === normalizeText(internalClientName)
);

export const resolveAdvisorDepartmentByClientName = ({
    clientName = ''
} = {}) => {

    if (isInternalClientName(clientName)) return warehouseDepartmentName;

    return [salesDepartmentName, managementDepartmentName];
};

export const resolveProjectNumberByClientAndDepartment = ({
    clientName = '',
    departmentName = ''
} = {}) => {

    if (!isInternalClientName(clientName)) return '';

    return projectNumberByDepartment.get(departmentName) || '';
};
