<template>
  <section class="table-wrap" aria-label="Campaign results">
    <div v-if="error" class="table-error">
      <slot name="error" />
    </div>

    <div v-else-if="loading">
      <slot name="loading" />
    </div>

    <div v-else-if="!items?.length" class="empty">
      <slot name="empty">
        <p>No campaigns found.</p>
      </slot>
    </div>

    <div v-else class="table-scroll" role="region" aria-label="Campaign table" tabindex="0">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
          <th scope="col">Budget</th>
          <th scope="col">Start</th>
          <th scope="col">End</th>
          <th scope="col" class="col-actions">Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="c in items" :key="c.id">
          <td>
            <button class="link" type="button" @click="$emit('open', c.id)">
              {{ c.name || '—' }}
            </button>
          </td>
          <td>
            <slot name="status" :campaign="c">
              {{ c.status || '—' }}
            </slot>
          </td>
          <td>{{ formatCurrency?.(c.budget) ?? c.budget ?? '—' }}</td>
          <td>{{ formatDate?.(c.startDate) ?? c.startDate ?? '—' }}</td>
          <td>{{ formatDate?.(c.endDate) ?? c.endDate ?? '—' }}</td>
          <td class="col-actions">
            <button class="btn btn-ghost" type="button" @click="$emit('edit', c.id)">
              Edit
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  formatDate: { type: Function, default: null },
  formatCurrency: { type: Function, default: null }
});

defineEmits(['open', 'edit']);
</script>

<style scoped>
.table-scroll { overflow: auto; }
.col-actions { width: 160px; text-align: right; }
.link { background: none; border: 0; padding: 0; text-decoration: underline; cursor: pointer; }
.empty { padding: 16px; }
</style>
