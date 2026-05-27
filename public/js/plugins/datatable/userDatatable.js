import { getAllUsers } from '../../application/admin/users.js';
import { openUserModal } from '../../pages/admin/usersPage.js';
import { createDataTable } from './baseDatatable.js';
import { getResponsiveRowData } from './utils/responsive.js';

const selectorTable = '#table';

export const createUserDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: getAllUsers
            },
            columns: [
                { data: 'name', title: 'Usuario' },
                { data: 'profile.fullName', title: 'Perfil', defaultContent: '-' },
                {
                    data: null,
                    title: 'Acciones',
                    orderable: false,
                    render: () => `
                        <button class="btn-edit"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn-edit-password"><i class="fa-solid fa-key"></i></button>
                    `
                }
            ],
            buttons: [
                {
                    text: 'Nuevo usuario',
                    action: () => openUserModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', function() {

        const data = getResponsiveRowData(table, this);

        openUserModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit-password', function() {

        const data = getResponsiveRowData(table, this);

        openUserModal({ mode: 'edit-password', data });
    });
};
