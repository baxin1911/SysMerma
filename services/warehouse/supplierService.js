import { AppError } from "../../errors/AppError.js";
import { SupplierCodeFindDatabaseError, SupplierCodeNotFound, SupplierCreateDatabaseError, SupplierNotFound, SupplierUpdateDatabaseError } from "../../errors/warehouse/supplierError.js";
import { getDb } from "../../repository/baseRepository.js";
import { incrementReferenceNumberCounter } from "../document/referenceNumberService.js";

const SUPPLIER_CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const numberToSupplierCode = (number) => {

    let current = number + 1;
    let code = '';

    while (current > 0) {
        current -= 1;
        code = SUPPLIER_CODE_ALPHABET[current % 26] + code;
        current = Math.floor(current / 26);
    }

    return code;
};
export const findAllSuppliers = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'legalName',
    orderDir = 'asc'
}) => {

    const db = getDb();

    const where = search
        ? {
            tradeName: {
                contains: search,
                mode: 'insensitive'
            }
        }
        : {};

    const suppliers = await db.supplier.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await db.supplier.count();
    const filtered = await db.supplier.count({ where });

    return {
        data: suppliers,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const findUniqueSupplier = async ({
    tx = null,
    id
}) => {

    const supplier = await getDb(tx).supplier.findUnique({
        where: { id },
        select: {
            id: true,
            tradeName: true,
        }
    });

    if (!supplier) throw new SupplierNotFound();

    return supplier;
};

export const findUniqueSupplierCode = async ({
    tx = null,
    id
}) => {

    const supplier = await getDb(tx).supplier.findUnique({
        where: { id },
        select: { code: true }
    });

    if (!supplier) throw new SupplierCodeNotFound();

    return supplier;
};

export const createSupplier = async (supplierDto) => {

    try {

        return await getDb().$transaction(async (tx) => {

            const counter = await incrementReferenceNumberCounter({
                type: 'PRO',
                tx
            });

            const codeNumber = counter.counter;
            const generatedCode = numberToSupplierCode(codeNumber - 1);

            return tx.supplier.create({
                data: {
                    ...supplierDto,
                    codeNumber,
                    code: generatedCode,
                }
            });
        });

    } catch (err) {

        throw new SupplierCreateDatabaseError();
    }
};

export const updateSupplier = async (supplierDto, id) => {

    const db = getDb();

    const supplierExists = await db.supplier.findUnique({
        where: { id },
        select: { id: true }
    });

    if (!supplierExists) throw new SupplierNotFound();

    try {

        return await db.supplier.update({
            data: { ...supplierDto },
            where: { id }
        });

    } catch (err) {

        if (err instanceof AppError) throw err;

        throw new SupplierUpdateDatabaseError();
    }
};
