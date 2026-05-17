import { clearFormErrors } from "../../ui/formUI.js";
import { openModal } from "../../ui/modalUI.js";

const clientModalId = '#clientModal';
const formId = '#clientForm';

export const openClientModal = ({ 
    mode = 'create', 
    data = null, 
    onSave = null 
}) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(clientModalId);

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    clearFormErrors(form);

    if (mode === 'create') {

        form.reset();
        form.elements.name.value = data?.name || '';

        modalElement.querySelector('#modalTitle').textContent = 'Registrar cliente';
        form.querySelector('#submitBtn').textContent = 'Guardar';
    }

    form.onSave = onSave;

    openModal(modalElement);
}