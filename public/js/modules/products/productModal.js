import { openModal } from "../../ui/modalUI.js";
import { initProductFormSelect2, setProductFormSelectOptions } from "../../plugins/select2/modules/productSelect.js";
import { clearFormErrors, initForm, setFormReadOnly, toggleFormFields } from "../../ui/formUI.js";

const productModalId = '#productModal';
const formId = '#productForm';
const productFields = ['name', 'minStock', 'base', 'height', 'supplierId', 'presentationId', 'unitMeasureId', 'isActive'];
const stockFields = ['newStock', 'reasonId', 'observations'];
const stockMode = 'edit-stock';
const createMode = 'create';

const isStockMode = (mode) => mode === stockMode;
const shouldShowStockFields = ({ mode, canAdjustStock }) => canAdjustStock && (mode === createMode || isStockMode(mode));

const setProductValues = ({ form, data = null }) => {

    form.elements.name.value = data?.name || '';
    form.elements.minStock.value = data?.minStock || '';
    form.elements.base.value = data?.base || '';
    form.elements.height.value = data?.height || '';

    if (form.elements.newStock) form.elements.newStock.value = data?.newStock || '';
    if (form.elements.observations) form.elements.observations.value = data?.observations || '';
    if (form.elements.isActive) form.elements.isActive.checked = data?.isActive === undefined ? true : Boolean(data.isActive);
};

const setStockLabel = ({ form, mode }) => {

    const stockInput = form.elements.newStock;
    const stockLabel = stockInput ? form.querySelector(`label[for='${ stockInput.id }']`) : null;

    if (!stockLabel) return;

    stockLabel.textContent = mode === createMode ? 'Stock inicial' : 'Nueva cantidad';
};

const prepareProductModal = ({ mode, data, canAdjustStock = false }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(productModalId);
    const showStockFields = shouldShowStockFields({ mode, canAdjustStock });

    initForm({ form, mode, id: data?.id });
    form.dataset.canAdjustStock = String(canAdjustStock);
    clearFormErrors(form);
    toggleFormFields({ form, fields: productFields, isVisible: true });
    toggleFormFields({ form, fields: stockFields, isVisible: showStockFields });
    setFormReadOnly({ form, fields: productFields, isReadOnly: isStockMode(mode) });
    setStockLabel({ form, mode });

    initProductFormSelect2({ modalSelector: productModalId, includeReasonSelect: showStockFields });
    setProductFormSelectOptions({ modalSelector: productModalId, data, includeReasonSelect: showStockFields });

    return { form, modalElement };
};

export const openProductModal = ({
    mode = createMode,
    data = null,
    onSave = null,
    canAdjustStock = false
}) => {

    const { form, modalElement } = prepareProductModal({ mode, data, canAdjustStock });

    setProductValues({ form, data: mode === 'edit' ? data : { name: data?.name, supplier: data?.supplier } });

    if (mode === createMode) {
        modalElement.querySelector('#modalTitle').textContent = 'Registrar producto';
        form.querySelector('#submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {
        modalElement.querySelector('#modalTitle').textContent = 'Editar producto';
        form.querySelector('#submitBtn').textContent = 'Actualizar';
    }

    form.onSave = onSave;

    openModal(modalElement);
};

export const openStockAdjustmentModal = ({
    mode = stockMode,
    data = null,
    onSave = null,
    canAdjustStock = true
}) => {

    const { form, modalElement } = prepareProductModal({ mode, data, canAdjustStock });

    setProductValues({ form, data });

    modalElement.querySelector('#modalTitle').textContent = 'Editar stock de producto';
    form.querySelector('#submitBtn').textContent = 'Actualizar';

    form.onSave = onSave;

    openModal(modalElement);
};
