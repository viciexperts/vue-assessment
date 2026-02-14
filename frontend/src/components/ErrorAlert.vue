<template>
  <div class="alert" role="alert" aria-live="assertive">
    <div class="alert-head">
      <strong class="alert-title">{{ title }}</strong>
    </div>
    <p class="alert-message">{{ message }}</p>

    <div v-if="$slots.actions" class="alert-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Something went wrong' },
  message: { type: String, required: true }
});
</script>

<style scoped>
.alert {
  border: 1px solid rgba(255, 99, 99, 0.35);
  background: rgba(255, 99, 99, 0.12);
  border-radius: 12px;
  padding: 14px 14px 12px;
}

.alert-title {
  display: block;
  margin-bottom: 6px;
}

.alert-message {
  margin: 0;
  opacity: 0.95;
  line-height: 1.35;
}

.alert-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
