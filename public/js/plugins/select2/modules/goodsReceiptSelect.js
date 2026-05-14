import { openProductModal } from "../../../modules/products/productModal.js";
import { openSupplierModal } from "../../../modules/suppliers/supplierModal.js";
import { updateTotals } from "../../../ui/formUI.js";
import { toggleContainerElements, toggleDisabledElement } from "../../../utils/formUtils.js";
import { refreshProductTable } from "../../datatable/baseDatatable.js";
import { details } from "../../datatable/goodsReceiptDatatable.js";
import { initMdbWrapperInput, updateMdbWrapperInput } from "../../mdb/baseInstance.js";
import { bindDependency } from "../baseSelect.js";
import { setupProductSelect, toggleProductOption } from "../domains/product.js";
import { initProfileSelect, toggleProfileOption } from "../domains/profile.js";
import { setupSupplierSelect, toggleSupplierOption } from "../domains/supplier.js";

const modalSelector = '#goodsReceiptModal';
const productSelector = '#productInput';
const supplierSelector = '.supplier-select';
const receivedBySelector = '#receivedByInput';
const supplierChangedEventName = 'goods-receipt:supplier-changed';

export const initGoodsReceiptFormSelect2 = () => {  
    
    bindDependency({
        sourceSelector: `${ modalSelector } ${ supplierSelector }`,
        onChange: ({ value }) => {

            const isDisabled = !value;

            toggleContainerElements({
                selector: '.add-product-container',
                isDisabled
            });

            details.length = 0;

            refreshProductTable(details);

            updateTotals();
        }
    });

    setupSupplierSelect({
        modalSelector,
        supplierSelector
    });

    initProfileSelect({
        modalSelector, 
        baseSelector: `${ modalSelector } ${ receivedBySelector }`,
        placeholder: 'Buscar persona que recibe...',
        data: (params) => {
            
            return {
                search: params.term,
                department: 'ALMACÉN Y PROVEDURÍA',
                strictDepartmentFilter: true
            };
        },
        allowCreate: false,
    });

    setupProductSelect({
        modalSelector,
        supplierSelector,
        productSelector,
    });

    const supplierInput = document.querySelector(`${ modalSelector } ${ supplierSelector }`);
    const productInput = document.querySelector(`${ modalSelector } ${ productSelector }`);

    if (supplierInput) {

        if (supplierInput.dataset.productFilterBound === 'true') return;

        supplierInput.dataset.productFilterBound = 'true';

        supplierInput.addEventListener('change', () => {

            const hasSupplier = !!supplierInput.value;

            toggleDisabledElement({
                element: productInput,
                isDisabled: hasSupplier
            });

            const instance = initMdbWrapperInput({
                selector: '#presentationDisplayInput',
                value: ''
            });

            updateMdbWrapperInput(instance);

            const modal = document.querySelector(modalSelector);

            modal.dispatchEvent(new Event(supplierChangedEventName));
        });
    }
}

export const GOODS_RECEIPT_SUPPLIER_CHANGED_EVENT = supplierChangedEventName;

export const setGoodsReceiptFormSelectOptions = (data = null) => {

    toggleSupplierOption({
        selector: `${ modalSelector } ${ supplierSelector }`,
        id: data?.supplierId,
        name: `${ data?.supplierName }`
    });

    toggleProfileOption({
        selector: `${ modalSelector } ${ receivedBySelector }`,
        id: data?.receivedById,
        name: data?.receivedByName,
    });

    toggleProductOption({
        selector: `${ modalSelector } ${ productSelector }`,
        data: {
            id: null,
            text: null,
        }
    });
}
