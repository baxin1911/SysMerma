import { toggleDisabledElement } from "../../../utils/formUtils.js";
import { notifications } from "../../swal/swalComponent.js";
import { bindDependency } from "../baseSelect.js";
import { initClientSelect, toggleClientOption } from "../domains/client.js";
import { initDepartmentSelect, toggleDepartmentOption } from "../domains/department.js";
import { setupProductSelect, toggleProductOption } from "../domains/product.js";
import { initProfileSelect, toggleProfileOption } from "../domains/profile.js";

const modalSelector = '#goodsIssueModal';
const requesterSelector = '#requesterInput';
const clientSelector = '#clientInput';
const departmentSelector = '#departmentInput';
const advisorSelector = '#advisorInput';
const productSelector = '#productInput';

export const initGoodsIssueFormSelect2 = () => {

    initDepartmentSelect({
        modalSelector,
        baseSelector: `${ modalSelector } ${ departmentSelector }`,
        allowCreate: false
    });

    initClientSelect({
        modalSelector,
        advisorSelector,
        baseSelector: `${ modalSelector } ${ clientSelector }`,
        allowCreate: false
    });

    initProfileSelect({
        modalSelector, 
        baseSelector: `${ modalSelector } ${ advisorSelector }`,
        placeholder: 'Buscar asesor...',
        data: (params) => {

            return {
                search: params.term,
                department: 'VENTAS Y PROYECTOS ESPECIALES',
                strictDepartmentFilter: true
            };
        },
        allowCreate: false,
    });

    initProfileSelect({
        modalSelector, 
        baseSelector: `${ modalSelector } ${ requesterSelector }`,
        placeholder: 'Buscar solicitante...',
        data: (params) => {

            const select = document.querySelector(`${modalSelector} ${departmentSelector}`);
            const department = select?.selectedOptions[0]?.text.trim();

            return {
                search: params.term,
                department,
                strictDepartmentFilter: true
            };
        },
        allowCreate: false,
    });

    const requesterSelectElement = document.querySelector(`${ modalSelector } ${ requesterSelector }`);

    toggleDisabledElement({ 
        element: requesterSelectElement, 
        isDisabled: true 
    });

    bindDependency({
        sourceSelector: `${ modalSelector } ${ departmentSelector }`,
        onChange: ({ value }) => {
            const isDisabled = !value;

            toggleProfileOption({
                selector: `${ modalSelector } ${ requesterSelector }`,
                id: null,
                name: null
            });

            $(`${ modalSelector } ${ requesterSelector }`).val(null).trigger('change');

            toggleDisabledElement({ 
                element: requesterSelectElement, 
                isDisabled 
            });
        }
    });

    // bindChangeResetSelect({
    //     sourceSelector: `${ modalSelector } ${ advisorSelector }`,
    //     targetSelector: `${ modalSelector } ${ clientSelector }`,
    //     reset: () => {
    //         toggleClientOption({
    //             selector: `${ modalSelector } ${ clientSelector }`,
    //             id: null,
    //             name: null
    //         });
    //     }
    // });

    setupProductSelect({
        modalSelector,
        productSelector,
        allowCreate: false
    });
};

export const setGoodsIssueFormSelectOptions = (data = null) => {

    toggleDepartmentOption({
        selector: `${ modalSelector } ${ departmentSelector }`,
        id: data?.departmentId,
        name: data?.departmentName
    });

    toggleClientOption({
        selector: `${ modalSelector } ${ clientSelector }`,
        id: data?.clientId,
        name: data?.clientName
    });

    toggleProfileOption({
        selector: `${ modalSelector } ${ advisorSelector }`,
        id: data?.advisorId,
        name: data?.advisorName
    });

    toggleProfileOption({
        selector: `${ modalSelector } ${ requesterSelector }`,
        id: data?.requesterId,
        name: data?.requesterName
    });

    toggleProductOption({
        selector: `${ modalSelector } ${ productSelector }`,
        data: {
            id: null,
            text: null,
        }
    });
}
