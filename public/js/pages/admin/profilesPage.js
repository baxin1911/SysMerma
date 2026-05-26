import { registerProfile, updateProfile } from "../../application/admin/profiles.js";
import { useForm } from "../../application/form.js";
import { createProfilesDatatable } from "../../plugins/datatable/profileDatatable.js";
import { initProfileFormSelect2, setProfileFormSelectOptions } from "../../plugins/select2/modules/profileSelect.js";
import { clearFormErrors, initForm } from "../../ui/formUI.js";
import { openModal } from "../../ui/modalUI.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { profileValidators } from "../../utils/validations/validators.js";

const formId = '#profileForm';
const modalId = '#profileModal';

createProfilesDatatable();

useForm({
    selector: formId,
    normalizeData: ({ form, formData }) => {

        const fd = new FormData(form);
        
        return {
            ...formData,
            departmentIds: fd.getAll('departmentIds')
        }
    },
    getErrors: ({ formData }) => validateFields(profileValidators, formData),
    sendRequest: async ({ formData, form }) => {
        
        await handleSubmit({
            form,
            formData,
            create: registerProfile,
            update: updateProfile
        });
    }
});

export const openProfileModal = ({ mode, data = null }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(modalId);

    initForm({ form, mode, id: data?.id || '' });
    clearFormErrors(form);
    initProfileFormSelect2({ modalSelector: modalId });
    setProfileFormSelectOptions({ modalSelector: modalId, data });

    if (mode === 'create') {

        form.reset();
        modalElement.querySelector('#modalTitle').textContent = 'Registrar perfil';
        form.querySelector('#submitBtn').textContent = 'Guardar';

    } 
    
    if (mode === 'edit') {

        form.elements.name.value = data.name;
        modalElement.querySelector('#modalTitle').textContent = 'Editar perfil';
        form.querySelector('#submitBtn').textContent = 'Actualizar';
    }

    openModal(modalElement);
}