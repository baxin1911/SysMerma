import { openProductModal } from "../../../modules/products/productModal.js";
import { getAllProducts, getProductOptions } from "../../../application/warehouse/products.js";
import { initbaseSelect2, setMdbWrapperInputValue, toggleSelectOption } from "../baseSelect.js";

const wrapperSelector = '#presentationDisplayInput';
const productSelector = '#productFilter';

export const getProductSelectApi = () => ({
    getSelect: () => document.querySelector(productSelector),
    getValue: () => document.querySelector(productSelector)?.value || ''
});

export const initProductFilterSelect = ({
    selectedId = null,
    supplierFilterSelector = null
}) => {

    const baseSelector = 'body';

    initbaseSelect2({
        baseSelector: productSelector,
        containerSelector: baseSelector,
        get: async (params) => ({
            data: await getProductOptions(params)
        }),
        clearOnOpen: false,
        placeholder: 'Filtrar por producto',
        data: (params) => {

            let supplierId;

            if (supplierFilterSelector) supplierId = $(`${ baseSelector } ${ supplierFilterSelector }`).val();
            else supplierId = ''

            return {
                search: params.term,
                supplierId
            };
        },
        processResults: (data) => {

            const list = data.data || data;
            
            return {
                results: list.map(p => ({
                    ...p
                }))
            };
        }
    });

    if (!selectedId) return;

    const currentOption = $(`${ productSelector } option[value=\"${ selectedId }\"]`);

    if (currentOption.length) $(productSelector).val(selectedId).trigger('change');
};

export const attachProductFilterHandler = ({
    onChange
}) => {
    
    $(productSelector).off('select2:select').on('select2:select', () => {
            
        const select = document.querySelector(productSelector);
        const value = select?.value || '';

        onChange?.(value);
    });
};

const initProductSelect = ({ 
    modalSelector, 
    supplierSelector,
    baseSelector, 
    allowCreate = true 
}) => {

    initbaseSelect2({
        baseSelector,
        containerSelector: modalSelector,
        get: getAllProducts,
        placeholder: 'Buscar producto...',
        data: (params) => {

            let supplierId;

            if (supplierSelector) supplierId = $(`${ modalSelector } ${ supplierSelector }`).val();
            else supplierId = ''

            return {
                search: params.term,
                supplierId
            };
        },
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(p => {

                    let text;

                    if (!p.base || !p.height) text = `${ p.name } || ${ p.supplier.tradeName }`;
                    else text = `${ p.name } (${ p.base } x ${ p.height }) || ${ p.supplier.tradeName }`;

                    return {
                        id: p.id,
                        text,
                        productName: p.name,
                        presentationName: p.presentation.name,
                        unitMeasureName: p.unitMeasure.name,
                        productBase: p.base,
                        productHeight: p.height,
                        supplierName: p.supplier.tradeName,
                        supplierId: p.supplier.id
                    }
                })
            };
        },
        ...(allowCreate && {
            tags: true,
            createTag: (params) => {

                const term = params.term.trim();

                if (!term) return null;

                return {
                    id: `new:${ term }`,
                    text: `${ term } (Nuevo producto)`,
                    newTag: true
                };
            }
        })
    });
};

const attachProductHandler = ({ 
    modalSelector,
    baseSelector, 
    supplierSelector
}) => {

    $(baseSelector).off('select2:select').on('select2:select', (e) => {

        const { data } = e.params;

        if (data.newTag) {

            const name = data.id.replace('new:', '');
            const id = $(`${ modalSelector } ${ supplierSelector }`).val();
            const tradeName = $(`${ modalSelector } ${ supplierSelector } option:selected`).text();

            openProductModal({
                data: {
                    name,
                    supplier: {
                        id,
                        tradeName,
                    }
                },
                onSave: (createdProduct) => {

                    let text;

                    if (!createdProduct.base || !createdProduct.height) text = `${ createdProduct.name } || ${ createdProduct.supplier.tradeName }`;
                    else text = `${ createdProduct.name } (${ createdProduct.base } x ${ createdProduct.height }) || ${ createdProduct.supplier.tradeName }`;

                    toggleProductOption({
                        selector: baseSelector,
                        data: {
                            id: createdProduct.id,
                            text,
                            productName: createdProduct.name,
                            presentationName: createdProduct.presentation.name,
                            unitMeasureName: createdProduct.unitMeasure.name,
                            productBase: createdProduct.base,
                            productHeight: createdProduct.height,
                            supplierName: createdProduct.supplier.tradeName,
                            supplierId: createdProduct.supplier.id
                        }
                    });
                    
                    setMdbWrapperInputValue({
                        selector: `${ modalSelector } ${ wrapperSelector }`,
                        value: createdProduct.presentation.name
                    });
                }
            });

            return;
        }

        const option = e.target.querySelector('option:checked');

        if (!option) return;

        Object.entries(data).forEach(([key, value]) => {
            option.dataset[key] = value;
        });

        const value = data.presentationName || '';

        setMdbWrapperInputValue({
            selector: `${ modalSelector } ${ wrapperSelector }`,
            value
        });
    });
};

export const toggleProductOption = ({ 
    selector, 
    data
}) => toggleSelectOption({
    selector,
    data
});

export const setupProductSelect = ({ 
    modalSelector, 
    supplierSelector = null,
    productSelector,
    allowCreate = true
}) => {

    initProductSelect({
        modalSelector,
        supplierSelector,
        baseSelector: `${ modalSelector } ${ productSelector }`,
        allowCreate
    });

    attachProductHandler({
        modalSelector,
        baseSelector: `${ modalSelector } ${ productSelector }`,
        supplierSelector
    });
};