import { getAllProfiles } from "../../../application/admin/profiles.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initProfileSelect = ({ 
    modalSelector, 
    baseSelector, 
    placeholder, 
    clearOnOpen = true,
    data, 
    allowCreate = true 
}) => {

    initbaseSelect2({
        baseSelector,
        containerSelector: modalSelector,
        get: getAllProfiles,
        clearOnOpen,
        data,
        placeholder,
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(p => ({
                    id: p.id,
                    text: p.fullName
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
                    text: `${ term } (Nuevo perfil)`,
                    newTag: true
                };
            }
        })
    });
};

export const toggleProfileOption = ({ 
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