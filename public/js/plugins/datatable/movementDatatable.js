import { getAllMovements } from "../../application/admin/movements.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";

const selector = '#table';

export const createMovementDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: (params) => getAllMovements({
                    ...params,
                })
            },
            columns: [
                { data: 'date', title: 'Fecha' },
                { data: 'productName', title: 'Material' },
                { data: 'quantity', title: 'Movimiento' }
            ]
        }
    });
}