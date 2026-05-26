import { getAllProfiles } from "../../application/admin/profiles.js";
import { openProfileModal } from "../../pages/admin/profilesPage.js";
import { createDataTable } from "./baseDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";

const selector = '#table';

export const createProfilesDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: getAllProfiles
            },
            columns: [
                { data: 'name', title: 'Nombre' },
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