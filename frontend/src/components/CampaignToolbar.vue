<template>
  <form class="toolbar" role="search" @submit.prevent>
    <div class="toolbar-row">
      <div class="field">
        <label class="sr-only" for="q">Search campaigns</label>
        <input
            id="q"
            class="input"
            type="search"
            autocomplete="off"
            :value="search"
            @input="$emit('update:search', $event.target.value)"
            placeholder="Search…"
        />
      </div>

      <div class="field">
        <label class="sr-only" for="status">Status</label>
        <select
            id="status"
            class="input"
            :value="status"
            @change="$emit('update:status', $event.target.value)"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="toolbar-actions">
        <button type="button" class="btn btn-ghost" @click="$emit('clear')">
          Clear
        </button>

        <button type="button" class="btn btn-primary" @click="$emit('create')">
          Create
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
defineProps({
  search: { type: String, default: '' },
  status: { type: String, default: '' }
});

defineEmits(['update:search', 'update:status', 'clear', 'create']);
</script>

<style scoped>
.toolbar-row {
  display: flex;
  gap: 12px;
  align-items: end;
  justify-content: space-between;
  flex-wrap: wrap;
}

.field {
  min-width: 220px;
  flex: 1;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}
</style>
