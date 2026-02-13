<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Campaign Dashboard</h1>
        <nav>
          <router-link to="/">Campaigns</router-link>
        </nav>
      </div>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2024 Johnson Group - Frontend Developer Assessment</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// App component - Main layout wrapper
</script>

<style scoped>
.app-header {
  background: #1a1a1a;
  color: white;
  padding: 1rem 0;
  border-bottom: 2px solid #333;
}

.app-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.app-header nav a:hover,
.app-header nav a.router-link-active {
  background: #333;
}

.app-main {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

.app-footer {
  background: #f5f5f5;
  padding: 1rem 0;
  margin-top: auto;
  border-top: 1px solid #ddd;
}

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  color: #666;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
