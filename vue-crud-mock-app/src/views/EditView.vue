<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import ProductForm from '../components/ProductForm.vue'

const router = useRouter()
const route = useRoute()

const product = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await api.getProduct(id)
    product.value = response.data
  } catch (err) {
    error.value = 'Product not found'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const handleUpdate = async (productData) => {
  try {
    saving.value = true
    await api.updateProduct(route.params.id, productData)
    router.push('/')
  } catch (err) {
    alert('Failed to update product.')
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="edit-view">
    <div class="page-header">
      <h1>Edit Product</h1>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>

    <ProductForm 
      v-else 
      :initial-data="product" 
      submit-label="Save Changes" 
      @submit="handleUpdate" 
    />

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

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
.error { color: var(--color-danger); }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>
