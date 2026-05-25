import { getAllUnitMeasures } from "../../../application/warehouse/unitMeasures.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initUnitMeasureSelect = ({ 
    modalSelector, 
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        modalSelector,
        get: getAllUnitMeasures,
        placeholder: 'Buscar unidad...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(u => ({
                    id: u.id,
                    text: `${ u.symbol } - ${ u.name }`,
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
                    text: `${ term } (Nueva unidad)`,
                    newTag: true
                };
            }
        })
    });
};

export const toggleUnitMeasureOption = ({ 
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