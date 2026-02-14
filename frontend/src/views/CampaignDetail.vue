<template>
  <section class="campaign-detail">
    <div class="container">
      <!-- Header (actions) -->
      <header class="page-header">
        <button type="button" class="btn btn-ghost" @click="goBack">
          ← Back
        </button>

        <router-link
            v-if="campaign"
            class="btn btn-ghost"
            :to="`/campaigns/${campaign.id}/edit`"
        >
          Edit
        </router-link>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="detail-skeleton" aria-label="Loading campaign">
        <div class="title-row">
          <SkeletonBlock height="26px" width="60%" />
          <SkeletonBlock height="26px" width="110px" />
        </div>

        <div class="s-desc">
          <SkeletonBlock height="12px" width="92%" />
          <SkeletonBlock height="12px" width="85%" />
        </div>

        <div class="grid">
          <article class="panel">
            <h3 class="panel-title">Overview</h3>

            <div class="s-rows">
              <div class="s-row">
                <SkeletonBlock height="12px" width="70px" />
                <SkeletonBlock height="14px" width="120px" />
              </div>
              <div class="s-row">
                <SkeletonBlock height="12px" width="55px" />
                <SkeletonBlock height="14px" width="120px" />
              </div>
              <div class="s-row">
                <SkeletonBlock height="12px" width="45px" />
                <SkeletonBlock height="14px" width="180px" />
              </div>
              <div class="s-row">
                <SkeletonBlock height="12px" width="110px" />
                <SkeletonBlock height="14px" width="150px" />
              </div>
            </div>
          </article>

          <article class="panel">
            <h3 class="panel-title">Metrics</h3>

            <div class="metrics">
              <div class="metric">
                <SkeletonBlock height="12px" width="90px" />
                <SkeletonBlock height="18px" width="120px" />
              </div>

              <div class="metric">
                <SkeletonBlock height="12px" width="70px" />
                <SkeletonBlock height="18px" width="90px" />
              </div>

              <div class="metric">
                <SkeletonBlock height="12px" width="105px" />
                <SkeletonBlock height="18px" width="80px" />
              </div>

              <div class="metric">
                <SkeletonBlock height="12px" width="55px" />
                <SkeletonBlock height="18px" width="70px" />
              </div>

              <div class="metric">
                <SkeletonBlock height="12px" width="55px" />
                <SkeletonBlock height="18px" width="90px" />
              </div>
            </div>
          </article>
        </div>
      </div>


      <!-- Error -->
      <ErrorAlert
          v-else-if="errorMessage"
          title="Unable to load campaign"
          :message="errorMessage"
      />

      <!-- Not found -->
      <div v-else-if="notFound" class="empty" role="status" aria-live="polite">
        <h2 class="empty-title">Campaign not found</h2>
        <p class="empty-subtitle">The campaign you requested doesn’t exist.</p>
        <router-link class="btn" to="/">Back to list</router-link>
      </div>

      <!-- Content -->
      <div v-else-if="campaign" class="content">
        <!-- HERO CARD (same style as Overview) -->
        <section class="panel hero-panel" aria-label="Campaign summary">
          <div class="hero-head">
            <div class="hero-text">
              <h2 class="hero-title">{{ campaign.name }}</h2>
              <p class="hero-subtitle" v-if="campaign.description">
                {{ campaign.description }}
              </p>
            </div>

            <div class="hero-meta">
              <StatusBadge :status="campaign.status" />
            </div>
          </div>
        </section>

        <!-- Two column layout -->
        <div class="grid">
          <!-- Overview -->
          <section class="panel" aria-label="Overview">
            <h3 class="panel-title">Overview</h3>

            <div class="row">
              <span class="label">Budget</span>
              <span class="value">{{ formatCurrency(campaign.budget) }}</span>
            </div>

            <div class="row">
              <span class="label">Spent</span>
              <span class="value">{{ formatCurrency(campaign.spent) }}</span>
            </div>

            <div class="row">
              <span class="label">Dates</span>
              <span class="value">
                {{ formatDate(campaign.startDate) }} → {{ formatDate(campaign.endDate) }}
              </span>
            </div>

            <div class="row">
              <span class="label">Target audience</span>
              <span class="value">{{ campaign.targetAudience || '—' }}</span>
            </div>
          </section>

          <!-- Metrics -->
          <section class="panel" aria-label="Metrics">
            <h3 class="panel-title">Metrics</h3>

            <div class="metrics">
              <div class="metric" aria-label="Impressions">
                <span class="metric-label">Impressions</span>
                <span class="metric-value">{{ number(campaign.metrics?.impressions) }}</span>
              </div>

              <div class="metric" aria-label="Clicks">
                <span class="metric-label">Clicks</span>
                <span class="metric-value">{{ number(campaign.metrics?.clicks) }}</span>
              </div>

              <div class="metric" aria-label="Conversions">
                <span class="metric-label">Conversions</span>
                <span class="metric-value">{{ number(campaign.metrics?.conversions) }}</span>
              </div>

              <div class="metric" aria-label="CTR">
                <span class="metric-label">CTR</span>
                <span class="metric-value">{{ percent(campaign.metrics?.ctr) }}</span>
              </div>

              <div class="metric metric-wide" aria-label="CPC">
                <span class="metric-label">CPC</span>
                <span class="metric-value">{{ formatCurrency(campaign.metrics?.cpc) }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getErrorMessage, getStatusCode } from '../utils/error';
import SkeletonBlock from '../components/SkeletonBlock.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCampaignsStore } from '../stores/campaigns';
import { formatCurrency, formatDate } from '../utils/format';

import BaseSpinner from '../components/BaseSpinner.vue';
import ErrorAlert from '../components/ErrorAlert.vue';
import StatusBadge from '../components/StatusBadge.vue';

const route = useRoute();
const router = useRouter();
const store = useCampaignsStore();

const campaign = ref(null);
const notFound = ref(false);

const loading = computed(() => store.detailLoading);
const error = computed(() => store.detailError);

const errorMessage = computed(() => {
  if (!error.value) return '';
  if (getStatusCode(error.value) === 404) return '';
  return getErrorMessage(error.value);
});
const load = async () => {
  try {
    campaign.value = await store.loadById(route.params.id);
    if (!campaign.value) notFound.value = true;
  } catch {
    notFound.value = true;
  }
};

const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push('/');
};

const number = (v) =>
    Number.isFinite(Number(v)) ? new Intl.NumberFormat().format(v) : '—';

const percent = (v) =>
    Number.isFinite(Number(v)) ? `${Number(v).toFixed(1)}%` : '—';

onMounted(load);
</script>

<style scoped>
/* -------- Theme tokens (safe + explicit) -------- */
.campaign-detail {
  --text: #111827;
  --muted: rgba(17, 24, 39, 0.72);
  --border: rgba(0, 0, 0, 0.12);

  --surface: #ffffff;
  --surface-2: #f3f4f6;

  padding: 24px 0 36px;
}

@media (prefers-color-scheme: dark) {
  .campaign-detail {
    --text: rgba(255, 255, 255, 0.94);
    --muted: rgba(255, 255, 255, 0.72);
    --border: rgba(255, 255, 255, 0.12);

    --surface: #2f2f2f;
    --surface-2: #363636;
  }
}

/* -------- Header -------- */
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

/* -------- Buttons -------- */
.btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn:hover {
  background: var(--surface-2);
}

.btn-ghost {
  background: var(--surface-2);
}

/* -------- Panels -------- */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
}

.panel-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  color: var(--muted);
  margin: 0 0 14px;
}

/* HERO panel */
.hero-panel {
  margin-bottom: 16px;
}

.hero-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

/* IMPORTANT: force visibility no matter global styles */
.hero-text,
.hero-text * {
  color: var(--text) !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.hero-title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.2px;
}

.hero-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: var(--muted) !important; /* still readable */
}

.hero-meta {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 120px;
}

/* -------- Grid layout -------- */
.grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}

.label {
  color: var(--muted);
}

.value {
  color: var(--text);
  font-weight: 800;
  text-align: right;
}

/* -------- Metrics -------- */
.metrics {
  display: grid;
  gap: 12px;
}

@media (min-width: 560px) {
  .metrics {
    grid-template-columns: 1fr 1fr;
  }
  .metric-wide {
    grid-column: span 2;
  }
}
.metric {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);

  /* ✅ add spacing */
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-label {
  display: block;
  font-size: 12px;
  opacity: 0.72;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  line-height: 1.2;        /* ✅ */
}

.metric-value {
  font-weight: 700;
  font-size: 18px;         /* ✅ a bit more readable */
  line-height: 1.1;        /* ✅ */
}

/* -------- States -------- */
.loading-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
}

.loading-text {
  color: var(--muted);
}

.empty {
  border: 1px dashed var(--border);
  border-radius: 16px;
  padding: 18px;
}

.empty-title {
  margin: 0 0 6px;
  color: var(--text);
}

.empty-subtitle {
  margin: 0 0 14px;
  color: var(--muted);
}

/* Ensure StatusBadge readable */
:deep(.badge) {
  color: var(--text);
  border-color: var(--border);
  background: var(--surface-2);
}

.detail-skeleton {
  display: grid;
  gap: 12px;
}

.s-desc {
  display: grid;
  gap: 8px;
  opacity: 0.9;
}

.s-rows {
  display: grid;
  gap: 12px;
  margin-top: 6px;
}

.s-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}


</style>
