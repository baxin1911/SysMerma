import { openSupplierModal } from "../../../modules/suppliers/supplierModal.js";
import { getAllSuppliers } from "../../../application/warehouse/suppliers.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

const initSupplierSelect = ({ 
    modalSelector, 
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        modalSelector,
        get: getAllSuppliers,
        placeholder: 'Buscar proveedor...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(s => ({
                    id: s.id,
                    text: `${ s.tradeName }`,
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
                    text: `${ term } (Nuevo proveedor)`,
                    newTag: true
                };
            }
        })
    });
};

const attachSupplierHandler = ({ supplierSelector }) => {

    $(supplierSelector).off('select2:select').on('select2:select', (e) => {

        const selected = e.params.data;

        if (selected.newTag) {

            const tradeName = selected.id.replace('new:', '');

            openSupplierModal({
                data: { tradeName },
                onSave: (createdsupplier) => {

                    toggleSupplierOption({
                        selector: supplierSelector,
                        supplierId: createdsupplier.id,
                        supplierName: `${ createdsupplier.tradeName }`
                    });
                }
            });

            return;
        }
    });
};

export const toggleSupplierOption = ({ 
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

export const setupSupplierSelect = ({ 
    modalSelector, 
    supplierSelector
}) => {

    initSupplierSelect({
        modalSelector,
        baseSelector: `${ modalSelector } ${ supplierSelector }`,
    });

    attachSupplierHandler({
        supplierSelector: `${ modalSelector } ${ supplierSelector }`
    });
};