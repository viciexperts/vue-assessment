export function debounce(fn, wait = 300) {
    let timeoutId = null;

    return (...args) => {
        if (timeoutId) window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => fn(...args), wait);
    };
}
