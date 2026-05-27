import { useForm } from '../../application/form.js';
import { editUser, editUserPassword, registerUser } from '../../application/admin/users.js';
import { createUserDatatable } from '../../plugins/datatable/userDatatable.js';
import { initUserFormSelect2, setUserFormSelectOptions } from '../../plugins/select2/modules/userSelect.js';
import { clearFormErrors, initForm, setFormReadOnly } from '../../ui/formUI.js';
import { openModal } from '../../ui/modalUI.js';
import { handleSubmit, validateFields } from '../../utils/formUtils.js';
import { userEditValidators, userPasswordValidators, userValidators } from '../../utils/validations/validators.js';

const formId = '#userForm';
const userModalId = '#userModal';

const setModeFields = ({ form, mode }) => {

    setFormReadOnly({
        form,
        isReadOnly: false
    });

    if (mode === 'edit-password') setFormReadOnly({
        form,
        fields: ['name', 'departmentId', 'roleId'],
        isReadOnly: true
    });

    if (mode === 'edit') setFormReadOnly({
        form,
        fields: ['password'],
        isReadOnly: true
    });
};

export const openUserModal = ({ mode = 'create', data = null }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(userModalId);

    initForm({ form, mode, id: data?.id });
    clearFormErrors(form);
    initUserFormSelect2();
    setModeFields({ form, mode });
    setUserFormSelectOptions(data);

    form.elements.name.value = data?.name || '';
    form.elements.password.value = '';

    if (mode === 'create') {

        form.reset();
        modalElement.querySelector('#modalTitle').textContent = 'Registrar usuario';
        form.querySelector('#submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {

        modalElement.querySelector('#modalTitle').textContent = 'Editar usuario';
        form.querySelector('#submitBtn').textContent = 'Actualizar';
    }

    if (mode === 'edit-password') {

        modalElement.querySelector('#modalTitle').textContent = 'Editar contraseña';
        form.querySelector('#submitBtn').textContent = 'Actualizar contraseña';
    }

    openModal(modalElement);
};

createUserDatatable();

useForm({
    selector: formId,
    normalizeData: ({ formData, form }) => {

        const normalizedData = {
            ...formData,
            name: formData.name?.trim(),
        };

        if (form.dataset.mode === 'edit-password') return {
            password: formData.password
        };

        if (form.dataset.mode === 'edit') delete normalizedData.password;

        return normalizedData;
    },
    getErrors: ({ form, formData }) => {

        if (form.dataset.mode === 'edit-password') return validateFields(userPasswordValidators, formData);

        if (form.dataset.mode === 'edit') return validateFields(userEditValidators, formData);

        return validateFields(userValidators, formData);
    },
    sendRequest: async ({ formData, form }) => {

        if (form.dataset.mode === 'edit-password') return handleSubmit({
            form,
            formData,
            update: editUserPassword
        });

        return handleSubmit({
            form,
            formData,
            create: registerUser,
            update: editUser
        });
    }
});
