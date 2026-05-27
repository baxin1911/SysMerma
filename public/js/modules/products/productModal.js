import { openModal } from "../../ui/modalUI.js";
import { initProductFormSelect2, setProductFormSelectOptions } from "../../plugins/select2/modules/productSelect.js";
import { clearFormErrors, initForm } from "../../ui/formUI.js";

const productModalId = '#productModal';
const formId = '#productForm';

export const openProductModal = ({ 
    mode = 'create', 
    data = null, 
    onSave = null 
}) => {
    
    const form = document.querySelector(formId);
    const modalElement = document.querySelector(productModalId);

    initForm({ form, mode, id: data?.id });
    clearFormErrors(form);
    initProductFormSelect2({ modalSelector: productModalId });
    setProductFormSelectOptions({ modalSelector: productModalId, data });

    if (mode === 'create') {

        form.reset();

        if (form.elements.isActive) form.elements.isActive.checked = true;

        form.elements.name.value = data?.name || '';

        modalElement.querySelector('#modalTitle').textContent = 'Registrar producto';
        form.querySelector('#submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {

        form.elements.name.value = data.name;
        form.elements.minStock.value = data.minStock;
        form.elements.base.value = data.base || '';
        form.elements.height.value = data.height || '';

        if (form.elements.isActive) form.elements.isActive.checked = Boolean(data.isActive);

        modalElement.querySelector('#modalTitle').textContent = 'Editar producto';
        form.querySelector('#submitBtn').textContent = 'Actualizar';
    }

    form.onSave = onSave;

    openModal(modalElement);
}