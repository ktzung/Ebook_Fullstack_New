<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])
</script>

<template>
  <div class="card product-card">
    <div class="card-image">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <div class="category-tag">{{ product.category }}</div>
    </div>
    <div class="card-body">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-price">\${{ product.price }}</p>
      <p class="product-desc">{{ product.description }}</p>
      
      <div class="card-actions">
        <router-link :to="`/edit/${product.id}`" class="btn btn-secondary btn-sm">Edit</router-link>
        <button @click="$emit('delete', product.id)" class="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-image img {
  transform: scale(1.05);
}

.category-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(4px);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.product-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  flex: 1;
}
</style>
