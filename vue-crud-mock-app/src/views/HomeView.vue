<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])
const loading = ref(true)
const error = ref(null)

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await api.getProducts()
    products.value = response.data
  } catch (err) {
    error.value = 'Failed to load products. Please try again later.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  
  try {
    await api.deleteProduct(id)
    products.value = products.value.filter(p => p.id !== id)
  } catch (err) {
    alert('Failed to delete product')
    console.error(err)
  }
}

onMounted(fetchProducts)
</script>

<template>
  <div class="home-view">
    <div class="page-header">
      <h1>Featured Products</h1>
      <p class="subtitle">Discover our premium collection of accessories.</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="fetchProducts" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="product-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        @delete="handleDelete" 
      />
    </div>
    
    <div v-if="!loading && products.length === 0" class="empty-state">
      <p>No products found.</p>
      <router-link to="/create" class="btn btn-primary">Add Your First Product</router-link>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading-state, .error-message, .empty-state {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: var(--color-danger);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
