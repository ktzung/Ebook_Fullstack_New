<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: '',
      price: '',
      category: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
    })
  },
  submitLabel: {
    type: String,
    default: 'Save Product'
  }
})

const emit = defineEmits(['submit'])

const formData = reactive({ ...props.initialData })
const errors = reactive({})

const validate = () => {
  errors.name = !formData.name ? 'Name is required' : ''
  errors.price = !formData.price || formData.price <= 0 ? 'Valid price is required' : ''
  errors.category = !formData.category ? 'Category is required' : ''
  
  return !Object.values(errors).some(e => e)
}

const handleSubmit = () => {
  if (validate()) {
    emit('submit', { ...formData })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <div class="form-group">
      <label for="name">Product Name</label>
      <input 
        id="name" 
        v-model="formData.name" 
        type="text" 
        placeholder="e.g. Wireless Headphones"
        :class="{ invalid: errors.name }"
      >
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="price">Price ($)</label>
        <input 
          id="price" 
          v-model.number="formData.price" 
          type="number" 
          step="0.01" 
          placeholder="0.00"
          :class="{ invalid: errors.price }"
        >
        <span v-if="errors.price" class="error-text">{{ errors.price }}</span>
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select 
          id="category" 
          v-model="formData.category"
          :class="{ invalid: errors.category }"
        >
          <option value="" disabled>Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Wearables">Wearables</option>
          <option value="Lighting">Lighting</option>
          <option value="Accessories">Accessories</option>
        </select>
        <span v-if="errors.category" class="error-text">{{ errors.category }}</span>
      </div>
    </div>

    <div class="form-group">
      <label for="image">Image URL</label>
      <input id="image" v-model="formData.image" type="url" placeholder="https://...">
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea 
        id="description" 
        v-model="formData.description" 
        rows="4" 
        placeholder="Product details..."
      ></textarea>
    </div>

    <div class="form-actions">
      <router-link to="/" class="btn btn-secondary">Cancel</router-link>
      <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
    </div>
  </form>
</template>

<style scoped>
.product-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.invalid {
  border-color: var(--color-danger);
}

.error-text {
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solidhsl(220, 15%, 90%);
}
</style>
