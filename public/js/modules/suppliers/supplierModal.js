import { clearFormErrors, initForm } from "../../ui/formUI.js";
import { openModal } from "../../ui/modalUI.js";

const modalId = '#supplierModal';
const formId = '#supplierForm';

export const openSupplierModal = ({ 
    mode = 'create', 
    data = null, 
    onSave = null 
}) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(modalId);

    initForm(form, data?.id || '');
    clearFormErrors(form);

    form.reset();

    if (form.elements.isActive) form.elements.isActive.checked = true;
    
    form.elements.tradeName.value = data?.tradeName || '';
    modalElement.querySelector('#modalTitle').textContent = 'Registrar proveedor';
    form.querySelector('#submitBtn').textContent = 'Guardar';
    form.onSave = onSave;

    openModal(modalElement);
}