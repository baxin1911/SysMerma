import { initPresentationSelect, togglePresentationOption } from "../domains/presentation.js";
import { initReasonSelect, toggleReasonOption } from "../domains/reason.js";
import { setupSupplierSelect, toggleSupplierOption } from "../domains/supplier.js";
import { initUnitMeasureSelect, toggleUnitMeasureOption } from "../domains/unitMeasure.js";

const supplierSelector = '.supplier-select';
const unitMeasureSelector = '#unitMeasureInput';
const presentationSelector = '#presentationInput';
const reasonSelector = '#reasonInput';

export const initProductFormSelect2 = ({ 
    modalSelector = '#productModal',
    includeReasonSelect = false
} = {}) => {

    const supplierScopedSelector = `${ modalSelector } ${ supplierSelector }`;
    const unitMeasureScopedSelector = `${ modalSelector } ${ unitMeasureSelector }`;
    const presentationScopedSelector = `${ modalSelector } ${ presentationSelector }`;
    const reasonScopedSelector = `${ modalSelector } ${ reasonSelector }`;

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

    if (!includeReasonSelect) return;

    initReasonSelect({
        modalSelector,
        baseSelector: reasonScopedSelector,
        allowCreate: false
    });
};

export const setProductFormSelectOptions = ({ 
    modalSelector = '#productModal',
    includeReasonSelect = false,
    data = null 
} = {}) => {

    const supplierScopedSelector = `${ modalSelector } ${ supplierSelector }`;
    const unitMeasureScopedSelector = `${ modalSelector } ${ unitMeasureSelector }`;
    const presentationScopedSelector = `${ modalSelector } ${ presentationSelector }`;
    const reasonScopedSelector = `${ modalSelector } ${ reasonSelector }`;

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

    if (!includeReasonSelect) return;

    toggleReasonOption({
        selector: reasonScopedSelector,
        id: data?.reason?.id,
        name: data?.reason?.name
    });
};