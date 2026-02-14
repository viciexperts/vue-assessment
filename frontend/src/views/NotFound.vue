<template>
  <section class="not-found">
    <div class="container">
      <h2 class="title">Page not found</h2>
      <p class="subtitle">
        The page you’re looking for doesn’t exist or was moved.
      </p>

      <router-link to="/" class="primary-link">Go back to campaigns</router-link>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.not-found {
  padding: 28px 0 38px;
}
</style>
