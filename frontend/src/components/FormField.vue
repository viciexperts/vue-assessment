<template>
  <div class="field" :class="{ 'has-error': !!error }">
    <label class="label" :for="id">
      {{ label }}
      <span v-if="required" class="req" aria-hidden="true">*</span>
    </label>

    <div class="control">
      <slot />
    </div>

    <p v-if="hint" class="hint" :id="`${id}-hint`">{{ hint }}</p>

    <p
        v-if="error"
        class="error"
        :id="`${id}-error`"
        role="alert"
        aria-live="assertive"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false }
});
</script>

<style scoped>
.field {
  display: grid;
  gap: 8px;
}

.label {
  font-weight: 600;
}

.req {
  margin-left: 4px;
  opacity: 0.85;
}

.hint {
  margin: 0;
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.3;
}

.error {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 140, 140, 0.95);
  line-height: 1.3;
}

.has-error .control :deep(.input),
.has-error .control :deep(textarea.input),
.has-error .control :deep(select.input) {
  border-color: rgba(255, 120, 120, 0.7);
}
</style>
