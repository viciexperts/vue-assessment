import { computed } from 'vue';

export function usePagination(route, router, { defaultLimit = 10 } = {}) {
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const limit = computed(() => Math.max(1, Number(route.query.limit) || defaultLimit));

    const setPage = (next) => router.replace({ query: { ...route.query, page: next } });
    const setLimit = (next) => router.replace({ query: { ...route.query, limit: next, page: 1 } });

    return { page, limit, setPage, setLimit };
}
