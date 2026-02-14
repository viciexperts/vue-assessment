<template>
  <section class="campaign-form">
    <div class="container">
      <header class="page-header">
        <button type="button" class="btn btn-ghost" @click="goBack">← Back</button>
        <h2 class="title">{{ isEdit ? 'Edit Campaign' : 'Create Campaign' }}</h2>
      </header>

      <ErrorAlert
          v-if="loadErrorMessage"
          title="Unable to load campaign"
          :message="loadErrorMessage"
          class="mb-3"
      >
        <template #actions>
          <button type="button" class="btn" @click="loadForEdit">Retry</button>
          <router-link class="btn btn-ghost" to="/">Go to list</router-link>
        </template>
      </ErrorAlert>

      <form class="form" @submit.prevent="submit" novalidate>
        <div class="grid">
          <FormField id="name" label="Name" :required="true" :error="errors.name">
            <input
                id="name"
                ref="nameRef"
                v-model="form.name"
                class="input"
                type="text"
                autocomplete="off"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : undefined"
                required
            />
          </FormField>

          <FormField id="status" label="Status" :required="true" :error="errors.status">
            <select
                id="status"
                v-model="form.status"
                class="input"
                :aria-invalid="!!errors.status"
                :aria-describedby="errors.status ? 'status-error' : undefined"
                required
            >
              <option value="" disabled>Select status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </FormField>

          <FormField
              id="budget"
              label="Budget"
              :required="true"
              hint="Enter a whole number (USD)."
              :error="errors.budget"
          >
            <input
                id="budget"
                v-model.number="form.budget"
                class="input"
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                :aria-invalid="!!errors.budget"
                :aria-describedby="errors.budget ? 'budget-error' : 'budget-hint'"
                required
            />
          </FormField>

          <FormField id="startDate" label="Start date" :required="true" :error="errors.startDate">
            <input
                id="startDate"
                v-model="form.startDate"
                class="input"
                type="date"
                :aria-invalid="!!errors.startDate"
                :aria-describedby="errors.startDate ? 'startDate-error' : undefined"
                required
            />
          </FormField>

          <FormField id="endDate" label="End date" :required="true" :error="errors.endDate">
            <input
                id="endDate"
                v-model="form.endDate"
                class="input"
                type="date"
                :aria-invalid="!!errors.endDate"
                :aria-describedby="errors.endDate ? 'endDate-error' : undefined"
                required
            />
          </FormField>

          <FormField id="targetAudience" label="Target audience" :error="errors.targetAudience">
            <input
                id="targetAudience"
                v-model="form.targetAudience"
                class="input"
                type="text"
                placeholder="e.g., 25-55, US, Canada"
                autocomplete="off"
                :aria-invalid="!!errors.targetAudience"
                :aria-describedby="errors.targetAudience ? 'targetAudience-error' : undefined"
            />
          </FormField>

          <FormField id="description" label="Description" :error="errors.description">
            <textarea
                id="description"
                v-model="form.description"
                class="input textarea"
                rows="4"
                placeholder="Describe the campaign..."
                :aria-invalid="!!errors.description"
                :aria-describedby="errors.description ? 'description-error' : undefined"
            ></textarea>
          </FormField>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn" :disabled="submitting">
            {{ submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save changes' : 'Create campaign') }}
          </button>

          <router-link class="btn btn-ghost" to="/">Cancel</router-link>
        </div>

        <p v-if="submitError" class="submit-error" role="alert" aria-live="assertive">
          {{ submitError }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ErrorAlert from '../components/ErrorAlert.vue';
import FormField from '../components/FormField.vue';

import { createCampaign, updateCampaign } from '../services/campaignService';
import { useCampaignsStore } from '../stores/campaigns';

const route = useRoute();
const router = useRouter();
const store = useCampaignsStore();

const isEdit = computed(() => Boolean(route.params.id));

const nameRef = ref(null);

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
  endDate: '',
  description: '',
  targetAudience: ''
});

const submitting = ref(false);
const submitError = ref('');

const loadErrorMessage = ref('');

const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push('/');
};

const clearErrors = () => {
  Object.keys(errors).forEach((k) => (errors[k] = ''));
};

const validate = () => {
  clearErrors();
  let ok = true;

  if (!form.name.trim()) {
    errors.name = 'Name is required.';
    ok = false;
  }

  if (!form.status) {
    errors.status = 'Status is required.';
    ok = false;
  }

  const budget = Number(form.budget);
  if (!Number.isFinite(budget) || budget < 0) {
    errors.budget = 'Budget must be a valid number (0 or higher).';
    ok = false;
  }

  if (!form.startDate) {
    errors.startDate = 'Start date is required.';
    ok = false;
  }

  if (!form.endDate) {
    errors.endDate = 'End date is required.';
    ok = false;
  }

  if (form.startDate && form.endDate) {
    const s = new Date(form.startDate);
    const e = new Date(form.endDate);
    if (s > e) {
      errors.endDate = 'End date must be the same as or after the start date.';
      ok = false;
    }
  }

  return ok;
};

const focusFirstInvalid = async () => {
  await nextTick();

  const order = ['name', 'status', 'budget', 'startDate', 'endDate', 'targetAudience', 'description'];
  const first = order.find((k) => errors[k]);

  if (!first) return;

  const el = document.getElementById(first);
  if (el && typeof el.focus === 'function') el.focus();
};

const submit = async () => {
  submitError.value = '';

  if (!validate()) {
    await focusFirstInvalid();
    return;
  }

  submitting.value = true;

  try {
    const payload = {
      name: form.name.trim(),
      status: form.status,
      budget: Number(form.budget),
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description?.trim() || '',
      targetAudience: form.targetAudience?.trim() || ''
    };

    if (isEdit.value) {
      const id = route.params.id;
      const result = await updateCampaign(id, payload);
      if (result?.data) store.primeCache(result.data);
      router.push(`/campaigns/${id}`);
      return;
    }

    await createCampaign(payload);
    router.push({ path: '/', query: { created: '1' } });
  } catch (err) {
    submitError.value =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to submit the campaign. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const loadForEdit = async () => {
  loadErrorMessage.value = '';
  if (!isEdit.value) return;

  try {
    const campaign = await store.loadById(route.params.id);

    if (!campaign) {
      router.replace('/not-found');
      return;
    }

    form.name = campaign.name ?? '';
    form.status = campaign.status ?? 'draft';
    form.budget = campaign.budget ?? 0;
    form.startDate = campaign.startDate ?? '';
    form.endDate = campaign.endDate ?? '';
    form.description = campaign.description ?? '';
    form.targetAudience = campaign.targetAudience ?? '';
  } catch (err) {
    if (err?.response?.status === 404) {
      router.replace('/not-found');
      return;
    }

    loadErrorMessage.value =
        err?.response?.data?.message || err?.message || 'Unable to load campaign data.';
  }
};

onMounted(async () => {
  if (!isEdit.value) {
    await nextTick();
    if (nameRef.value) nameRef.value.focus();
    return;
  }

  await loadForEdit();
});
</script>

<style scoped>
.campaign-form {
  padding: 24px 0 36px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.title {
  margin: 0;
  font-size: 22px;
}

.form {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
}

.grid {
  display: grid;
  gap: 14px;
}

.textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 14px;
  flex-wrap: wrap;
}

.submit-error {
  margin-top: 10px;
  color: rgba(255, 140, 140, 0.95);
}
/*
.btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
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
  background: rgba(255, 255, 255, 0.09);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn-ghost {
  background: transparent;
}*/

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.92);
  outline: none;
}
.input:focus {
  border-color: rgba(255, 255, 255, 0.22);
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }

  :deep(#description) {
    min-height: 120px;
  }

  .grid :deep(.field:last-child) {
    grid-column: 1 / -1;
  }
}
</style>
