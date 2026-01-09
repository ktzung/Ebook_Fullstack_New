<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import ProductForm from '../components/ProductForm.vue'

const router = useRouter()
const saving = ref(false)

const handleCreate = async (productData) => {
  try {
    saving.value = true
    await api.createProduct(productData)
    router.push('/')
  } catch (err) {
    alert('Failed to create product.')
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="create-view">
    <div class="page-header">
      <h1>Add New Product</h1>
      <p class="subtitle">Fill in the details to add a new item to the store.</p>
    </div>

    <ProductForm @submit="handleCreate" submit-label="Create Product" />
    
    <div v-if="saving" class="overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitle {
  color: var(--color-text-muted);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
