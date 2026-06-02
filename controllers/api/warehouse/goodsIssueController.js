import { createGoodsIssueDetailsDtoForEdit, createGoodsIssueDtoForEdit, createGoodsIssueDtoForRegister } from "../../../dtos/goodsIssueDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    createGoodsIssue,
    findAllGoodsIssues,
    updateGoodsIssue,
    updateGoodsIssueDetails
} from "../../../services/warehouse/goodsIssues/goodsIssueService.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";
import { createStockNotification, notifyProductStockStatusChanges } from "../../../services/warehouse/notificationService.js";
import { emitStockUpdated } from "../../../utils/socketUtils.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllGoodsIssues = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);
    const fulfillmentStatusId = req.query.fulfillmentStatusId || '';

    const columns = ['referenceNumber', 'requestDate', 'departmentName', 'projectNumber', 'clientName', null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns,
        defaultDirection: 'desc'
    });

    const result = await findAllGoodsIssues({
        skip,
        take,
        search,
        fulfillmentStatusId,
        orderBy,
        orderDir,
        accesses: req.user?.accesses
    });

    return res.status(200).json(result);
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

export const editGoodsIssue = async (req, res) => {

    const goodsIssueDto = createGoodsIssueDtoForEdit(req.body);
    const sanitizedGoodsIssueDto = sanitizeEmptyStrings(goodsIssueDto);

    const goodsIssue = await updateGoodsIssue({
        goodsIssueDto: sanitizedGoodsIssueDto,
        id: req.params.id
    });

    return res.status(200).json({
        goodsIssue,
        code: successCodeMessages.UPDATED_GOODS_ISSUE
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
