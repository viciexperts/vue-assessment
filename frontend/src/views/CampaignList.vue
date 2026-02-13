<template>
  <div class="campaign-list">
    <div class="container">
      <div class="page-header">
        <h2>Campaigns</h2>
        <router-link to="/campaigns/new" class="btn btn-primary">
          + New Campaign
        </router-link>
      </div>
      
      <!-- TODO: Implement search and filters -->
      <!-- TODO: Implement campaign list display -->
      <!-- TODO: Implement pagination -->
      <!-- TODO: Add loading and error states -->
      
      <p class="placeholder-text">
        🚧 This is where you'll implement the campaign list view.<br>
        Check ASSESSMENT.md for detailed requirements.
      </p>
    </div>
  </div>
</template>

<script setup>
// TODO: Implement component logic
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover {
  background: #0052a3;
}

.placeholder-text {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
