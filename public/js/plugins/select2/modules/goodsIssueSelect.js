import { getSelectedOptionText } from "../../../utils/domUtils.js";
import { resolveAdvisorDepartmentByClientName, isInternalClientName, salesDepartmentName } from "../../../application/warehouse/goodsIssueRules.js";
import { toggleDisabledElement } from "../../../utils/formUtils.js";
import { bindDependency } from "../baseSelect.js";
import { setupClientSelect, toggleClientOption } from "../domains/client.js";
import { initDepartmentSelect, toggleDepartmentOption } from "../domains/department.js";
import { setupProductSelect, toggleProductOption } from "../domains/product.js";
import { initProfileSelect, toggleProfileOption } from "../domains/profile.js";

const modalSelector = '#goodsIssueModal';
const requesterSelector = '#requesterInput';
const clientSelector = '#clientInput';
const departmentSelector = '#departmentInput';
const advisorSelector = '#advisorInput';
const productSelector = '#productInput';
const requesterScopedSelector = `${ modalSelector } ${ requesterSelector }`;
const clientScopedSelector = `${ modalSelector } ${ clientSelector }`;
const departmentScopedSelector = `${ modalSelector } ${ departmentSelector }`;
const advisorScopedSelector = `${ modalSelector } ${ advisorSelector }`;
const productScopedSelector = `${ modalSelector } ${ productSelector }`;

export const initGoodsIssueFormSelect2 = () => {

    const modal = document.querySelector(modalSelector);
    const requesterSelectElement = modal?.querySelector(requesterSelector);
    const getModalSelectedOptionText = (selector) => getSelectedOptionText(selector, modal);

    initDepartmentSelect({
        modalSelector,
        baseSelector: departmentScopedSelector,
        allowCreate: false
    });

    setupClientSelect({
        modalSelector,
        clientSelector,
    });

    initProfileSelect({
        modalSelector,
        baseSelector: advisorScopedSelector,
        placeholder: 'Buscar asesor...',
        data: (params) => {

            return {
                search: params.term,
                department: resolveAdvisorDepartmentByClientName({
                    clientName: getModalSelectedOptionText(clientSelector),
                    fallbackDepartment: salesDepartmentName
                }),
                strictDepartmentFilter: true
            };
        },
        allowCreate: false,
    });

    initProfileSelect({
        modalSelector,
        baseSelector: requesterScopedSelector,
        placeholder: 'Buscar solicitante...',
        data: (params) => {

            const department = getModalSelectedOptionText(departmentSelector);

            return {
                search: params.term,
                department,
                strictDepartmentFilter: true
            };
        },
        allowCreate: false,
    });

    toggleDisabledElement({
        element: requesterSelectElement,
        isDisabled: true
    });

    bindDependency({
        sourceSelector: departmentScopedSelector,
        onChange: ({ value }) => {
            const isDisabled = !value;

            toggleProfileOption({
                selector: requesterScopedSelector,
                id: null,
                name: null
            });

            $(requesterScopedSelector).val(null).trigger('change');

            toggleDisabledElement({
                element: requesterSelectElement,
                isDisabled
            });
        }
    });

    bindDependency({
        sourceSelector: clientScopedSelector,
        onChange: () => {
            if (!isInternalClientName(getModalSelectedOptionText(clientSelector))) return;

            toggleProfileOption({
                selector: advisorScopedSelector,
                id: null,
                name: null
            });

            $(advisorScopedSelector).val(null).trigger('change');
        }
    });

    // bindChangeResetSelect({
    //     sourceSelector: `${ modalSelector } ${ advisorSelector }`,
    //     targetSelector: `${ modalSelector } ${ clientSelector }`,
    //     reset: () => {
    //         toggleClientOption({
    //             selector: clientScopedSelector,
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
        selector: departmentScopedSelector,
        id: data?.departmentId,
        name: data?.departmentName
    });

    toggleClientOption({
        selector: clientScopedSelector,
        id: data?.clientId,
        name: data?.clientName
    });

    toggleProfileOption({
        selector: advisorScopedSelector,
        id: data?.advisorId,
        name: data?.advisorName
    });

    toggleProfileOption({
        selector: requesterScopedSelector,
        id: data?.requesterId,
        name: data?.requesterName
    });

    toggleProductOption({
        selector: productScopedSelector,
        data: {
            id: null,
            text: null,
        }
    });
}
