<template>
  <header class="app-header">
    <div class="container header-content">
      <router-link to="/" class="brand">
        Mock<span class="highlight">Store</span>
      </router-link>
      <nav>
        <router-link to="/" class="nav-link">Products</router-link>
        <router-link to="/create" class="nav-link btn btn-primary">Add Product</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 1rem 0;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-main);
  letter-spacing: -0.03em;
}

.highlight {
  color: var(--color-primary);
}

.nav-link {
  margin-left: 1rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.nav-link:not(.btn):hover {
  color: var(--color-primary);
}

.nav-link.router-link-active:not(.btn) {
  color: var(--color-primary);
}
</style>
