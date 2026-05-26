import { initDepartmentSelect, toggleDepartmentOption } from "../domains/department.js";

const departmentSelector = '.department-select';

export const initProfileFormSelect2 = ({ modalSelector }) => {

    const departmentSelectorScoped = `${ modalSelector } ${ departmentSelector }`;

    initDepartmentSelect({
        modalSelector,
        clearOnOpen: false,
        multiple: true,
        baseSelector: departmentSelectorScoped,
        allowCreate: false
    });
}

export const setProfileFormSelectOptions = ({
    modalSelector,
    data = null 
}) => {

    toggleDepartmentOption({
        selector: departmentSelector,
        id: data?.department?.id,
        name: data?.department?.name
    });
}