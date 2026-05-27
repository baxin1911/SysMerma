import { getAllProfiles } from "../../application/admin/profiles.js";
import { openProfileModal } from "../../pages/admin/profilesPage.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";

const selector = '#table';

export const createProfilesDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: (data) => getAllProfiles({
                    ...data,
                    includeDepartments: true
                })
            },
            columns: [
                { data: 'fullName', title: 'Nombre' },
                { 
                    data: 'departments',
                    title: 'Áreas',
                    render: (data) => data.map(d => d.name).join(', ')
                },
                {
                    data: null,
                    title: 'Acciones',
                    render: () => renderActionButtons({ context: 'profile' })
                }
            ],
            buttons: [
                {
                    text: 'Nuevo perfil',
                    action: () => openProfileModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selector } tbody`).on('click', '.btn-edit', function () {

        const data = getResponsiveRowData(table, this);

        openProfileModal({ mode: 'edit', data });
    });
}