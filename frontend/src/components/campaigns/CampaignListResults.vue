<template>
  <div>
    <div v-if="loading" class="skeleton-list" aria-label="Loading campaigns">
      <article
          v-for="i in skeletonCount"
          :key="`sk-${i}`"
          class="card skeleton-card"
          aria-hidden="true"
      >
        <div class="card-top">
          <SkeletonBlock height="18px" width="70%" />
          <SkeletonBlock height="22px" width="92px" />
        </div>
        <div class="card-mid">
          <SkeletonBlock height="12px" width="30%" />
          <SkeletonBlock height="16px" width="40%" />
        </div>
        <div class="card-mid">
          <SkeletonBlock height="12px" width="22%" />
          <SkeletonBlock height="16px" width="55%" />
        </div>
      </article>
    </div>

    <div v-else class="results">
      <article v-for="c in campaigns" :key="c.id" class="card">
        <div class="card-top">
          <h3 class="name">{{ c.name }}</h3>
          <StatusBadge :status="c.status" />
        </div>

        <div class="row">
          <div class="label">BUDGET</div>
          <div class="value">{{ formatCurrency(c.budget) }}</div>
        </div>

        <div class="row">
          <div class="label">DATES</div>
          <div class="value">
            {{ formatDate(c.startDate) }} → {{ formatDate(c.endDate) }}
          </div>
        </div>
      </article>

      <p v-if="!campaigns?.length" class="empty">
        No campaigns match your filters.
      </p>
    </div>
  </div>
</template>

<script setup>
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  loading: { type: Boolean, default: false },
  campaigns: { type: Array, default: () => [] },
  formatCurrency: { type: Function, required: true },
  formatDate: { type: Function, required: true },
  skeletonCount: { type: Number, default: 6 },
})
</script>

<style scoped>
.results {
  display: grid;
  gap: 14px;
}

.card {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px 16px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.name {
  margin: 0;
  font-size: 18px;
}

.row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid var(--border);
}

.label {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--muted);
  font-weight: 700;
}

.value {
  font-weight: 700;
}

.empty {
  margin-top: 10px;
  color: var(--muted);
}

/* Skeleton */
.skeleton-list {
  display: grid;
  gap: 14px;
}

.skeleton-card .card-top,
.skeleton-card .card-mid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.skeleton-card .card-mid {
  margin-bottom: 6px;
}
</style>
