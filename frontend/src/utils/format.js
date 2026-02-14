export function formatCurrency(value, currency = 'USD') {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return '—';

    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(numericValue);
}

export function formatDate(isoDateString) {
    if (!isoDateString) return '—';

    const date = new Date(isoDateString);
    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).format(date);
}

export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
