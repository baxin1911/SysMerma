import { initMdbWrapperInput, updateMdbWrapperInput } from "../../mdb/baseInstance.js";
import { initbaseSelect2 } from "../baseSelect.js";

const modalSelector = '#goodsIssueModal';

export const initPurchaseRequisitionFormSelect2 = async (data = null) => {

    const projectSelector = '#projectInput';
    const requesterSelector = '#requesterInput';
    const productSelector = '#productInput';

    initbaseSelect2({
        baseSelector: projectSelector,
        modalSelector,
        url: '/api/admin/projects/',
        placeholder: 'Buscar proyecto...',
        processResults: (data) => {

            const list = data.data || data;
            return {
                results: list.map(project => ({
                    id: project.id,
                    text: `${ project.referenceNumber } - ${ project.name }`
                }))
            };
        }
    });

    initbaseSelect2({
        baseSelector: requesterSelector,
        modalSelector,
        url: '/api/admin/profiles/',
        placeholder: 'Buscar solicitante...',
        processResults: (data) => {

            const list = data.data || data;
            return {
                results: list.map(requester => ({
                    id: requester.id,
                    text: `${ requester.name } ${ requester.lastName }`
                }))
            };
        }
    });

    initbaseSelect2({
        baseSelector: productSelector,
        modalSelector,
        url: '/api/warehouse/products/',
        placeholder: 'Buscar producto...',
        processResults: (data) => {

            const list = data.data || data;
            return {
                results: list.map(product => ({
                    id: product.id,
                    text: product.name,
                    uom: product.presentation || 'PIEZA'
                }))
            };
        }
    });

    $(productSelector).on('select2:select', (e) => {
    
        const selectedProduct = e.params.data;
        const value = `PIEZA(${selectedProduct?.presentation || 'PIEZA'})`;

        const instance = initMdbWrapperInput({ selector: '#presentationDisplayInput', value });
        updateMdbWrapperInput(instance);
    });

    if (data) {

        const projectOption = new Option(
            `${ data.project.referenceNumber } - ${ data.project.name }`,
            data.project.id,
            true,
            true
        );
        $(projectSelector).append(projectOption).trigger('change');

        const requesterOption = new Option(
            `${ data.requester.name } ${ data.requester.lastName }`,
            data.requester.id,
            true,
            true
        );
        $(requesterSelector).append(requesterOption).trigger('change');

    } else {

        $(projectSelector).empty().trigger('change');
        $(requesterSelector).empty().trigger('change');
    }
};