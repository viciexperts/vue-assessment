<template>
  <div class="sk" :style="{ height, width }" aria-hidden="true"></div>
</template>

<script setup>
defineProps({
  height: { type: String, default: '12px' },
  width: { type: String, default: '100%' }
});
</script>

<style scoped>
.sk {
  border-radius: 10px;
  background: color-mix(in srgb, var(--surface) 70%, var(--text) 8%);
  position: relative;
  overflow: hidden;
}

.sk::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--surface) 60%, var(--text) 14%),
      transparent
  );
  animation: shimmer 1.1s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
