const startDateSelector = '#startDateInput';
const endDateSelector = '#endDateInput';

export const getDateFilterApi = () => ({
    getValues: () => ({
        startDate: document.querySelector(startDateSelector)?.value || '',
        endDate: document.querySelector(endDateSelector)?.value || ''
    })
});

export const attachDateFilterHandler = ({
    onChange
}) => {

    $(startDateSelector).on('change', () => {
        onChange?.();
    });

    $(endDateSelector).on('change', () => {
        onChange?.();
    });
};

export const setupTableFilters = async ({
    filters = []
} = {}) => {

    const values = {};

    for (const filter of filters) {

        const {
            key,
            isSelected = true,
            getSelectApi,
            getOptions,
            initSelect,
            attachHandler
        } = filter;

        if (filter.customGetValues) {

            values[key || crypto.randomUUID()] = filter.customGetValues;

            if (attachHandler) attachHandler();

            continue;
        }

        const { getSelect, getValue } = getSelectApi();

        const select = getSelect();

        if (!select) continue;

        const options = await getOptions();

        select.options.length = 0;

        options.forEach((option) => {
            select.add(
                new Option(
                    option.label,
                    option.value,
                    false,
                    false
                )
            );
        });

        initSelect({
            selectedId: isSelected ? options[0]?.value : null
        });

        if (attachHandler) attachHandler();

        values[key] = () => ({
            [key]: getValue?.() || ''
        });
    }

    return {
        getValues: () => {
            return Object.assign(
                {},
                ...Object.values(values).map(getter => getter())
            );
        }
    };
};