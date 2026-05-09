import { createGoodsIssueDetailsDtoForEdit, createGoodsIssueDtoForRegister } from "../../../dtos/goodsIssueDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    createGoodsIssue,
    findAllGoodsIssues,
    updateGoodsIssueDetails
} from "../../../services/warehouse/goodsIssues/goodsIssueService.js";
import { createStockNotification, notifyProductStockStatusChanges } from "../../../services/warehouse/notificationService.js";
import { emitStockUpdated } from "../../../utils/socketUtils.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllGoodsIssues = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || '';

    const columns = ['referenceNumber'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'desc';

    const result = await findAllGoodsIssues({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir,
        accesses: req.user?.accesses
    });

    res.status(200).json(result);
};

export const registerGoodsIssue = async (req, res) => {

    const goodsIssueDto = createGoodsIssueDtoForRegister(req.body);
    const sanitizedGoodsIssueDto = sanitizeEmptyStrings(goodsIssueDto);

    const goodsIssue = await createGoodsIssue({
        goodsIssueDto: sanitizedGoodsIssueDto
    });

    return res.status(200).json({
        goodsIssue,
        code: successCodeMessages.CREATED_GOODS_ISSUE
    });
};

export const editGoodsIssueDetails = async (req, res) => {

    const goodsIssueDto = createGoodsIssueDetailsDtoForEdit(req.body);
    const sanitizedGoodsIssueDto = sanitizeEmptyStrings(goodsIssueDto);

    const goodsIssue = await updateGoodsIssueDetails({
        goodsIssueDto: sanitizedGoodsIssueDto, 
        id: req.params.id
    });

    return res.status(200).json({
        goodsIssue,
        code: successCodeMessages.UPDATED_GOODS_ISSUE
    });
};