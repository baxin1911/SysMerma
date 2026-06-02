import { handleDataTableError } from "../../api/errorHandler.js";

const SORT_DIRECTIONS = ['asc', 'desc'];

const isActionColumn = (column = {}) => column.title === 'Acciones';

const normalizeColumns = (columns) => {

    if (!Array.isArray(columns)) return columns;

    return columns.map(column => ({
        ...column,
        orderSequence: column.orderSequence || SORT_DIRECTIONS,
        ...(isActionColumn(column) && {
            orderable: false,
            searchable: false
        })
    }));
};

export const createDataTable = ({ selector = '#table', options = {} }) => {

    const ajaxConfig = options.ajax;
    const searchDelay = 1000;
    const normalizedColumns = normalizeColumns(options.columns);

    return $(selector).DataTable({
        ...options,
        columns: normalizedColumns,
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

export const renderActionButtons = ({ status, fulfillmentStatus, context, canAdjustStock = false }) => {

    const actions = [];
    const canEditGoodsIssue = context === 'goodsIssue' && fulfillmentStatus === 'Pendiente';

    if ((status === 'Abierta' || canEditGoodsIssue) || context === 'profile' || context === 'client' || context === 'supplier') actions.push('<button class="btn-edit"><i class="fa-solid fa-pencil"></i></button>');

    if (context === 'product' && canAdjustStock) actions.push('<button class="btn-adjust-stock"><i class="fa-solid fa-boxes-stacked"></i></button>');

    if (status === 'Aprobada' && context === 'goodsIssue' && canEditGoodsIssue) actions.push('<button class="btn-edit-detail"><i class="fa fa-edit"></i></button>');

    if (context !== 'product' && context !== 'profile' && context !== 'client' && context !== 'supplier') actions.push('<button class="btn-view"><i class="fa fa-eye"></i></button>');

    return actions.join('');
}
