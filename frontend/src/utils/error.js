export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
    return (
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        fallback
    );
}

export function getStatusCode(err) {
    return err?.response?.status ?? null;
}
