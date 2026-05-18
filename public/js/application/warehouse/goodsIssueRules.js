import { normalizeText } from "../../utils/formatters.js";

export const internalClientName = 'GPG INTERNO';
export const warehouseDepartmentName = 'ALMACÉN Y PROVEDURÍA';
export const salesDepartmentName = 'VENTAS Y PROYECTOS ESPECIALES';

export const isInternalClientName = (clientName = '') => (
    normalizeText(clientName) === normalizeText(internalClientName)
);

export const resolveAdvisorDepartmentByClientName = ({
    clientName = '',
    fallbackDepartment = ''
} = {}) => {

    if (isInternalClientName(clientName)) return warehouseDepartmentName;

    return fallbackDepartment;
};
