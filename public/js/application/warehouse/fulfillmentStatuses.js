import { getAllFulfillmentStatusesRequest } from "../../services/warehouse/fulfillmentStatusService.js";

export const getFulfillmentStatusOptions = async () => {

    const response = await getAllFulfillmentStatusesRequest();
    
    const list = response.data?.data || [];

    return list
        .filter(status => status?.id && status?.name)
        .map(status => ({
            value: status.id,
            label: status.name
        }));
};
