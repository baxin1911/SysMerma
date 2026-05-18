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
const supplierScopedSelector = `${ modalSelector } ${ supplierSelector }`;
const productScopedSelector = `${ modalSelector } ${ productSelector }`;
const receivedByScopedSelector = `${ modalSelector } ${ receivedBySelector }`;
const presentationDisplayScopedSelector = `${ modalSelector } #presentationDisplayInput`;
const supplierChangedEventName = 'goods-receipt:supplier-changed';

export const initGoodsReceiptFormSelect2 = () => {

    const modal = document.querySelector(modalSelector);
    const supplierInput = modal?.querySelector(supplierSelector);
    const productInput = modal?.querySelector(productSelector);

    bindDependency({
        sourceSelector: supplierScopedSelector,
        onChange: ({ value }) => {

            const isDisabled = !value;

            toggleContainerElements({
                selector: '.add-product-container',
                isDisabled,
                root: modal
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
        baseSelector: receivedByScopedSelector,
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
                selector: presentationDisplayScopedSelector,
                value: ''
            });

            updateMdbWrapperInput(instance);

            modal?.dispatchEvent(new Event(supplierChangedEventName));
        });
    }
}

export const GOODS_RECEIPT_SUPPLIER_CHANGED_EVENT = supplierChangedEventName;

export const setGoodsReceiptFormSelectOptions = (data = null) => {

    toggleSupplierOption({
        selector: supplierScopedSelector,
        id: data?.supplierId,
        name: `${ data?.supplierName }`
    });

    toggleProfileOption({
        selector: receivedByScopedSelector,
        id: data?.receivedById,
        name: data?.receivedByName,
    });

    toggleProductOption({
        selector: productScopedSelector,
        data: {
            id: null,
            text: null,
        }
    });
}
