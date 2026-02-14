<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="app">
    <a class="skip-link" href="#main">Skip to content</a>

    <header class="topbar">
      <div class="container topbar-inner">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">📣</span>
          <span class="brand-name">Marketing Campaign Dashboard</span>
        </div>

        <nav class="nav" aria-label="Primary navigation">
          <router-link class="nav-link" to="/">Campaigns</router-link>
          <router-link class="nav-link" to="/campaigns/new">Create</router-link>
        </nav>
      </div>
    </header>

    <main id="main" class="main" tabindex="-1">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <span class="muted">Local API: http://localhost:3000</span>
      </div>
    </footer>
  </div>
</template>

<script setup></script>

<style scoped>
/* Theme tokens (light by default) */
.app {
  --app-text: #111827;
  --app-muted: rgba(17, 24, 39, 0.72);

  --bar-bg: rgba(255, 255, 255, 0.86);
  --bar-border: rgba(0, 0, 0, 0.08);

  --link-text: rgba(17, 24, 39, 0.92);
  --link-hover: rgba(17, 24, 39, 0.06);
  --link-active-bg: rgba(17, 24, 39, 0.08);
  --link-active-border: rgba(17, 24, 39, 0.14);

  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .app {
    --app-text: rgba(255, 255, 255, 0.94);
    --app-muted: rgba(255, 255, 255, 0.70);

    --bar-bg: rgba(10, 10, 14, 0.92);
    --bar-border: rgba(255, 255, 255, 0.08);

    --link-text: rgba(255, 255, 255, 0.92);
    --link-hover: rgba(255, 255, 255, 0.06);
    --link-active-bg: rgba(255, 255, 255, 0.08);
    --link-active-border: rgba(255, 255, 255, 0.14);
  }
}

/* Accessibility: skip link */
.skip-link {
  position: absolute;
  left: -999px;
  top: 10px;
  background: var(--bar-bg);
  color: var(--app-text);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--bar-border);
  backdrop-filter: blur(12px);
}
.skip-link:focus {
  left: 10px;
  z-index: 20;
}

/* Topbar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bar-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--bar-border);
  color: var(--app-text);
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.brand-name {
  font-weight: 800;
  letter-spacing: 0.2px;
  color: var(--app-text); /* IMPORTANT: visible in dark mode */
}

.nav {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--link-text);
  border: 1px solid transparent;
}

.nav-link:hover {
  background: var(--link-hover);
}

.nav-link.router-link-active {
  border-color: var(--link-active-border);
  background: var(--link-active-bg);
}

/* Main */
.main {
  outline: none;
}

/* Footer */
.footer {
  border-top: 1px solid var(--bar-border);
  padding: 14px 0;
  color: var(--app-text);
}

.footer-inner {
  display: flex;
  justify-content: center;
}

.muted {
  opacity: 0.75;
  font-size: 13px;
  color: var(--app-muted);
}
</style>
