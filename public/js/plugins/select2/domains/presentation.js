import { getAllPresentations } from "../../../application/warehouse/presentations.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initPresentationSelect = ({ 
    modalSelector, 
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        containerSelector: modalSelector,
        get: getAllPresentations,
        placeholder: 'Buscar presentación...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(p => ({
                    id: p.id,
                    text: p.name,
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
                    text: `${ term } (Nueva presentación)`,
                    newTag: true
                };
            }
        })
    });
};

export const togglePresentationOption = ({ 
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