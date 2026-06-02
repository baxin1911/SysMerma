import { createGoodsReceiptDtoForRegister } from "../../../dtos/goodsReceiptDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    createGoodsReceipt,
    findAllGoodsReceipts
} from "../../../services/warehouse/goodsReceipts/goodsReceiptService.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";
import {
    createStockNotification,
    notifyProductStockStatusChanges,
} from "../../../services/warehouse/notificationService.js";
import { emitStockUpdated } from "../../../utils/socketUtils.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllGoodsReceipts = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['referenceNumber', 'receptionDate', 'supplierName', 'invoice', null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns,
        defaultDirection: 'desc'
    });

    const result = await findAllGoodsReceipts({
        skip,
        take,
        search,
        orderBy,
        orderDir
    });

    return res.status(200).json(result);
}

export const registerGoodsReceipt = async (req, res) => {

    const goodsReceiptDto = createGoodsReceiptDtoForRegister(req.body);
    const sanitizedGoodsReceiptDto = sanitizeEmptyStrings(goodsReceiptDto);

    const goodsReceipt = await createGoodsReceipt({
        goodsReceiptDto: sanitizedGoodsReceiptDto
    });

    return res.status(200).json({
        goodsReceipt,
        code: successCodeMessages.CREATED_GOODS_RECEIPT
    });
}
