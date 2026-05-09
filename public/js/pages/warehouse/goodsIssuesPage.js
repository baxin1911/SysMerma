import { useForm } from "../../application/form.js";
import { editGoodsIssueDetails, registerGoodsIssue } from "../../application/warehouse/goodsIssues.js";
import { validateGoodsIssueDetailValidators, validateGoodsIssueValidators } from "../../utils/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createGoodsIssueDatatable, details, initDetailsGoodsIssueTable } from "../../plugins/datatable/goodsIssueDatatable.js";
import { initGoodsIssueFormSelect2, setGoodsIssueFormSelectOptions } from "../../plugins/select2/modules/goodsIssueSelect.js";
import { setFormReadOnly, toggleButtons, clearAddedProductInput, clearFormErrors } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleAction, handleSubmit, validateDetailsFields, validateFields } from "../../utils/formUtils.js";
import { openModal } from "../../ui/modalUI.js";
import { hasPermission } from "../../utils/permissions.js";

const MODE_EDIT_DETAIL = 'edit-detail';
const MODE_VIEW = 'view';
const modalId = '#goodsIssueModal';
const formId = '#goodsIssueForm';

const context = window.meta || {};

createGoodsIssueDatatable(context);

const normalizeGoodsIssueData = ({ form, formData }) => {
    const { mode } = form.dataset;

    if (mode === MODE_EDIT_DETAIL) {
        return {
            id: form.dataset.id,
            details
        };
    }

    return {
        ...formData,
        details
    };
};

useForm({
    selector: formId,
    normalizeData: normalizeGoodsIssueData,
    getErrors: ({ form, formData }) => {

        const { mode } = form.dataset;

        if (mode === MODE_EDIT_DETAIL) return validateDetailsFields(validateGoodsIssueDetailValidators, details);

        return validateFields(validateGoodsIssueValidators, formData);
    },
    sendRequest: async ({ formData, form }) => {

        await handleSubmit({
            form,
            formData,
            create: registerGoodsIssue,
            update: editGoodsIssueDetails
        });
    },
});

export const openGoodsIssueModal = async ({ mode, data = null }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(modalId);

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    clearFormErrors(form);
    toggleButtons({
        mode,
        status: data?.status?.name,
        showActions: false,
        withTotal: false
    });
    setFormReadOnly({ form, isReadOnly: false });
    initGoodsIssueFormSelect2();
    setGoodsIssueFormSelectOptions(data);

    details.length = 0;

    if (mode === 'create') {

        form.reset();
        modalElement.querySelector('#modalTitle').textContent = 'Registrar salida';
        form.querySelector('#submitBtn').textContent = 'Guardar';
        form.querySelector('#presentationDisplayInput').value = '';
    }

    if (mode === MODE_EDIT_DETAIL || mode === MODE_VIEW) {

        form.querySelector('#observationsInput').value = data.observations || '';
        form.querySelector('#requestDateInput').value = formatDateLongWithTime(data.requestDate);
        form.querySelector('#projectNumberInput').value = data.projectNumber;
        details.push(...data.details.map(detail => ({
            id: detail.id,
            productId: detail.productId,
            supplierId: detail.supplierId,
            presentationId: detail.presentationId,
            unitMeasureId: detail.unitMeasureId,
            productName: detail.productName,
            productBase: detail.productBase,
            productHeight: detail.productHeight,
            quantity: detail.quantity,
            presentationName: detail.presentationName,
            convertedQuantity: detail.convertedQuantity,
            unitMeasureId: detail.unitMeasureId,
            unitMeasureName: detail.unitMeasureName,
            unitMeasureSymbol: detail.unitMeasureSymbol,
            maxUnitCost: detail.maxUnitCost,
            projectConvertedQuantity: detail.projectConvertedQuantity,
            convertedQuantityDifference: detail.convertedQuantityDifference,
            supplierName: detail.supplierName,
            isSupplied: detail.isSupplied,
        })));

        setFormReadOnly({ form, isReadOnly: true });

        if (mode === MODE_EDIT_DETAIL) {
            modalElement.querySelector('#modalTitle').textContent = 'Editar detalles de la salida';
            form.querySelector('#submitBtn').textContent = 'Actualizar';
        }

        if (mode === MODE_VIEW) {
            modalElement.querySelector('#modalTitle').textContent = 'Ver salida';
        }
    }

    initDetailsGoodsIssueTable(mode, context);

    openModal(modalElement);
};

const addProduct = () => {

    const productId = document.querySelector('#productInput').value;
    const selectedProduct = $('#productInput').select2('data')?.[0];
    const quantity = Number(document.querySelector('#quantityInput').value);
    const productBase = selectedProduct?.productBase ? Number(selectedProduct?.productBase) : null;
    const productHeight = selectedProduct?.productHeight ? Number(selectedProduct?.productHeight) : null;
    const { presentationName, unitMeasureName, productName, supplierName, supplierId, maxUnitCost } = selectedProduct;

    if (!productId || !quantity) {
        alert('Por favor, complete los campos de producto y cantidad.');
        return;
    }

    if (isNaN(quantity) || parseFloat(quantity) < 1) {
        alert('La cantidad debe ser un número mayor a cero.');
        return;
    }

    let convertedQuantity;

    if (!productBase || !productHeight) {

        productBase = null;
        productHeight = null;
        convertedQuantity = quantity;

    } else {

        convertedQuantity = Number((productBase * productHeight * quantity).toFixed(2));
    }

    const product = {
        productId,
        productName,
        productBase,
        productHeight,
        quantity,
        unitMeasureName,
        presentationName,
        convertedQuantity,
        supplierName,
        maxUnitCost,
        supplierId,
    };

    details.push(product);

    refreshProductTable(details);
    clearAddedProductInput();
};

on('click', '#addProductBtn', addProduct);
on('change', '.supply-checkbox', (e, checkbox) => {
    const { id } = checkbox.dataset;
    const product = details.find(detail => detail.productId === id);
    product.isSupplied = checkbox.checked;
});
on('input', '.project-converted-quantity-input', (e, input) => {

    const { id } = input.dataset;
    const value = Number(input.value);
    const product = details.find(detail => detail.productId === id);

    if (!product) return;

    product.projectConvertedQuantity = value;
    product.convertedQuantityDifference = (product.convertedQuantity - product.projectConvertedQuantity).toFixed(2);

    const currenTd = input.closest('td');
    const nextTd = currenTd.nextElementSibling;

    if (nextTd) nextTd.textContent = product.convertedQuantityDifference;
});