import { prisma } from "../lib/prisma.js";
import XLSX from 'xlsx';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const toDecimal = (value) => {
    if (value === null || value === undefined || value === '') return NaN;
    return Number(value);
};

const cleanValue = val => {
    if (val === 0 || val === "0" || val == null) return null;

    const str = String(val).trim();
    return str || null;
};

async function main() {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath1 = path.join(__dirname, 'LISTA_ADMIN.xlsx');
    const workbook1 = XLSX.readFile(filePath1);

    const departmentSheet = workbook1.Sheets['AREAS'];
    const departmentRows = XLSX.utils.sheet_to_json(departmentSheet, {
        defval: null,
    });

    const departmentParsed = departmentRows.map(row => {
        const name = cleanValue(row.department);
        if (!name) return null;

        return { name };
    }).filter(Boolean);

    await prisma.department.createMany({
        data: departmentParsed,
        skipDuplicates: true
    });

    const departments = await prisma.department.findMany({
        select: {
            id: true,
            name: true
        }
    });
    
    const countProfile = await prisma.profile.count();

    if (countProfile < 1) {
        const relationDepartmentSheet = workbook1.Sheets['RELACIONES_PERFIL'];
        const relationProfileDepartmentRows = XLSX.utils.sheet_to_json(relationDepartmentSheet, {
            defval: null,
        });

        const profileParsed = relationProfileDepartmentRows.map(row => {
            const fullName = cleanValue(row.fullName);
            if (!fullName) return null;

            return { fullName };
        }).filter(Boolean);

        await prisma.profile.createMany({
            data: profileParsed,
            skipDuplicates: true
        });

        const profiles = await prisma.profile.findMany({
            select: {
                id: true,
                fullName: true
            }
        });
        const profileMap = new Map(profiles.map(p => [cleanValue(p.fullName), p.id]));

        const departmentMap = new Map(departments.map(d => [cleanValue(d.name), d.id]));

        const relationProfileDepartmentParsed = relationProfileDepartmentRows.map(row => {

            const fullName = cleanValue(row.fullName);
            const department = cleanValue(row.department);

            if (!fullName || !department) {
                console.log('Error en fila: ', row);
                return null;
            }

            const profileId = profileMap.get(fullName);
            const departmentId = departmentMap.get(department);

            if (!profileId || !departmentId) {
                console.log('No encontrado en Map: ', { fullName, department });
                return null;
            }

            return {
                profileId,
                departmentId
            };

        }).filter(Boolean);

        await prisma.departmentProfile.createMany({
            data: relationProfileDepartmentParsed,
            skipDuplicates: true
        });
    }

    const clientSheet = workbook1.Sheets['CLIENTES'];
    const clientRows = XLSX.utils.sheet_to_json(clientSheet, {
        defval: null,
    });

    const clientParsed = clientRows.map(row => {
        const name = cleanValue(row.client);
        if (!name) return null;

        return { name };
    }).filter(Boolean);

    await prisma.client.createMany({
        data: clientParsed,
        skipDuplicates: true
    });

    await prisma.role.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000020', name: 'Administrador del sistema' },
            { id: '00000000-0000-0000-0000-000000000021', name: 'Coordinador' },
            { id: '00000000-0000-0000-0000-000000000022', name: 'Auxiliar' },
            { id: '00000000-0000-0000-0000-000000000023', name: 'Operador' },
            { id: '00000000-0000-0000-0000-000000000024', name: 'Instalador' },
            { id: '00000000-0000-0000-0000-000000000025', name: 'Diseñador' },
            { id: '00000000-0000-0000-0000-000000000026', name: 'Almacenista' },
            { id: '00000000-0000-0000-0000-000000000027', name: 'Vendedor' },
            { id: '00000000-0000-0000-0000-000000000028', name: 'Repartidor' },
        ],
        skipDuplicates: true
    });

    await prisma.status.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000030', name: 'Abierta' },
            { id: '00000000-0000-0000-0000-000000000031', name: 'Cerrada' },
            { id: '00000000-0000-0000-0000-000000000032', name: 'Aprobada' },
            { id: '00000000-0000-0000-0000-000000000033', name: 'Rechazada' },
            { id: '00000000-0000-0000-0000-000000000034', name: 'Confirmada' },
            { id: '00000000-0000-0000-0000-000000000035', name: 'Cancelada' },
        ],
        skipDuplicates: true
    });

    // const hashedPassword = await bcrypt.hash('A%54321', 10)

    const countUser = await prisma.user.count();

    if (countUser < 1) {

        const user = await prisma.user.upsert({
            where: {
                name: 'Soporte01',
            },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000040',
                name: 'Soporte01',
                password: 'A%54321',
                isActive: true,
            },
        });

        const roles = await prisma.role.findMany({
            select: { id: true, name: true }
        });
        const roleByName = Object.fromEntries(roles.map((role) => [role.name, role.id]));

        for (const dept of departments) {
            await prisma.userRoleDepartment.upsert({
                where: {
                    userId_roleId_departmentId: {
                        userId: user.id,
                        roleId: '00000000-0000-0000-0000-000000000020', // Admin
                        departmentId: dept.id
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: '00000000-0000-0000-0000-000000000020',
                    departmentId: dept.id
                }
            });
        }
    }

    await prisma.fulfillmentStatus.createMany({
        data: [
            { name: 'Pendiente' },
            { name: 'Surtido parcial' },
            { name: 'Surtido' },
        ],
        skipDuplicates: true
    });

    await prisma.referenceNumberCounter.createMany({
        data: [
            { prefix: 'REC' },
            { prefix: 'SAL'},
            { prefix: 'REQ' },
            { prefix: 'PRO' },
        ],
        skipDuplicates: true
    });

    await prisma.presentation.createMany({
        data: [
            { name: 'ROLLO' },
            { name: 'PIEZA' },
            { name: 'CARTUCHO' },
            { name: 'HOJA' },
        ],
        skipDuplicates: true
    });

    await prisma.unitMeasure.createMany({
        data: [
            { name: 'PIEZA', symbol: 'PZA.' },
            { name: 'METRO CUADRADO', symbol: 'M2'},
            { name: 'METRO LINEAL', symbol: 'ML' },
            { name: 'LITROS', symbol: 'LTS.' },
        ],
        skipDuplicates: true
    });

    const presentations = await prisma.presentation.findMany();
    const unitMeasures = await prisma.unitMeasure.findMany();

    const presentationMap = new Map(presentations.map(p => [p.name, p.id]));
    const unitMeasureMap = new Map(unitMeasures.map(um => [um.symbol, um.id]));

    const filePath2 = path.join(__dirname, 'inventario_BD - PRECIOS.xlsx');
    const workbook2 = XLSX.readFile(filePath2);
    const productSheet = workbook2.Sheets['PRODUCTOS'];
    const productRows = XLSX.utils.sheet_to_json(productSheet, {
        defval: null,
    });

    const productParsed = productRows.map(row => {

        const base = toDecimal(row.base);
        const height = toDecimal(row.height);
        const minStock = toDecimal(row.minStock);

        return {
            name: row.name,
            sku: row.sku,

            minStock: isNaN(minStock) ? 0 : minStock,

            base: (!base || isNaN(base)) ? null : base,
            height: (!height || isNaN(height)) ? null : height,

            presentationId: presentationMap.get(row.presentation.trim()) || null,
            unitMeasureId: unitMeasureMap.get(row.unitMeasure.trim()) || null,
        };
    });

    if(productParsed.some(p => !p.presentationId || !p.unitMeasureId)) {
        console.log('Error: Algunos productos tienen presentación o unidad de medida no encontrados');
        console.log(productParsed.filter(p => !p.presentationId || !p.unitMeasureId));
    }

    await prisma.product.createMany({
        data: productParsed,
        skipDuplicates: true
    });

    const supplierSheet = workbook2.Sheets['PROVEEDORES'];
    const supplierRows = XLSX.utils.sheet_to_json(supplierSheet, {
        defval: null,
    });

    let counter;

    const supplierParsed = supplierRows.map((row, index) => {

        counter = index + 1;
        
        return {
            codeNumber: counter,
            code: row.code,
            legalName: row.legalName,
            tradeName: row.tradeName
        }
    });

    await prisma.referenceNumberCounter.update({
        where: {
            prefix: 'PRO'
        },
        data: {
            counter: counter
        }
    });

    await prisma.supplier.createMany({
        data: supplierParsed,
        skipDuplicates: true,
    });

    const skus = productParsed.map(p => p.sku);

    const products = await prisma.product.findMany({
        where: {
            sku: {
                in: skus
            }
        },
        select: {
            id: true,
            sku: true
        }
    });

    const productMap = new Map(products.map(p => [p.sku, p.id]));

    const supplierTradeNames = supplierParsed.map(s => s.tradeName);

    const suppliers = await prisma.supplier.findMany({
        where: {
            tradeName: {
                in: supplierTradeNames
            }
        },
        select: {
            id: true,
            tradeName: true
        }
    });

    const supplierMap = new Map(suppliers.map(s => [s.tradeName, s.id]))

    const relationSupplierProductSheet = workbook2.Sheets['RELACIONES'];
    const relationSupplierProductRows = XLSX.utils.sheet_to_json(relationSupplierProductSheet, {
        defval: null,
    });

    const relationsSupplierProductParsed = relationSupplierProductRows.map(row => {

        const productId = productMap.get(row.skuProduct);
        const supplierId = supplierMap.get(row.supplier);
        const currentStock = toDecimal(row.currentStock);
        const convertedQuantity = toDecimal(row.convertedQuantity);
        const maxUnitCost = toDecimal(row.maxUnitCost); 

        if (!supplierId || !productId || !maxUnitCost) {
            console.log('Error en fila: ',row);
            return null;
        }

        return {
            productId,
            supplierId,
            currentStock: isNaN(currentStock) ? 0 : currentStock,
            convertedQuantity: isNaN(convertedQuantity) ? 0 : convertedQuantity,
            maxUnitCost: isNaN(maxUnitCost) ? 0 : maxUnitCost,
            sku: row.sku
        }
    }).filter(Boolean);

    await prisma.supplierProduct.createMany({
        data: relationsSupplierProductParsed,
        skipDuplicates: true
    });
}

main().finally(() => {
    prisma.$disconnect();
});
