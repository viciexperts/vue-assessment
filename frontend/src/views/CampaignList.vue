<template>
  <section class="campaign-list">
    <div class="container">
      <header class="page-header">
        <div>
          <h2 class="title">Campaigns</h2>
          <p class="subtitle">View performance and manage your marketing campaigns.</p>
        </div>

      </header>

      <div class="toolbar" role="search">
        <div class="search">
          <label class="sr-only" for="campaign-search">Search campaigns</label>
          <input
              id="campaign-search"
              v-model="searchDraft"
              class="input"
              type="search"
              placeholder="Search by name, description, audience…"
              autocomplete="off"
          />
        </div>

        <div class="filters">
          <label class="sr-only" for="status-filter">Filter by status</label>
          <select id="status-filter" v-model="status" class="input">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div v-if="showCreatedBanner" class="banner" role="status" aria-live="polite">
        Campaign created successfully.
      </div>

      <ErrorAlert
          v-if="errorMessage"
          title="Unable to load campaigns"
          :message="errorMessage"
          class="mb-3"
      >
        <template #actions>
          <button type="button" class="btn" @click="refresh">Retry</button>
        </template>
      </ErrorAlert>

      <div v-if="loading" class="skeleton-list" aria-label="Loading campaigns">
        <article v-for="i in 6" :key="i" class="card skeleton-card" aria-hidden="true">
          <div class="card-link">
            <div class="card-top">
              <SkeletonBlock height="18px" width="70%" />
              <SkeletonBlock height="22px" width="92px" />
            </div>

            <dl class="card-meta">
              <div class="card-meta-row">
                <SkeletonBlock height="12px" width="60px" />
                <SkeletonBlock height="14px" width="110px" />
              </div>

              <div class="card-meta-row">
                <SkeletonBlock height="12px" width="50px" />
                <SkeletonBlock height="14px" width="160px" />
              </div>
            </dl>
          </div>
        </article>
      </div>


      <div v-else>
        <div v-if="!filteredCampaigns.length" class="empty" role="status" aria-live="polite">
          <h3>No campaigns found</h3>
          <p v-if="search || status">Try clearing your search or filters.</p>
          <p v-else>Create your first campaign to get started.</p>

        </div>

        <div v-else class="table-wrap">
          <!-- Mobile cards -->
          <div class="cards" role="list" aria-label="Campaign cards">
            <article
                v-for="c in filteredCampaigns"
                :key="c.id"
                class="card"
                role="listitem"
            >
              <router-link
                  class="card-link"
                  :to="`/campaigns/${c.id}`"
                  :aria-label="`Open campaign ${c.name}`"
              >
                <!-- Top: Name + Status -->
                <div class="card-top">
                  <h3 class="card-title">{{ c.name }}</h3>
                  <StatusBadge :status="c.status" />
                </div>

                <!-- Budget + Dates -->
                <dl class="card-meta">
                  <div class="card-meta-row">
                    <dt>Budget</dt>
                    <dd>{{ formatCurrency(c.budget) }}</dd>
                  </div>

                  <div class="card-meta-row">
                    <dt>Dates</dt>
                    <dd class="card-meta-dates">
                      {{ formatDate(c.startDate) }}
                      <span aria-hidden="true"> → </span>
                      {{ formatDate(c.endDate) }}
                    </dd>
                  </div>
                </dl>
              </router-link>
            </article>
          </div>



          <!-- Desktop table -->
          <div class="table-scroll" role="region" aria-label="Campaign list" tabindex="0">
            <table class="table">
              <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col" class="right">Budget</th>
                <th scope="col">Dates</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="c in filteredCampaigns" :key="c.id">
                <td>
                  <router-link class="link" :to="`/campaigns/${c.id}`">
                    {{ c.name }}
                  </router-link>
                </td>

                <td>
                  <StatusBadge :status="c.status" />
                </td>

                <td class="right">
                  {{ formatCurrency(c.budget) }}
                </td>

                <td class="dates">
                  {{ formatDate(c.startDate) }} → {{ formatDate(c.endDate) }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  </section>
</template>

<script setup>
import { getErrorMessage } from '../utils/error';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCampaignsStore } from '../stores/campaigns';
import { debounce } from '../utils/debounce';
import { formatCurrency, formatDate } from '../utils/format';

import BaseSpinner from '../components/BaseSpinner.vue';
import ErrorAlert from '../components/ErrorAlert.vue';
import StatusBadge from '../components/StatusBadge.vue';
import PaginationControls from '../components/PaginationControls.vue';

const store = useCampaignsStore();
const route = useRoute();
const router = useRouter();

const searchDraft = ref('');
const search = ref('');
const status = ref('');

const showCreatedBanner = computed(() => route.query.created === '1');

const loading = computed(() => store.listLoading);
const error = computed(() => store.listError);
const pagination = computed(() => store.pagination);

const errorMessage = computed(() =>
    error.value ? getErrorMessage(error.value) : ''
);


const refresh = () => store.loadList({ page: pagination.value.page, limit: pagination.value.limit });

const setPage = async (newPage) => {
  const limit = pagination.value.limit || 10;
  await store.loadList({ page: newPage, limit });
};

const applySearch = debounce(() => {
  search.value = searchDraft.value.trim();
}, 250);

watch(searchDraft, () => applySearch());

watch(
    () => route.query.created,
    () => {
      if (route.query.created === '1') {
        window.setTimeout(() => {
          router.replace({ query: { ...route.query, created: undefined } });
        }, 1800);
      }
    },
    { immediate: true }
);

const filteredCampaigns = computed(() => {
  const term = search.value.toLowerCase().trim();
  const filterStatus = status.value.toLowerCase().trim();

  return (store.list || []).filter((c) => {
    const matchesStatus = !filterStatus || String(c.status).toLowerCase() === filterStatus;

    if (!term) return matchesStatus;

    const haystack = `
      ${c.name ?? ''}
      ${c.description ?? ''}
      ${c.targetAudience ?? ''}
      ${c.status ?? ''}
    `.toLowerCase();

    const matchesTerm = haystack.includes(term);

    return matchesStatus && matchesTerm;
  });
});

onMounted(async () => {
  await store.loadList({ page: 1, limit: 10 });
});
</script>

<style scoped>
/* Let browser choose proper form colors in the active theme */
:host,
.campaign-list {
  color-scheme: light dark;
}

/* Theme-friendly tokens (no hardcoded white on white) */
.campaign-list {
  --bg: Canvas;
  --text: CanvasText;
  --muted: color-mix(in srgb, CanvasText 65%, transparent);
  --border: color-mix(in srgb, CanvasText 14%, transparent);
  --border-strong: color-mix(in srgb, CanvasText 20%, transparent);

  --row: color-mix(in srgb, Canvas 96%, CanvasText 4%);
  --row-alt: color-mix(in srgb, Canvas 92%, CanvasText 8%);
  --row-hover: color-mix(in srgb, Canvas 88%, CanvasText 12%);

  --surface: color-mix(in srgb, Canvas 94%, CanvasText 6%);
  --surface-2: color-mix(in srgb, Canvas 90%, CanvasText 10%);

  --focus: Highlight;
  --focus-ring: color-mix(in srgb, Highlight 22%, transparent);
}

.campaign-list {
  padding: 24px 0 36px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.title {
  margin: 0;
  font-size: 22px;
  color: var(--text);
}

.subtitle {
  margin: 6px 0 0;
  color: var(--muted);
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 16px;
}

.search {
  flex: 1 1 260px;
}

.filters {
  width: 200px;
}

.banner {
  border: 1px solid color-mix(in srgb, Highlight 30%, transparent);
  background: color-mix(in srgb, Highlight 12%, transparent);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
  color: var(--text);
}

/* Input - readable in both themes */
.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  outline: none;
}

.input::placeholder {
  color: var(--muted);
}

.input:focus {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.loading-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 0;
}
.loading-text {
  color: var(--muted);
}

.empty {
  border: 1px dashed var(--border);
  border-radius: 16px;
  padding: 18px;
  color: var(--text);
}

/* Zebra + grid look */
.table-wrap {
  margin-top: 12px;
}

.table-scroll {
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
}

/* keyboard focus on scroll region */
.table-scroll:focus {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
}

.table {
  width: 100%;
  min-width: 980px; /* enables horizontal scroll on small screens */
  border-collapse: separate;
  border-spacing: 0;
}

.table thead th {
  text-align: left;
  font-size: 12px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--surface-2);
  padding: 12px 12px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 1;
}

.table tbody td {
  padding: 12px 12px;
  vertical-align: top;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border); /* grid column lines */
}

/* remove last vertical border */
.table tbody td:last-child {
  border-right: none;
}

.table tbody tr:nth-child(odd) {
  background: var(--row);
}

.table tbody tr:nth-child(even) {
  background: var(--row-alt);
}

.table tbody tr:hover {
  background: var(--row-hover);
}

.right {
  text-align: right;
}

.actions {
  display: inline-flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.dates {
  white-space: nowrap;
  color: var(--text);
}

.muted-sm {
  font-size: 13px;
  color: var(--muted);
  margin-top: 3px;
}

.link {
  color: var(--text);
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}

.primary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}
.primary-link:hover {
  background: var(--surface-2);
}

/* Buttons consistent with theme */
.btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: 600;
  font-size: 14px;
}
.btn:hover {
  background: var(--surface-2);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn-ghost {
  background: transparent;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(50%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}
/* ===== Strong text for key data columns (better contrast in dark mode) ===== */

.table tbody td:nth-child(3), /* Budget */
.table tbody td:nth-child(4), /* Spent */
.table tbody td:nth-child(6)  /* Audience */
{
  color: var(--text);
  font-weight: 600;
}

/* Status column text stronger */
.table tbody td:nth-child(2) {
  color: var(--text);
}

/* Make sure StatusBadge text is readable */
:deep(.badge) {
  color: var(--text);
  border-color: var(--border);
  background: var(--surface);
}

/* Optional: stronger zebra contrast in dark mode */
@media (prefers-color-scheme: dark) {
  .campaign-list {
    --row: color-mix(in srgb, Canvas 92%, white 8%);
    --row-alt: color-mix(in srgb, Canvas 86%, white 14%);
    --row-hover: color-mix(in srgb, Canvas 80%, white 20%);
  }
}
/* =====================================================
   Mobile cards layout (show on small screens)
===================================================== */

.cards {
  display: none; /* default: hidden (desktop uses table) */
  margin-top: 12px;
  gap: 12px;
}

.card {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
}

.card-link {
  display: block;
  padding: 14px;
  color: inherit;
  text-decoration: none;
}

.card-link:focus,
.card-link:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  border-radius: 14px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-size: 16px;
  line-height: 1.25;
  font-weight: 800;
  margin: 0;
}

.card-desc {
  margin-top: 8px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}

.card-meta {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.card-meta-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.card-meta-row:first-child {
  border-top: none;
  padding-top: 0;
}

.card-meta dt {
  font-size: 12px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--muted);
}

.card-meta dd {
  margin: 0;
  font-weight: 700;
  color: var(--text);
}

.card-meta-dates {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  text-align: right;
}

/* Switch: cards on mobile, table on desktop */
@media (max-width: 720px) {
  .cards {
    display: grid;
  }

  .table-scroll {
    display: none;
  }
}

@media (max-width: 720px) {
  .container {
    padding: 0 14px;
  }

  .page-header .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }
}

.skeleton-list {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.skeleton-card {
  pointer-events: none;
  opacity: 0.95;
}

</style>