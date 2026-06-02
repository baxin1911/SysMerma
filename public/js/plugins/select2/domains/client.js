import { openClientModal } from "../../../modules/clients/clientModal.js";
import { getAllClients } from "../../../application/sales/clients.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initClientSelect = ({ 
    modalSelector, 
    advisorSelector = null,
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        containerSelector: modalSelector,
        get: getAllClients,
        placeholder: 'Buscar cliente...',
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

const attachClientHandler = ({ 
    modalSelector, 
    advisorSelector = null,
    baseSelector, 
}) => {

    $(baseSelector).off('select2:select').on('select2:select', (e) => {

        const data = e.params.data;

        if (data.newTag) {

            const name = data.id.replace('new:', '');
            
            openClientModal({
                data: { name },
                onSave: (createdClient) => {

                    toggleClientOption({
                        selector: baseSelector,
                        id: createdClient.id,
                        text: createdClient.name
                    });
                }
            });

            return;
        }
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

export const setupClientSelect = ({ 
    modalSelector, 
    clientSelector,
    allowCreate = true,
}) => {

    initClientSelect({
        modalSelector,
        baseSelector: `${ modalSelector } ${ clientSelector }`,
        allowCreate
    });

    attachClientHandler({
        modalSelector,
        baseSelector: `${ modalSelector } ${ clientSelector }`,
    });
};