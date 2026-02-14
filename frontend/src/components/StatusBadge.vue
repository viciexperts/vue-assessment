<template>
  <span class="badge" :class="badgeClass">
    <span class="dot" aria-hidden="true"></span>
    <span class="label">{{ normalized }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, default: '' }
});

const normalized = computed(() => {
  const value = (props.status || '').toLowerCase().trim();
  if (!value) return 'unknown';
  return value;
});

const badgeClass = computed(() => {
  switch (normalized.value) {
    case 'active':
      return 'is-active';
    case 'paused':
      return 'is-paused';
    case 'completed':
      return 'is-completed';
    case 'draft':
      return 'is-draft';
    default:
      return 'is-unknown';
  }
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  user-select: none;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
}

.is-active .dot {
  background: rgba(52, 211, 153, 0.9);
}
.is-paused .dot {
  background: rgba(251, 191, 36, 0.9);
}
.is-completed .dot {
  background: rgba(96, 165, 250, 0.9);
}
.is-draft .dot {
  background: rgba(167, 139, 250, 0.9);
}
.is-unknown .dot {
  background: rgba(255, 255, 255, 0.35);
}

.label {
  text-transform: capitalize;
}
</style>
