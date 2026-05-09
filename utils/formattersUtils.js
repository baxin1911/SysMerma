export const sanitizeEmptyStrings = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === '' ? null : value
    ])
  );
};

export const cleanSearchTerm = (search) => {

  const cleaned = search.trim();
  let codeSearch = search;
  let nameSearch = search;

  if (cleaned.includes('-')) {

    const parts = cleaned.split('-').map(part => part.trim());
    codeSearch = parts[0];
    nameSearch = parts.slice(1).join('-');
  }

  return { codeSearch, nameSearch };
};

export const roundTo = (value, decimals = 2) => {

    const factor = 10 ** decimals;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
};

export const buildStockKey = (productId, supplierId) =>
    `${productId}:${supplierId}`;

export const parseStockKey = (key) => {
    const [productId, supplierId] = key.split(':');
    return { productId, supplierId };
};