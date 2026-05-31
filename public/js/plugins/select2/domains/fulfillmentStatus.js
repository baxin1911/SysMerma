import { getFulfillmentStatusOptions } from "../../../application/warehouse/fulfillmentStatuses.js";
import { initbaseSelect2 } from "../baseSelect.js";

const fulfillmentStatusSelector = '#fulfillmentStatusFilter';

export const getFulfillmentStatusSelectApi = () => ({
    getSelect: () => document.querySelector(fulfillmentStatusSelector),
    getValue: () => document.querySelector(fulfillmentStatusSelector)?.value || ''
});

export const initFulfillmentStatusFilterSelect = ({
    selectedId = null
}) => {

    initbaseSelect2({
        baseSelector: fulfillmentStatusSelector,
        containerSelector: 'body',
        get: async () => ({
            data: await getFulfillmentStatusOptions()
        }),
        clearOnOpen: false,
        placeholder: 'Filtrar por estado surtido',
        data: (params) => ({
            search: params.term
        }),
        processResults: (data) => {
            const list = data.data || data;
            return {
                results: list.map(status => ({
                    id: status.value,
                    text: status.label
                }))
            };
        }
    });

    if (!selectedId) return;

    const currentOption = $(`${ fulfillmentStatusSelector } option[value=\"${ selectedId }\"]`);

    if (currentOption.length) {
        $(fulfillmentStatusSelector).val(selectedId).trigger('change');
    }
};

export const attachFulfillmentStatusFilterHandler = ({
    onChange
}) => {
    
$(fulfillmentStatusSelector).off('select2:select').on('select2:select', () => {
        
        const select = document.querySelector(fulfillmentStatusSelector);
        const value = select?.value || '';

        onChange?.(value);
    });
};