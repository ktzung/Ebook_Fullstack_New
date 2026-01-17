<script setup>
  import { ref, computed } from 'vue'

  const search = ref('')

  const headers = [
    { title: 'Tên sản phẩm', key: 'name' },
    { title: 'Giá', key: 'price' },
    { title: 'Danh mục', key: 'category' },
    { title: 'Hành động', key: 'actions', sortable: false },
  ]

  const products = ref([
    { id: 1, name: 'iPhone 15', price: 20000000, category: 'Điện thoại' },
    { id: 2, name: 'Samsung S24', price: 18000000, category: 'Điện thoại' },
    { id: 3, name: 'Macbook Air', price: 25000000, category: 'Laptop' },
  ])

  const filteredProducts = computed(() =>
    products.value.filter((p) =>
      p.name.toLowerCase().includes(search.value.toLowerCase())
    )
  )
</script>

<template>
<v-container>
    <div class="d-flex align-center justify-space-between mb-4">
      <v-text-field
        v-model="search"
        label="Tìm kiếm sản phẩm"
        variant="outlined"
        density="compact"
        style="max-width: 300px;"
      />
      <v-btn color="primary" prepend-icon="mdi-plus">Thêm mới</v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredProducts"
      item-value="id"
    >
      <template v-slot:item.price="{ item }">
        {{ item.price.toLocaleString() }} đ
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" color="primary" />
        <v-btn icon="mdi-delete" variant="text" color="error" />
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped></style>
