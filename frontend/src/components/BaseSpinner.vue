<template>
  <div class="spinner" role="status" aria-live="polite" :aria-label="label">
    <span class="spinner-ring" aria-hidden="true"></span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'Loading' }
});
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.85);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
