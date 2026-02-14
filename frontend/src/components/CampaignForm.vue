<template>
  <section class="cf-page">
    <div class="container cf-container">
      <header class="cf-head">
        <div>
          <h1 class="cf-title">{{ isEdit ? 'Edit Campaign' : 'Create Campaign' }}</h1>
          <p class="cf-subtitle">
            {{ isEdit ? 'Update your campaign details.' : 'Create a new marketing campaign.' }}
          </p>
        </div>
      </header>

      <div v-if="loading" class="cf-state" role="status" aria-live="polite">
        <span class="cf-spinner" aria-hidden="true"></span>
        <span>Loading…</span>
      </div>

      <div v-else-if="notFound" class="cf-state" role="status" aria-live="polite">
        <strong>Campaign not found.</strong>
        <button class="cf-btn" type="button" @click="goBack">Go back</button>
      </div>

      <section v-else class="cf-card" aria-label="Campaign form">
        <form class="cf-form" @submit.prevent="submit">
          <div class="cf-grid">
            <!-- Name -->
            <div class="cf-field cf-span-2">
              <label class="cf-label" for="name">Name <span class="cf-req">*</span></label>
              <input
                  id="name"
                  v-model.trim="form.name"
                  class="cf-input"
                  type="text"
                  placeholder="e.g., Summer Sale 2024"
                  autocomplete="off"
                  :aria-invalid="Boolean(errors.name)"
                  :aria-describedby="errors.name ? 'err-name' : undefined"
                  required
              />
              <p v-if="errors.name" id="err-name" class="cf-error" role="alert">{{ errors.name }}</p>
            </div>

            <!-- Status -->
            <div class="cf-field">
              <label class="cf-label" for="status">Status <span class="cf-req">*</span></label>
              <div class="cf-select">
                <select
                    id="status"
                    v-model="form.status"
                    class="cf-input"
                    :aria-invalid="Boolean(errors.status)"
                    :aria-describedby="errors.status ? 'err-status' : undefined"
                    required
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <p v-if="errors.status" id="err-status" class="cf-error" role="alert">{{ errors.status }}</p>
            </div>

            <!-- Budget -->
            <div class="cf-field">
              <label class="cf-label" for="budget">Budget <span class="cf-req">*</span></label>
              <input
                  id="budget"
                  v-model.number="form.budget"
                  class="cf-input"
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  placeholder="50000"
                  :aria-invalid="Boolean(errors.budget)"
                  :aria-describedby="errors.budget ? 'err-budget' : 'help-budget'"
                  required
              />
              <p id="help-budget" class="cf-help">Enter a whole number (USD).</p>
              <p v-if="errors.budget" id="err-budget" class="cf-error" role="alert">{{ errors.budget }}</p>
            </div>

            <!-- Start date -->
            <div class="cf-field">
              <label class="cf-label" for="startDate">Start date <span class="cf-req">*</span></label>
              <input
                  id="startDate"
                  v-model="form.startDate"
                  class="cf-input"
                  type="date"
                  :aria-invalid="Boolean(errors.startDate)"
                  :aria-describedby="errors.startDate ? 'err-start' : undefined"
                  required
              />
              <p v-if="errors.startDate" id="err-start" class="cf-error" role="alert">{{ errors.startDate }}</p>
            </div>

            <!-- End date -->
            <div class="cf-field">
              <label class="cf-label" for="endDate">End date <span class="cf-req">*</span></label>
              <input
                  id="endDate"
                  v-model="form.endDate"
                  class="cf-input"
                  type="date"
                  :aria-invalid="Boolean(errors.endDate)"
                  :aria-describedby="errors.endDate ? 'err-end' : undefined"
                  required
              />
              <p v-if="errors.endDate" id="err-end" class="cf-error" role="alert">{{ errors.endDate }}</p>
            </div>

            <!-- Target audience -->
            <div class="cf-field cf-span-2">
              <label class="cf-label" for="targetAudience">Target audience</label>
              <input
                  id="targetAudience"
                  v-model.trim="form.targetAudience"
                  class="cf-input"
                  type="text"
                  placeholder="e.g., 25-55, US, Canada"
                  autocomplete="off"
              />
            </div>

            <!-- Description -->
            <div class="cf-field cf-span-2">
              <label class="cf-label" for="description">Description</label>
              <textarea
                  id="description"
                  v-model.trim="form.description"
                  class="cf-input cf-textarea"
                  rows="5"
                  placeholder="Describe the campaign…"
              />
            </div>
          </div>

          <div class="cf-actions">
            <button type="button" class="cf-btn cf-btn-ghost" @click="goBack" :disabled="saving">
              Cancel
            </button>
            <button type="submit" class="cf-btn cf-btn-primary" :disabled="saving">
              {{ saving ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save changes' : 'Create campaign') }}
            </button>
          </div>

          <p v-if="formError" class="cf-form-error" role="alert">{{ formError }}</p>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => Boolean(route.params.id));

const loading = ref(false);
const saving = ref(false);
const notFound = ref(false);
const formError = ref('');

const form = reactive({
  name: '',
  status: 'draft',
  budget: 0,
  startDate: '',
  endDate: '',
  description: '',
  targetAudience: ''
});

const errors = reactive({
  name: '',
  status: '',
  budget: '',
  startDate: '',
  endDate: ''
});

function clearErrors() {
  errors.name = '';
  errors.status = '';
  errors.budget = '';
  errors.startDate = '';
  errors.endDate = '';
  formError.value = '';
}

function validate() {
  clearErrors();

  if (!form.name?.trim()) errors.name = 'Name is required.';
  if (!form.status) errors.status = 'Status is required.';

  const b = Number(form.budget);
  if (!Number.isFinite(b)) errors.budget = 'Budget is required.';
  else if (b < 0) errors.budget = 'Budget must be 0 or greater.';

  if (!form.startDate) errors.startDate = 'Start date is required.';
  if (!form.endDate) errors.endDate = 'End date is required.';

  if (form.startDate && form.endDate) {
    const s = new Date(form.startDate);
    const e = new Date(form.endDate);
    if (Number.isFinite(s.getTime()) && Number.isFinite(e.getTime()) && e < s) {
      errors.endDate = 'End date must be after start date.';
    }
  }

  return !errors.name && !errors.status && !errors.budget && !errors.startDate && !errors.endDate;
}

async function loadEdit() {
  if (!isEdit.value) return;

  loading.value = true;
  notFound.value = false;

  try {
    const res = await api.get(`/campaigns/${route.params.id}`);
    const c = res?.data;
    if (!c) {
      notFound.value = true;
      return;
    }

    form.name = c.name ?? '';
    form.status = c.status ?? 'draft';
    form.budget = Number(c.budget ?? 0);
    form.startDate = c.startDate ?? '';
    form.endDate = c.endDate ?? '';
    form.description = c.description ?? '';
    form.targetAudience = c.targetAudience ?? '';
  } catch (e) {
    notFound.value = true;
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!validate()) return;

  saving.value = true;
  formError.value = '';

  const payload = {
    name: form.name.trim(),
    status: form.status,
    budget: Number(form.budget),
    startDate: form.startDate,
    endDate: form.endDate,
    description: form.description?.trim() || '',
    targetAudience: form.targetAudience?.trim() || ''
  };

  try {
    if (isEdit.value) {
      await api.put(`/campaigns/${route.params.id}`, payload);
      router.push(`/campaigns/${route.params.id}`);
    } else {
      await api.post('/campaigns', payload);
      router.push('/');
    }
  } catch (e) {
    formError.value = e?.error?.message || e?.message || 'Unexpected error. Please try again.';
  } finally {
    saving.value = false;
  }
}

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

onMounted(loadEdit);
</script>

<style scoped>
.cf-page {
  padding: 22px 0 36px;
}

/* Constrain form width to avoid huge whitespace */
.cf-container {
  max-width: 980px;
}

/* ===============================
   Theme tokens (LIGHT default)
   =============================== */
.cf-page {
  --text: var(--app-text, #111827);
  --muted: var(--app-muted, rgba(17, 24, 39, 0.72));

  /* Card + inputs: stronger contrast for light mode */
  --card: #ffffff;
  --field: #ffffff;
  --border: rgba(17, 24, 39, 0.22);

  --shadow: rgba(17, 24, 39, 0.10);

  --danger: #ef4444;
}

/* ===============================
   Dark mode (system preference)
   =============================== */
@media (prefers-color-scheme: dark) {
  .cf-page {
    --card: rgba(48, 48, 48, 0.94);
    --field: rgba(17, 24, 39, 0.70);
    --border: rgba(255, 255, 255, 0.14);
    --shadow: rgba(0, 0, 0, 0.35);
  }
}

/* Header */
.cf-head {
  margin-bottom: 14px;
}

.cf-title {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  color: var(--text);
}

.cf-subtitle {
  margin: 8px 0 0;
  color: var(--muted);
}

/* Card */
.cf-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 12px 30px var(--shadow);
}

/* Form grid */
.cf-form {
  display: grid;
  gap: 14px;
}

.cf-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .cf-grid {
    grid-template-columns: 1fr 1fr;
  }
  .cf-span-2 {
    grid-column: 1 / -1;
  }
}

.cf-field {
  display: grid;
  gap: 8px;
}

/* Labels */
.cf-label {
  font-weight: 800;
  color: var(--text);
  font-size: 14px;
}

.cf-req {
  opacity: 0.7;
}

/* Inputs */
.cf-input {
  appearance: none;
  -webkit-appearance: none;

  width: 100%;
  min-height: 44px;
  line-height: 1.2;

  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--field);
  color: var(--text);

  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}

/* Select wrapper + caret */
.cf-select {
  position: relative;
}
.cf-select::after {
  content: "▾";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: color-mix(in srgb, var(--text) 55%, transparent);
  font-size: 12px;
}
select.cf-input {
  padding-right: 34px; /* leave space for caret */
}

/* Date inputs */
.cf-input[type="date"] {
  min-height: 44px;
  padding-right: 12px;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  .cf-input[type="date"] {
    color-scheme: dark;
  }
}

/* Textarea */
.cf-textarea {
  min-height: 130px;
  resize: vertical;
}

/* Placeholders */
.cf-input::placeholder {
  color: color-mix(in srgb, var(--text) 45%, transparent);
}

/* Focus */
.cf-input:focus {
  border-color: color-mix(in srgb, Highlight 55%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in srgb, Highlight 18%, transparent);
}

/* Help + errors */
.cf-help {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.cf-error {
  margin: 0;
  font-size: 12px;
  color: var(--danger);
}

/* Actions */
.cf-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cf-btn {
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--field) 92%, transparent);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  min-height: 42px;
}

.cf-btn:hover {
  background: color-mix(in srgb, var(--field) 78%, transparent);
}

.cf-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cf-btn-ghost {
  background: transparent;
}

.cf-btn-primary {
  background: color-mix(in srgb, Highlight 18%, var(--field));
  border-color: color-mix(in srgb, Highlight 30%, var(--border));
}

/* States */
.cf-state {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  color: var(--muted);
}

.cf-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: color-mix(in srgb, Highlight 60%, transparent);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cf-form-error {
  margin: 0;
  color: var(--danger);
  font-weight: 800;
}
</style>
