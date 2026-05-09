import { createGoodsReceiptDtoForRegister } from "../../../dtos/goodsReceiptDto.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    createGoodsReceipt,
    findAllGoodsReceipts
} from "../../../services/warehouse/goodsReceipts/goodsReceiptService.js";
import {
    createStockNotification,
    notifyProductStockStatusChanges,
} from "../../../services/warehouse/notificationService.js";
import { emitStockUpdated } from "../../../utils/socketUtils.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllGoodsReceipts = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || '';

    const columns = ['referenceNumber'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'desc';

    const result = await findAllGoodsReceipts({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
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
