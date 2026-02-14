<template>
  <form class="toolbar" role="search" @submit.prevent>
    <div class="search">
      <label class="sr-only" for="campaign-search">Search campaigns</label>
      <input
          id="campaign-search"
          v-model="searchModel"
          class="input"
          type="search"
          placeholder="Search by name, description, audience…"
          autocomplete="off"
      />
    </div>

    <div class="filters">
      <label class="sr-only" for="status-filter">Filter by status</label>
      <select id="status-filter" v-model="statusModel" class="input">
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="completed">Completed</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  searchDraft: { type: String, default: '' },
  status: { type: String, default: '' },
})

const emit = defineEmits(['update:searchDraft', 'update:status'])

const searchModel = defineModel('searchDraft')
const statusModel = defineModel('status')
</script>

<style scoped>
.toolbar {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
  margin-bottom: 16px;
}

.search .input,
.filters .input {
  width: 100%;
}

@media (max-width: 720px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
