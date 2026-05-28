export const formatShortDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('es-MX', options);
}

export const formatNotificationDate = (dateValue) => new Date(dateValue).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

export const formatDateLongWithTime = (dateTime) => {

    if (!dateTime) return '';

    const date = new Date(dateTime);
    const localYear = date.getFullYear();
    const localMonth = String(date.getMonth() + 1).padStart(2, '0');
    const localDay = String(date.getDate()).padStart(2, '0');
    const localHours = String(date.getHours()).padStart(2, '0');
    const localMinutes = String(date.getMinutes()).padStart(2, '0');

    const formatted = `${localYear}-${localMonth}-${localDay}T${localHours}:${localMinutes}`;

    return formatted;
}

export const formatFileName = (filename) => {

    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const year = now.getUTCFullYear();

    return `${ filename }_${ month }_${ year }`;
}

export const normalizeText = (value = '') => value.trim().toUpperCase();
