import { getAllDepartments } from "../../../application/admin/departments.js";
import { initbaseSelect2, toggleSelectOption, toggleSelectOptions } from "../baseSelect.js";

export const initDepartmentSelect = ({ 
    multiple = false,
    clearOnOpen = true,
    modalSelector, 
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        clearOnOpen,
        containerSelector: modalSelector,
        multiple,
        get: getAllDepartments,
        placeholder: 'Buscar área...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(d => ({
                    id: d.id,
                    text: d.name,
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
                    text: `${ term } (Nueva área)`,
                    newTag: true
                };
            }
        })
    });
};

export const toggleDepartmentOption = ({ 
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

export const toggleDepartmentOptions = ({ 
    selector, 
    data = []
}) => {

    const options = data.map(d => ({
        id: d.id,
        text: d.name
    }));

    toggleSelectOptions({
        selector,
        data: options
    });
}