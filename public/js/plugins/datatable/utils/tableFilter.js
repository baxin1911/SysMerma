import { getFulfillmentStatusOptions } from "../../../application/warehouse/fulfillmentStatuses.js";
import { attachFulfillmentStatusHandler, getFulfillmentStatusSelectApi, initFulfillmentStatusSelect } from "../../select2/domains/fulfillmentStatus.js";

export const setupTableSelectFilter = async ({
    table = null
} = {}) => {
    const { getSelect, getValue } = getFulfillmentStatusSelectApi();
    const select = getSelect();

    if (!select) return { getValue };

    const options = await getFulfillmentStatusOptions();

    select.options.length = 0;
    options.forEach((option) => {
        select.add(new Option(option.label, option.value, false, false));
    });

    const selectedValue = options[0]?.value || '';

    initFulfillmentStatusSelect({
        selectedId: selectedValue || null
    });

    if (table?.ajax?.reload) {
        attachFulfillmentStatusHandler({
            onChange: () => table.ajax.reload(null, true)
        });
    }

    return { getValue };
};
