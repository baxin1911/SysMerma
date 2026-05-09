import { openProductModal } from "../../../modules/products/productModal.js";
import { PRODUCTS_API_ROUTE } from "../../../services/warehouse/productService.js";
import { initbaseSelect2, setMdbWrapperInputValue, toggleSelectOption } from "../baseSelect.js";

const wrapperSelector = '#presentationDisplayInput';

const initProductSelect = ({ 
    modalSelector, 
    supplierSelector,
    baseSelector, 
    allowCreate = true 
}) => {

    initbaseSelect2({
        baseSelector,
        modalSelector,
        url: PRODUCTS_API_ROUTE,
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
    productSelector, 
    supplierSelector
}) => {

    $(productSelector).off('select2:select').on('select2:select', (e) => {

        const { data } = e.params;

        if (data.newTag) {

            const name = data.id.replace('new:', '');
            const id = $(`${ modalSelector } ${ supplierSelector }`).val();
            const tradeName = $(`${ modalSelector } ${ supplierSelector } option:selected`).text();

            if (!id) {
                $(productSelector).val(null).trigger('change');
                alert('Selecciona primero un proveedor para crear productos.');
                return;
            }

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
                        selector: productSelector,
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
                        selector: wrapperSelector,
                        value: createdProduct.presentation.name
                    });
                }
            });

            return;
        }

        const option = document.querySelector('#productInput option:checked');

        if (!option) return;

        Object.entries(data).forEach(([key, value]) => {
            option.dataset[key] = value;
        });

        const value = data.presentationName || '';
        setMdbWrapperInputValue({
            selector: wrapperSelector,
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
        productSelector: `${ modalSelector } ${ productSelector }`,
        supplierSelector
    });
};