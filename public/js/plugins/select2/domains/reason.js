import { getAllReasons } from "../../../application/warehouse/reasons.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initReasonSelect = ({ 
    modalSelector, 
    baseSelector, 
    clearOnOpen = true,
    data, 
    allowCreate = true 
}) => {

    initbaseSelect2({
        baseSelector,
        modalSelector,
        get: getAllReasons,
        clearOnOpen,
        data,
        placeholder: 'Seleccione una razón...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(p => ({
                    id: p.id,
                    text: p.name
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
                    text: `${ term } (Nueva razón)`,
                    newTag: true
                };
            }
        })
    });
};

export const toggleReasonOption = ({ 
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