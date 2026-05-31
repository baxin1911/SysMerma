import { getAllRoles } from '../../../application/admin/roles.js';
import { initbaseSelect2, toggleSelectOption } from '../baseSelect.js';

export const initRoleSelect = ({
    modalSelector,
    baseSelector
}) => {

    initbaseSelect2({
        baseSelector,
        containerSelector: modalSelector,
        get: getAllRoles,
        placeholder: 'Buscar rol...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map((role) => ({
                    id: role.id,
                    text: role.name
                }))
            };
        }
    });
};

export const toggleRoleOption = ({
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
