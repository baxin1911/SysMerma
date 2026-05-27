import { initDepartmentSelect, toggleDepartmentOption } from "../domains/department.js";
import { initRoleSelect, toggleRoleOption } from "../domains/role.js";

const modalSelector = '#userModal';
const departmentSelector = '#departmentIdInput';
const roleSelector = '#roleIdInput';

const departmentScopedSelector = `${ modalSelector } ${ departmentSelector }`;
const roleScopedSelector = `${ modalSelector } ${ roleSelector }`;

export const initUserFormSelect2 = () => {
    initDepartmentSelect({
        modalSelector,
        baseSelector: departmentScopedSelector,
        allowCreate: false
    });

    initRoleSelect({
        modalSelector,
        baseSelector: roleScopedSelector
    });
};

export const setUserFormSelectOptions = (data = null) => {
    toggleDepartmentOption({
        selector: departmentScopedSelector,
        id: data?.departmentId,
        name: data?.departmentName
    });

    toggleRoleOption({
        selector: roleScopedSelector,
        id: data?.roleId,
        name: data?.roleName
    });
};
