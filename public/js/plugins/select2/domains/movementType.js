import { initbaseSelect2 } from "../baseSelect.js";

const movementTypeSelector = '#movementTypeFilter';
export const getMovementTypeData = () => ([
    {
        id: 'ENTRY',
        text: 'Entrada'
    },
    {
        id: 'ISSUE',
        text: 'Salida'
    },
    {
        id: 'ADJUSTMENT',
        text: 'Ajuste'
    }
]);

export const getMovementTypeSelectApi = () => ({
    getSelect: () => document.querySelector(movementTypeSelector),
    getValue: () => document.querySelector(movementTypeSelector)?.value || ''
});

export const initMovementTypeFilterSelect = ({
    selectedId = null
}) => {

    initbaseSelect2({
        baseSelector: movementTypeSelector,
        containerSelector: 'body',
        get: async () => ({
            data: getMovementTypeData()
        }),
        clearOnOpen: false,
        placeholder: 'Filtrar por tipo de movimiento',
        data: (params) => ({
            search: params.term,
        }),
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(status => ({
                    ...status
                }))
            };
        }
    });

    if (!selectedId) return;

    const currentOption = $(`${ movementTypeSelector } option[value=\"${ selectedId }\"]`);

    if (currentOption.length) $(movementTypeSelector).val(selectedId).trigger('change');
}

export const attachMovementTypeFilterHandler = ({
    onChange
}) => {

    $(movementTypeSelector).off('select2:select').on('select2:select', () => {

        const select = document.querySelector(movementTypeSelector);
        const value = select?.value || '';

        onChange?.(value);
    });
}