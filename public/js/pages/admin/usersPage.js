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

    const fields = mode === 'edit-password'
        ? ['name', 'profileId', 'departmentId', 'roleId']
        : mode === 'edit'
            ? ['password']
            : [];

    setFormReadOnly({
        form,
        fields,
        isReadOnly: true
    });

    if (mode === 'create') {
        setFormReadOnly({
            form,
            fields: 'all',
            isReadOnly: false
        });
    }
};

export const openUserModal = ({ mode = 'create', data = null }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(userModalId);

    initForm({ form, mode, id: data?.id });
    clearFormErrors(form);
    initUserFormSelect2();
    setModeFields({ form, mode });

    if (mode === 'create') {
        form.reset();

        modalElement.querySelector('#modalTitle').textContent = 'Registrar usuario';
        form.querySelector('#submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {
        form.elements.name.value = data.name || '';
        form.elements.profileId.value = data.profileId || '';
        form.elements.password.value = '';

        setUserFormSelectOptions(data);

        modalElement.querySelector('#modalTitle').textContent = 'Editar usuario';
        form.querySelector('#submitBtn').textContent = 'Actualizar';
    }

    if (mode === 'edit-password') {
        form.elements.password.value = '';

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
            profileId: formData.profileId?.trim()
        };

        if (form.dataset.mode === 'edit-password') {
            return {
                password: formData.password
            };
        }

        if (form.dataset.mode === 'edit') {
            delete normalizedData.password;
        }

        return normalizedData;
    },
    getErrors: ({ form, formData }) => {

        if (form.dataset.mode === 'edit-password') {
            return validateFields(userPasswordValidators, formData);
        }

        if (form.dataset.mode === 'edit') {
            return validateFields(userEditValidators, formData);
        }

        return validateFields(userValidators, formData);
    },
    sendRequest: async ({ formData, form }) => {

        if (form.dataset.mode === 'edit-password') {
            return handleSubmit({
                form,
                formData,
                update: editUserPassword
            });
        }

        return handleSubmit({
            form,
            formData,
            create: registerUser,
            update: editUser
        });
    }
});
