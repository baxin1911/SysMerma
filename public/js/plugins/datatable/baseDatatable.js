import { handleDataTableError } from "../../api/errorHandler.js";

export const createDataTable = ({ selector = '#table', options = {} }) => {

    const ajaxConfig = options.ajax;
    const searchDelay = 1000;

    return $(selector).DataTable({
        ...options,
        searchDelay,
        ajax: ajaxConfig ? async (data, callback) => {

            try {

                const response = await ajaxConfig.get(data);

                callback(response.data);

            } catch (err) {

                handleDataTableError(err);

                callback({
                    data: [],
                    recordsTotal: 0,
                    recordsFiltered: 0
                });
            }
        } : undefined,
        dom: 'Bfrtip',
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        },
        responsive: true,
        autoWidth: false,
        serverSide: options.ajax ? true : false,
        processing: options.ajax ? true : false,
    });
}

export const reloadMainTable = () => {

    const table = $('#table').DataTable();
    table.ajax.reload(null, false);
}

export const refreshProductTable = (details) => {

    const table = $('#productTable').DataTable();
    table.clear();
    table.rows.add(details);
    table.draw();
}

export const renderActionButtons = ({ status, fulfillmentStatus, context }) => {

    const actions = [];
    const canEditGoodsIssue = context === 'goodsIssue' && fulfillmentStatus === 'Pendiente';

    if ((status === 'Abierta' || canEditGoodsIssue) || context === 'profile' || context === 'client' || context === 'supplier') actions.push('<button class="btn-edit"><i class="fa-solid fa-pencil"></i></button>');

    if (context === 'product') actions.push('<button class="btn-adjust-stock"><i class="fa-solid fa-boxes-stacked"></i></button>');

    if (status === 'Aprobada' && context === 'goodsIssue' && canEditGoodsIssue) actions.push('<button class="btn-edit-detail"><i class="fa fa-edit"></i></button>');

    if (context !== 'product' && context !== 'profile' && context !== 'client' && context !== 'supplier') actions.push('<button class="btn-view"><i class="fa fa-eye"></i></button>');

    return actions.join('');
}
