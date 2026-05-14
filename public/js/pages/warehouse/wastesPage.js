import { createWasteDatatable } from "../../plugins/datatable/wasteDatatable.js";

const context = window.meta || {};

createWasteDatatable(context);

const wasteModalId = '#wasteModal';
const formId = '#productForm';

export const openWasteModal = ({ 
    mode = 'create', 
    data = null, 
    onSave = null 
}) => {
    
    const form = document.querySelector(formId);
    const modalElement = document.querySelector(wasteModalId);

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    clearFormErrors(form);
    initProductFormSelect2();

    if (mode === 'create') {

        form.reset();
        if (form.elements.isActive) form.elements.isActive.checked = true;
        form.elements.name.value = data?.name || '';
        setProductFormSelectOptions(data);

        modalElement.querySelector('#modalTitle').textContent = 'Registrar producto';
        form.querySelector('#submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {

        form.elements.name.value = data.name;
        form.elements.minStock.value = data.minStock;
        form.elements.base.value = data.base || '';
        form.elements.height.value = data.height || '';
        if (form.elements.isActive) form.elements.isActive.checked = Boolean(data.isActive);
        setProductFormSelectOptions(data);

        modalElement.querySelector('#modalTitle').textContent = 'Editar producto';
        form.querySelector('#submitBtn').textContent = 'Actualizar';
    }

    form.onSave = onSave;

    openModal(modalElement);
}