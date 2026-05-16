import { useForm } from "../../application/form.js";
import { editGoodsIssue, editGoodsIssueDetails, registerGoodsIssue } from "../../application/warehouse/goodsIssues.js";
import { validateAddProductValidators, validateGoodsIssueDetailValidators, validateGoodsIssueValidators } from "../../utils/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createGoodsIssueDatatable, details, initDetailsGoodsIssueTable } from "../../plugins/datatable/goodsIssueDatatable.js";
import { initGoodsIssueFormSelect2, setGoodsIssueFormSelectOptions } from "../../plugins/select2/modules/goodsIssueSelect.js";
import { normalizeFormErrors, setFormReadOnly, toggleButtons, clearAddedProductInput, clearFormErrors } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleAction, handleSubmit, hasValidationErrors, validateDetailsFields, validateFields } from "../../utils/formUtils.js";
import { openModal } from "../../ui/modalUI.js";
import { hasPermission } from "../../utils/permissions.js";

const MODE_EDIT = 'edit';
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

        const update = form.dataset.mode === MODE_EDIT_DETAIL
            ? editGoodsIssueDetails
            : editGoodsIssue;

        await handleSubmit({
            form,
            formData,
            create: registerGoodsIssue,
            update
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

    if (mode === MODE_EDIT || mode === MODE_EDIT_DETAIL || mode === MODE_VIEW) {

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

        setFormReadOnly({ form, isReadOnly: mode !== MODE_EDIT });

        if (mode === MODE_EDIT) {
            modalElement.querySelector('#modalTitle').textContent = 'Editar salida';
            form.querySelector('#submitBtn').textContent = 'Actualizar';
        }

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

    const option = document.querySelector('#productInput option:checked');
    const productId = option?.value || document.querySelector('#productInput').value;
    const quantityInputValue = document.querySelector('#quantityInput').value;

    const errors = validateFields(validateAddProductValidators, {
        productId,
        quantity: quantityInputValue
    });

    normalizeFormErrors({ form: document.querySelector(formId), errors });

    if (hasValidationErrors(errors)) return;

    if (!option) return null;

    let { productBase, productHeight, presentationName, unitMeasureName, productName, supplierName, supplierId, maxUnitCost } = option.dataset;
    productHeight = Number(productHeight);
    productBase = Number(productBase);

    const quantity = Number(quantityInputValue);

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
const findDetailByElement = (element) => {

    const { detailId } = element.dataset;

    if (detailId) return details.find(detail => detail.id === detailId);

    return details.find(detail => detail.productId === element.dataset.id);
};

on('change', '.supply-checkbox', (e, checkbox) => {
    const product = findDetailByElement(checkbox);

    if (!product) return;

    product.isSupplied = checkbox.checked;
});
on('input', '.project-converted-quantity-input', (e, input) => {

    const value = Number(input.value);
    const product = findDetailByElement(input);

    if (!product) return;

    product.projectConvertedQuantity = value;
    product.convertedQuantityDifference = (product.convertedQuantity - product.projectConvertedQuantity).toFixed(2);

    const currenTd = input.closest('td');
    const nextTd = currenTd.nextElementSibling;

    if (nextTd) nextTd.textContent = product.convertedQuantityDifference;
});