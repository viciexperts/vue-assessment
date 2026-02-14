<template>
  <nav class="pagination" aria-label="Pagination">
    <button
        type="button"
        class="btn"
        :disabled="page <= 1 || disabled"
        @click="$emit('update:page', page - 1)"
    >
      Prev
    </button>

    <div class="meta" aria-live="polite">
      <span class="meta-strong">Page {{ page }}</span>
      <span class="meta-muted">of {{ totalPages }}</span>
      <span class="meta-muted" v-if="total">({{ total }} total)</span>
    </div>

    <button
        type="button"
        class="btn"
        :disabled="page >= totalPages || disabled"
        @click="$emit('update:page', page + 1)"
    >
      Next
    </button>
  </nav>
</template>

<script setup>
defineEmits(['update:page']);

defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  total: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false }
});
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0 6px;
}

.meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
}

.meta-strong {
  font-weight: 650;
}

.meta-muted {
  opacity: 0.75;
  font-size: 13px;
}
</style>
