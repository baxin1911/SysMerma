import { ExcededMaxRetriesSkuError } from "../../../errors/warehouse/productError.js";
import { findUniquePresentation } from "../presentationService.js";
import { findUniqueUnitMeasure } from "../unitMeasureService.js";

const MAX_RETRIES = 5;
const PRISMA_RECORD_NOT_UNIQUE = 'P2002';

export const prepareProductData = async ({ tx, productDto, productId = null }) => {

    const { presentationId, unitMeasureId, supplierId, ...rest } = productDto;

    await Promise.all([
        findUniqueUnitMeasure({ tx, id: unitMeasureId }),
        findUniquePresentation({ tx, id: presentationId })
    ]);

    return {
        rest,
        relations: {
            presentationId,
            unitMeasureId,
            supplierId
        }
    };
};

export const withRetry = async (fn) => {

    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {
            return await fn();
        } catch (err) {

            if (err.code === PRISMA_RECORD_NOT_UNIQUE) {
                attempts++;
                continue;
            }

            throw err;
        }
    }

    throw new ExcededMaxRetriesSkuError();
};