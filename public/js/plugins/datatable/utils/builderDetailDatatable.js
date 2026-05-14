export const buildDetailsHeader = ({ type, mode, isWarehouse, isCoordinator, isSystem }) => {

    let extraHeaders = '';

    if (type === 'issue' && ((isWarehouse && isCoordinator) || isSystem) && mode !== 'create') {
        extraHeaders += `
            <th rowspan="2">Costo unitario de Conversión</th>
            <th rowspan="2">Cantidad de proyecto</th>
            <th rowspan="2">Diferencia</th>
        `;
    }

    if (type === 'receipt') {
        extraHeaders += `
            <th rowspan="2">Costo Unitario de Conversión</th>
            <th rowspan="2">Costo por Presentación</th>
            <th rowspan="2">Monto s/ IVA</th>
            <th rowspan="2">Monto c/ IVA</th>
        `;
    }

    if (type === 'issue' && mode !== 'create') {
        extraHeaders += `<th rowspan="2">Surtir</th>`;
    }

    if (mode !== 'view' && mode !== 'edit-detail') {
        extraHeaders += `<th rowspan="2">Acciones</th>`;
    }

    return `
        <thead>
            <tr>
                <th rowspan="2">Material</th>
                <th colspan="2">Medidas</th>
                <th rowspan="2">${ type === 'issue' ? 'Salida' : 'Compra' }</th>
                <th rowspan="2">Presentación</th>
                <th colspan="2">Conversión</th>
                ${ extraHeaders }
            </tr>
            <tr>
                <th>Base</th>
                <th>Altura</th>
                <th>Cantidad</th>
                <th>Unidad</th>
            </tr>
        </thead>
    `;
};

export const buildDetailsColumns = ({ type, mode, render, isWarehouse, isCoordinator, isSystem }) => {

    const columns = [
        {
            data: null,
            render
        },
        { data: 'productBase' },
        { data: 'productHeight' },
        { data: 'quantity' },
        { data: 'presentationName' },
        { data: 'convertedQuantity' },
        { data: 'unitMeasureName' },
    ];

    if (type === 'issue' && ((isWarehouse && isCoordinator) || isSystem) && mode !== 'create') {
        columns.push(
            { data: 'maxUnitCost' },
            { 
                data: null,
                render: (_, __, row) => {
                    const detailId = row.id || row.productId;

                    return `
                        <input
                            type="number"
                            name="projectConvertedQuantity"
                            value="${ row.projectConvertedQuantity || '' }"
                            class="form-control project-converted-quantity-input"
                            ${ mode === 'view' ? 'disabled' : '' }
                            data-detail-id="${ detailId }"
                            min=0
                        >
                        <div data-error-for="projectConvertedQuantity-${ detailId }" class="invalid-feedback d-none"></div>
                    `;
                }
            },
            { data: 'convertedQuantityDifference' }
        );
    }

    if (type === 'receipt') {
        columns.push(
            { data: 'conversionUnitCost' },
            { data: 'costPerUnitType' },
            { data: 'netPurchaseAmount' },
            { data: 'grossPurchaseAmount' }
        );
    }

    if (type === 'issue' && mode !== 'create') {
        columns.push({
            data: null,
            render: (_, __, row) => {
                
                const detailId = row.id || row.productId;

                return `
                    <input type="checkbox"
                        name="isSupplied"
                        class="form-check-input supply-checkbox"
                        data-detail-id="${ detailId }"
                        ${ row.isSupplied ? 'checked' : '' }
                        ${ mode === 'view' ? 'disabled' : '' }
                    >
                `;
            }
        });
    }

    if (mode !== 'view' && mode !== 'edit-detail') {
        columns.push({
            data: null,
            render: (_, __, row) => `
                <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${ row.productId }">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `
        });
    }

    return columns;
};