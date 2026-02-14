import { nextTick, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useRouteFocus(getEl) {
    const route = useRoute();

    const focus = async () => {
        await nextTick();
        const el = getEl?.();
        if (el && typeof el.focus === 'function') el.focus();
    };

    onMounted(focus);
    watch(() => route.fullPath, focus);
}
