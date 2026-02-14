import { computed, ref, watch } from 'vue';

export function useCampaignFilters(route, router, { debounceMs = 250 } = {}) {
    const q = computed(() => (route.query.q ?? '').toString());
    const status = computed(() => (route.query.status ?? '').toString());

    const searchDraft = ref(q.value);
    const statusDraft = ref(status.value);

    // Mantener inputs en sync si cambian query params (back/forward)
    watch(q, (val) => { if (val !== searchDraft.value) searchDraft.value = val; });
    watch(status, (val) => { if (val !== statusDraft.value) statusDraft.value = val; });

    let t = null;
    const pushFilters = (nextQ, nextStatus) => {
        router.replace({
            query: {
                ...route.query,
                q: nextQ || undefined,
                status: nextStatus || undefined,
                page: 1
            }
        });
    };

    watch(searchDraft, (val) => {
        window.clearTimeout(t);
        t = window.setTimeout(() => pushFilters(val, statusDraft.value), debounceMs);
    });

    watch(statusDraft, (val) => {
        // status cambia sin debounce (o si quieres, aplica debounce también)
        pushFilters(searchDraft.value, val);
    });

    const clear = () => {
        searchDraft.value = '';
        statusDraft.value = '';
        router.replace({ query: { ...route.query, q: undefined, status: undefined, page: 1 } });
    };

    return { q, status, searchDraft, statusDraft, clear };
}
