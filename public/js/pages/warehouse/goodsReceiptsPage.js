import { useForm } from "../../application/form.js";
import { registerGoodsReceipt } from "../../application/warehouse/goodsReceipts.js";
import { validateGoodsReceiptValidators } from "../../utils/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createGoodsReceiptDatatable, details, initDetailsGoodsReceiptTable } from "../../plugins/datatable/goodsReceiptDatatable.js";
import { GOODS_RECEIPT_SUPPLIER_CHANGED_EVENT, initGoodsReceiptFormSelect2, setGoodsReceiptFormSelectOptions } from "../../plugins/select2/modules/goodsReceiptSelect.js";
import { setFormReadOnly, updateTotals, toggleButtons, clearAddedProductInput, toggleInvoiceInput, clearFormErrors } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { openModal } from "../../ui/modalUI.js";
import { initMdbWrapperInput, updateMdbWrapperInput } from "../../plugins/mdb/baseInstance.js";

const modalId = '#goodsReceiptModal';
const formId = '#goodsReceiptForm';

createGoodsReceiptDatatable();

document.addEventListener(GOODS_RECEIPT_SUPPLIER_CHANGED_EVENT, () => {
    details.length = 0;
    refreshProductTable(details);
    clearAddedProductInput();
});

useForm({
    selector: formId,
    normalizeData: ({ formData }) => {

        formData.isInvoiced = document.querySelector('input[name="isInvoiced"]').checked;

        if (!formData.isInvoiced) delete formData.invoice;

        formData.details = details;

        return formData;
    },
    getErrors: ({ formData }) => {
        
        const allowedUsername = /^[a-zA-Z0-9\-]+$/;
        let errors = {};

        errors = validateFields(validateGoodsReceiptValidators, formData);

        if (formData.isInvoiced) {

            if (!formData.invoice) errors.invoice = 'El número de factura es obligatorio';
            else if (typeof formData.invoice !== 'string') errors.invoice = 'El número de factura no es una cadena de texto';
            else if (!allowedUsername.test(formData.invoice)) errors.invoice = 'El número de factura debe tener solo letras, números y guiones.';
            else if (formData.invoice.length > 50) errors.invoice = 'El número de factura no debe exceder los 50 caracteres';
            else errors.invoice = null;

        } else {

            errors.invoice = null;
        }

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        await handleSubmit({
            form,
            formData,
            create: registerGoodsReceipt
        });
    },
});

export const openGoodsReceiptModal = ({ mode, data = null }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(modalId);
    let value;

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    clearFormErrors(form);
    setFormReadOnly({ form, isReadOnly: false });

    details.length = 0;

    initGoodsReceiptFormSelect2();
    setGoodsReceiptFormSelectOptions(data);

    if (mode === 'create') {
        
        form.reset();
        value = 'invoice';
        modalElement.querySelector('#modalTitle').textContent = 'Registrar compra';
        form.querySelector('#submitBtn').textContent = 'Confirmar';
        form.querySelector('#presentationDisplayInput').value = '';

        toggleButtons({
            mode,
            status: 'Abierta',
            showActions: true
        });
    }

    if (mode === 'view') {

        value = data.isInvoiced ? 'invoice' : 'none';
        const supplierName = data.supplierName;
        form.elements.observations.value = data.observations || '';
        form.elements.receptionDate.value = formatDateLongWithTime(data.receptionDate);
        details.push(...data.details.map(detail => ({
            id: detail.id,
            productId: detail.productId,
            productName: detail.productName,
            productBase: detail.productBase,
            productHeight: detail.productHeight,
            quantity: detail.quantity,
            presentationName: detail.presentationName,
            convertedQuantity: detail.convertedQuantity,
            unitMeasureName: detail.unitMeasureName,
            conversionUnitCost: detail.conversionUnitCost,
            costPerUnitType: detail.costPerUnitType,
            netPurchaseAmount: detail.netPurchaseAmount,
            grossPurchaseAmount: detail.grossPurchaseAmount,
            supplierName
        })));

        form.elements.totalQuantityDisplayInput.value = data.totalQuantity;
        form.elements.totalNetPurchaseAmountDisplayInput.value = data.totalNetPurchaseAmount;
        form.elements.totalGrossPurchaseAmountDisplayInput.value = data.totalGrossPurchaseAmount;

        modalElement.querySelector('#modalTitle').textContent = 'Ver compra';
        setFormReadOnly({ form, isReadOnly: true });

        toggleButtons({
            mode,
            status: 'Confirmada',
            showActions: false
        });
    }
    
    form.elements.invoice.value = data?.invoice || '';
    form.elements.isInvoiced.value = value;
    toggleInvoiceInput({ value, mode, form });

    initDetailsGoodsReceiptTable(mode);

    openModal(modalElement);
}

const addProduct = () => {

    const option = document.querySelector('#productInput option:checked');

    if (!option) return null;

    let { productBase, productHeight, presentationName, unitMeasureName, supplierName, productName } = option.dataset;
    productHeight = Number(productHeight);
    productBase = Number(productBase);

    const productId = option.value;

    const supplierId = document.querySelector('#supplierInput').value;
    const quantity = Number(document.querySelector('#quantityInput').value);
    const costPerUnitType = Number(document.querySelector('#costPerUnitInput').value);

    if (!supplierId) {
        alert('Selecciona un proveedor antes de agregar productos.');
        return;
    }

    if (!productId || !quantity || !costPerUnitType) {
        alert('Por favor, complete los campos de producto, cantidad e importe.');
        return;
    }

    if (isNaN(quantity) || quantity < 1) {
        alert('La cantidad debe ser un número mayor a cero.');
        return;
    }

    if (isNaN(costPerUnitType) || costPerUnitType <= 0) {
        alert('El costo por RoPresentación debe ser un número positivo.');
        return;
    }

    const netPurchaseAmount = Number((quantity * costPerUnitType).toFixed(2));
    let convertedQuantity;

    if (!productBase || !productHeight) convertedQuantity = quantity;
    else convertedQuantity = Number(((productBase * productHeight) * quantity).toFixed(2));

    const conversionUnitCost = Number((netPurchaseAmount / convertedQuantity).toFixed(2));
    const grossPurchaseAmount = Number((netPurchaseAmount * 1.16).toFixed(2));
    const product = {
        productId,
        productName,
        productBase,
        productHeight,
        quantity,
        unitMeasureName,
        presentationName,
        costPerUnitType,
        conversionUnitCost,
        netPurchaseAmount,
        grossPurchaseAmount,
        convertedQuantity,
        supplierName,
    };
    details.push(product);

    refreshProductTable(details);
    clearAddedProductInput();

    updateTotals({
        quantity,
        net: netPurchaseAmount,
        gross: grossPurchaseAmount,
        operation: 'add'
    });
}

on('click', '#addProductBtn', addProduct);

const invoiceContainer = document.getElementById('invoiceContainer');
const invoiceRadios = document.querySelectorAll('input[name="isInvoiced"]');

invoiceRadios.forEach(radio => {

    radio.addEventListener('change', () => {

        if (radio.checked) toggleInvoiceInput({ value: radio.value, mode: 'update', form: document.querySelector(formId) });
    });
});
