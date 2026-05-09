import { AppError } from "../AppError.js";

export class GoodsIssueInsufficientStock extends AppError {

    constructor ({ productName, height, base, supplierName }) {

        const hasDimensions =
            base != null &&
            height != null;

        const dimensions = hasDimensions
            ? ` (${ base } x ${ height })`
            : '';

        const supplier = supplierName
            ? ` y proveedor: ${ supplierName }`
            : '';

        super(
            `Stock insuficiente para realizar la salida con el producto: ${ productName } (${ dimensions }) y proveedor: ${ supplier }`, 
            'GOODS_ISSUE_INSUFFICIENT_STOCK', 
            409
        );

        this.meta = { productName, height, base, supplierName };
    }
}

export class GoodsIssueInexistentStock extends AppError {

    constructor ({ productName, height, base, supplierName }) {

        const hasDimensions =
            base != null &&
            height != null;

        const dimensions = hasDimensions
            ? ` (${ base } x ${ height })`
            : '';

        const supplier = supplierName
            ? ` y proveedor: ${ supplierName }`
            : '';

        super(
            `Stock inexistente para realizar la salida del producto: ${ productName }${ dimensions }${ supplier }`,
            'GOODS_ISSUE_INEXISTENT_STOCK',
            409
        );

        this.meta = {
            productName,
            height,
            base,
            supplierName
        };
    }
}

export class GoodsIssueMissingMaxUnitCost extends AppError {

    constructor ({ productName, height, base, supplierName }) {
        super(
            `No se puede realizar la salida porque el producto no tiene costo unitario máximo configurado: ${ productName } (${ base } x ${ height }) y proveedor: ${ supplierName }`,
            'GOODS_ISSUE_MISSING_MAX_UNIT_COST',
            409
        );

        this.meta = { productName, height, base, supplierName };
    }
}
