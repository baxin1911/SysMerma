import { getFulfillmentStatusOptions } from "../../../application/warehouse/fulfillmentStatuses.js";
import { initbaseSelect2 } from "../baseSelect.js";

export const fulfillmentStatusSelector = '#fulfillmentStatusFilter';

export const getFulfillmentStatusSelectApi = () => ({
    getSelect: () => document.querySelector(fulfillmentStatusSelector),
    getValue: () => document.querySelector(fulfillmentStatusSelector)?.value || ''
});

export const initFulfillmentStatusSelect = ({
    selectedId = null
}) => {

    initbaseSelect2({
        baseSelector: fulfillmentStatusSelector,
        modalSelector: 'body',
        get: async () => ({
            data: await getFulfillmentStatusOptions()
        }),
        clearOnOpen: false,
        placeholder: 'Filtrar por estado surtido',
        data: () => ({}),
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

export const attachFulfillmentStatusHandler = ({
    onChange
}) => {
    $(fulfillmentStatusSelector)
        .off('select2:select.fulfillmentFilter change.fulfillmentFilter')
        .on('select2:select.fulfillmentFilter change.fulfillmentFilter', () => {
            const select = document.querySelector(fulfillmentStatusSelector);
            const value = select?.value || '';
            const hasValue = Array.from(select?.options || []).some(option => option.value === value);

            if (value && !hasValue) {
                $(fulfillmentStatusSelector).val(select?.options[0]?.value || '').trigger('change.select2');
            }

            onChange?.(value);
        });
};
