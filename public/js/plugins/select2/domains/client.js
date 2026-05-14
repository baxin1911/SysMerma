import { getAllClientsRequest } from "../../../services/sales/clientService.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initClientSelect = ({ 
    modalSelector, 
    advisorSelector,
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        modalSelector,
        get: getAllClientsRequest,
        placeholder: 'Buscar cliente...',
        // data: (params) => {

        //     let advisorId;

        //     if (advisorSelector) advisorId = document.querySelector(`${ modalSelector } ${ advisorSelector }`).value;
        //     else advisorId = '';

        //     return {
        //         search: params.term,
        //         advisorId
        //     }
        // },
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(c => ({
                    id: c.id,
                    text: c.name,
                }))
            };
        },
        ...(allowCreate && {
            tags: true,
            createTag: (params) => {

                const term = params.term.trim();

                if (!term) return null;

                return {
                    id: `new:${ term }`,
                    text: `${ term } (Nuevo cliente)`,
                    newTag: true
                };
            }
        })
    });
};

export const toggleClientOption = ({ 
    selector, 
    id = null, 
    name = null
}) => toggleSelectOption({
    selector,
    data: {
        id,
        text: name
    }
});