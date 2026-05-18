import { openSupplierModal } from "../../../modules/suppliers/supplierModal.js";
import { initPresentationSelect, togglePresentationOption } from "../domains/presentation.js";
import { setupSupplierSelect, toggleSupplierOption } from "../domains/supplier.js";
import { initUnitMeasureSelect, toggleUnitMeasureOption } from "../domains/unitMeasure.js";

const modalSelector = '#productModal';
const supplierSelector = '.supplier-select';
const unitMeasureSelector = '#unitMeasureInput';
const presentationSelector = '#presentationInput';
const supplierScopedSelector = `${ modalSelector } ${ supplierSelector }`;
const unitMeasureScopedSelector = `${ modalSelector } ${ unitMeasureSelector }`;
const presentationScopedSelector = `${ modalSelector } ${ presentationSelector }`;

export const initProductFormSelect2 = () => {

    setupSupplierSelect({
        modalSelector,
        supplierSelector
    });

    initUnitMeasureSelect({
        modalSelector,
        baseSelector: unitMeasureScopedSelector,
        allowCreate: false
    });

    initPresentationSelect({
        modalSelector,
        baseSelector: presentationScopedSelector,
        allowCreate: false
    });
};

export const setProductFormSelectOptions = (data = null) => {

    toggleSupplierOption({
        selector: supplierScopedSelector,
        id: data?.supplier?.id,
        name: `${ data?.supplier?.tradeName }`
    });

    toggleUnitMeasureOption({
        selector: unitMeasureScopedSelector,
        id: data?.unitMeasure?.id,
        name: `${ data?.unitMeasure?.symbol } - ${ data?.unitMeasure?.name }`
    });

    togglePresentationOption({
        selector: presentationScopedSelector,
        id: data?.presentation?.id,
        name: data?.presentation?.name
    });
};