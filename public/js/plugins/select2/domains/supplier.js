import { openSupplierModal } from "../../../modules/suppliers/supplierModal.js";
import { getAllSuppliers, getSupplierOptions } from "../../../application/warehouse/suppliers.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

const supplierSelector = '#supplierFilter';

export const getSupplierSelectApi = () => ({
    getSelect: () => document.querySelector(supplierSelector),
    getValue: () => document.querySelector(supplierSelector)?.value || ''
});

export const initSupplierFilterSelect = ({
    selectedId = null
}) => {

    initbaseSelect2({
        baseSelector: supplierSelector,
        modalSelector: 'body',
        get: async (params) => ({
            data: await getSupplierOptions(params)
        }),
        clearOnOpen: false,
        placeholder: 'Filtrar por proveedor',
        data: (params) => ({
            search: params.term
        }),
        processResults: (data) => {
            const list = data.data || data;
            return {
                results: list.map(supplier => ({
                    id: supplier.value,
                    text: supplier.label
                }))
            };
        }
    });

    if (!selectedId) {

        $(supplierSelector).val('').trigger('change');
        return;
    }

    const currentOption = $(`${ supplierSelector } option[value=\"${ selectedId }\"]`);

    if (currentOption.length) {
        $(supplierSelector).val(selectedId).trigger('change');
    }
};

export const attachSupplierFilterHandler = ({
    onChange
}) => {
    
    $(supplierSelector).off('select2:select').on('select2:select', () => {

        const select = document.querySelector(supplierSelector);
        const value = select?.value || '';

        onChange?.(value);
    });
};

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