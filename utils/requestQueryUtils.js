const DEFAULT_PAGE_LENGTH = 10;
const ORDER_DIRECTIONS = new Set(['asc', 'desc']);

const parseInteger = (value, fallback) => {

    const parsed = Number.parseInt(value, 10);

    return Number.isNaN(parsed) ? fallback : parsed;
};

const getFirstOrder = (query = {}) => {

    if (Array.isArray(query.order)) return query.order[0] || {};

    if (query.order?.[0]) return query.order[0];

    return {};
};

const resolveFallbackColumn = (columns = []) => columns.find(Boolean);

export const getDataTablePaging = (query = {}) => ({
    skip: Math.max(parseInteger(query.start, 0), 0),
    take: Math.max(parseInteger(query.length, DEFAULT_PAGE_LENGTH), 0)
});

export const getDataTableSearch = (query = {}) => {

    if (typeof query.search === 'string') return query.search;

    if (typeof query.search?.value === 'string') return query.search.value;

    if (typeof query['search[value]'] === 'string') return query['search[value]'];

    return '';
};

export const getDataTableOrder = ({
    query = {},
    columns = [],
    defaultDirection = 'asc'
} = {}) => {

    const order = getFirstOrder(query);
    const fallbackColumn = resolveFallbackColumn(columns);

    const columnIndex = parseInteger(
        order?.column ?? query['order[0][column]'],
        0
    );

    const rawDirection = String(order?.dir ?? query['order[0][dir]'] ?? defaultDirection).toLowerCase();
    const normalizedDefaultDirection = String(defaultDirection).toLowerCase();
    const fallbackDirection = ORDER_DIRECTIONS.has(normalizedDefaultDirection) ? normalizedDefaultDirection : 'asc';
    const orderDir = ORDER_DIRECTIONS.has(rawDirection) ? rawDirection : fallbackDirection;
    const requestedColumn = columns[columnIndex];

    return {
        orderBy: requestedColumn || fallbackColumn,
        orderDir
    };
};
