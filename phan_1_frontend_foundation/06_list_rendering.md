# 🟦 BÀI 6: LIST RENDERING VỚI v-for

## 🎯 Mục tiêu
- Hiểu tại sao cần v-for
- Sử dụng v-for với array
- Sử dụng v-for với object
- Hiểu về :key và tại sao cần
- Thực hành render danh sách sản phẩm

---

## 🧠 1. List Rendering là gì?

### 🎬 Ví dụ dẫn nhập: Danh sách sản phẩm trên Shopee

Hãy tưởng tượng bạn đang xây dựng trang **danh sách sản phẩm** cho website bán hàng:

**Tình huống thực tế:**
- Trang chủ Shopee có hàng trăm sản phẩm
- Mỗi sản phẩm có: ảnh, tên, giá, đánh giá, số lượt mua
- Khi user scroll, load thêm sản phẩm
- Khi user search, danh sách thay đổi

**Với JavaScript thuần:**
```html
<div id="products"></div>

<script>
  const products = [
    { id: 1, name: 'iPhone 15', price: 20000000, image: 'iphone.jpg' },
    { id: 2, name: 'Samsung S24', price: 18000000, image: 'samsung.jpg' },
    { id: 3, name: 'MacBook Pro', price: 45000000, image: 'macbook.jpg' }
  ]
  
  function renderProducts() {
    let html = ''
    products.forEach(product => {
      html += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price.toLocaleString('vi-VN')} đ</p>
        </div>
      `
    })
    document.getElementById('products').innerHTML = html
  }
  
  function addProduct(newProduct) {
    products.push(newProduct)
    renderProducts()  // ❌ Phải tự render lại toàn bộ
  }
  
  function filterProducts(keyword) {
    const filtered = products.filter(p => p.name.includes(keyword))
    // ❌ Phải render lại với logic phức tạp
    renderProducts()
  }
  
  renderProducts()
</script>
```

**Vấn đề:**
- Phải tự tạo HTML cho mỗi sản phẩm
- Phải tự update DOM mỗi khi thay đổi
- Code dài dòng, khó maintain
- Dễ lỗi khi render

**Với Vue v-for:**
```vue
<template>
  <div class="products">
    <div v-for="product in products" :key="product.id" class="product-card">
      <img :src="product.image" :alt="product.name">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price.toLocaleString('vi-VN') }} đ</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { id: 1, name: 'iPhone 15', price: 20000000, image: 'iphone.jpg' },
  { id: 2, name: 'Samsung S24', price: 18000000, image: 'samsung.jpg' },
  { id: 3, name: 'MacBook Pro', price: 45000000, image: 'macbook.jpg' }
])

function addProduct(newProduct) {
  products.value.push(newProduct)  // ✅ Chỉ cần thay đổi data
  // ✅ Vue TỰ ĐỘNG render sản phẩm mới!
}

function filterProducts(keyword) {
  // ✅ Dùng computed, tự động update
  filteredProducts.value = products.value.filter(p => 
    p.name.includes(keyword)
  )
}
</script>
```

**Ưu điểm:**
- Code ngắn gọn, dễ đọc
- Tự động update khi data thay đổi
- Dễ maintain và mở rộng

### Vấn đề với JavaScript thuần

**Ví dụ JavaScript thuần:**
```html
<ul id="list"></ul>

<script>
  const items = ['A', 'B', 'C']
  
  function render() {
    const html = items.map(item => `<li>${item}</li>`).join('')
    document.getElementById('list').innerHTML = html
  }
  
  function addItem() {
    items.push('D')
    render()  // ❌ Phải tự render lại
  }
  
  render()
</script>
```

**Vấn đề:**
- Phải tự tạo HTML
- Phải tự update DOM
- Code dài dòng, khó maintain

### 🌐 Liên hệ thực tế

**v-for được dùng ở mọi nơi:**
- **Facebook**: Danh sách bài viết, danh sách bạn bè, danh sách comment
- **YouTube**: Danh sách video đề xuất, danh sách playlist
- **Shopee**: Danh sách sản phẩm, danh sách đơn hàng, danh sách đánh giá
- **Gmail**: Danh sách email, danh sách thư mục
- **Instagram**: Danh sách ảnh, danh sách story, danh sách người follow

**Tất cả đều dùng v-for để render danh sách!**

### Giải pháp: v-for

Vue cung cấp `v-for` để render danh sách tự động:

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </ul>
  <button @click="addItem">Thêm</button>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])

function addItem() {
  items.value.push('D')  // ✅ Chỉ cần thay đổi data
  // ✅ Vue tự động update DOM!
}
</script>
```

**Ưu điểm:**
- Code ngắn gọn
- Tự động update khi data thay đổi
- Dễ đọc, dễ maintain

---

## 📝 2. v-for với Array

### Cú pháp cơ bản

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['Apple', 'Banana', 'Orange'])
</script>
```

**Kết quả:**
- Apple
- Banana
- Orange

### Lấy index

```vue
<template>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ index + 1 }}. {{ item }}
    </li>
  </ul>
</template>
```

**Kết quả:**
- 1. Apple
- 2. Banana
- 3. Orange

### Ví dụ: Danh sách sản phẩm

```vue
<template>
  <div>
    <h2>Danh sách sản phẩm</h2>
    <div v-for="product in products" :key="product.id" class="product">
      <h3>{{ product.name }}</h3>
      <p>Giá: {{ product.price.toLocaleString('vi-VN') }} đ</p>
      <p>Mô tả: {{ product.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { id: 1, name: 'iPhone 15', price: 20000000, description: 'Điện thoại mới' },
  { id: 2, name: 'Samsung S24', price: 18000000, description: 'Flagship Samsung' },
  { id: 3, name: 'MacBook Pro', price: 45000000, description: 'Laptop cao cấp' }
])
</script>
```

---

## 🔑 3. :key - Tại sao cần?

### Vấn đề không có key

Khi không có `:key`, Vue có thể:
- Render sai thứ tự
- Không update đúng element
- Performance kém khi thêm/xóa

### Giải pháp: Dùng :key

**`:key` phải:**
- ✅ Unique (duy nhất) trong danh sách
- ✅ Stable (không thay đổi)
- ✅ Tốt nhất: dùng ID từ database

```vue
<template>
  <!-- ✅ Tốt - Dùng ID -->
  <div v-for="product in products" :key="product.id">
    {{ product.name }}
  </div>
  
  <!-- ✅ OK - Dùng index (chỉ khi không thêm/xóa) -->
  <div v-for="(item, index) in items" :key="index">
    {{ item }}
  </div>
  
  <!-- ❌ Tránh - Dùng object -->
  <div v-for="item in items" :key="item">
    {{ item }}
  </div>
</template>
```

### Khi nào dùng index?

**✅ Dùng index khi:**
- Danh sách không thay đổi (không thêm/xóa)
- Không có ID unique

**❌ Tránh index khi:**
- Có thể thêm/xóa items
- Có thể sắp xếp lại
- Có thể filter

---

## 🎯 4. v-for với Object

### Cú pháp

```vue
<template>
  <ul>
    <li v-for="(value, key) in user" :key="key">
      {{ key }}: {{ value }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({
  name: 'Nguyễn Văn A',
  age: 20,
  email: 'a@example.com'
})
</script>
```

**Kết quả:**
- name: Nguyễn Văn A
- age: 20
- email: a@example.com

### Lấy index

```vue
<template>
  <ul>
    <li v-for="(value, key, index) in user" :key="key">
      {{ index + 1 }}. {{ key }}: {{ value }}
    </li>
  </ul>
</template>
```

---

## 💻 5. Ví dụ thực tế

### Ví dụ 1: Todo List

```vue
<template>
  <div>
    <h2>Todo List</h2>
    
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Thêm todo">
    
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <span :class="{ done: todo.completed }">
          {{ todo.text }}
        </span>
        <button @click="toggleTodo(todo.id)">Toggle</button>
        <button @click="deleteTodo(todo.id)">Xóa</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const todos = ref([
  { id: 1, text: 'Học Vue', completed: false },
  { id: 2, text: 'Làm bài tập', completed: true }
])

const newTodo = ref('')
let nextId = 3

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}

function toggleTodo(id) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

function deleteTodo(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  color: #999;
}
</style>
```

### Ví dụ 2: Bảng sản phẩm

```vue
<template>
  <div>
    <h2>Quản lý sản phẩm</h2>
    
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên</th>
          <th>Giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.price.toLocaleString('vi-VN') }} đ</td>
          <td>
            <button @click="editProduct(product.id)">Sửa</button>
            <button @click="deleteProduct(product.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { id: 1, name: 'iPhone 15', price: 20000000 },
  { id: 2, name: 'Samsung S24', price: 18000000 },
  { id: 3, name: 'MacBook Pro', price: 45000000 }
])

function editProduct(id) {
  console.log('Edit:', id)
}

function deleteProduct(id) {
  products.value = products.value.filter(p => p.id !== id)
}
</script>
```

### Ví dụ 3: Nested v-for

```vue
<template>
  <div>
    <div v-for="category in categories" :key="category.id">
      <h3>{{ category.name }}</h3>
      <ul>
        <li v-for="product in category.products" :key="product.id">
          {{ product.name }} - {{ product.price }} đ
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    id: 1,
    name: 'Điện thoại',
    products: [
      { id: 1, name: 'iPhone 15', price: 20000000 },
      { id: 2, name: 'Samsung S24', price: 18000000 }
    ]
  },
  {
    id: 2,
    name: 'Laptop',
    products: [
      { id: 3, name: 'MacBook Pro', price: 45000000 }
    ]
  }
])
</script>
```

---

## ⚠️ 6. Các lỗi thường gặp

### Lỗi 1: Quên :key

**❌ Vấn đề:**
```vue
<li v-for="item in items">
  {{ item }}
</li>
```

**✅ Giải pháp:**
```vue
<li v-for="item in items" :key="item.id">
  {{ item }}
</li>
```

**🔍 Giải thích:** Vue cần key để track elements, không có key sẽ có warning và có thể render sai.

---

### Lỗi 2: Dùng index làm key khi có thể thêm/xóa

**❌ Vấn đề:**
```vue
<li v-for="(item, index) in items" :key="index">
  {{ item }}
</li>
```

**Vấn đề:** Khi xóa item đầu tiên, tất cả items sau sẽ bị re-render sai.

**✅ Giải pháp:**
```vue
<li v-for="item in items" :key="item.id">
  {{ item }}
</li>
```

---

### Lỗi 3: Dùng v-if và v-for trên cùng element

**❌ Vấn đề:**
```vue
<li v-for="item in items" v-if="item.visible">
  {{ item.name }}
</li>
```

**✅ Giải pháp:**
```vue
<!-- Cách 1: Dùng template -->
<template v-for="item in items" :key="item.id">
  <li v-if="item.visible">
    {{ item.name }}
  </li>
</template>

<!-- Cách 2: Filter trong computed -->
<li v-for="item in visibleItems" :key="item.id">
  {{ item.name }}
</li>

<script setup>
const visibleItems = computed(() => {
  return items.value.filter(item => item.visible)
})
</script>
```

---

### Lỗi 4: Mutate array trực tiếp

**❌ Vấn đề:**
```vue
<script setup>
const items = ref([1, 2, 3])

function addItem() {
  items.value = items.value.push(4)  // ❌ push() trả về length
}
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const items = ref([1, 2, 3])

function addItem() {
  items.value.push(4)  // ✅ Đúng
  // hoặc
  items.value = [...items.value, 4]  // ✅ Tạo array mới
}
</script>
```

---

## 💡 7. Best Practices

### 1. Luôn dùng :key với ID unique

```vue
<!-- ✅ Tốt -->
<div v-for="product in products" :key="product.id">

<!-- ❌ Tránh -->
<div v-for="product in products" :key="product.name">
```

### 2. Filter trong computed thay vì v-if

```vue
<!-- ✅ Tốt -->
<div v-for="item in filteredItems" :key="item.id">

<script setup>
const filteredItems = computed(() => {
  return items.value.filter(item => item.visible)
})
</script>

<!-- ❌ Tránh -->
<div v-for="item in items" v-if="item.visible" :key="item.id">
```

### 3. Tách logic phức tạp ra methods

```vue
<template>
  <div v-for="product in products" :key="product.id">
    <p>{{ formatPrice(product.price) }}</p>
    <p>{{ getStatus(product) }}</p>
  </div>
</template>

<script setup>
function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' đ'
}

function getStatus(product) {
  return product.stock > 0 ? 'Còn hàng' : 'Hết hàng'
}
</script>
```

---

## 🧪 8. Thực hành

### Bài tập 1: Danh sách sinh viên
Tạo danh sách sinh viên:
- Hiển thị STT, Tên, Tuổi, Điểm
- Có nút "Xóa" cho mỗi sinh viên
- Có nút "Thêm" để thêm sinh viên mới

### Bài tập 2: Shopping Cart
Tạo giỏ hàng:
- Hiển thị danh sách sản phẩm
- Mỗi sản phẩm có: Tên, Giá, Số lượng
- Tính tổng tiền
- Có nút "Xóa" cho mỗi sản phẩm

### Bài tập 3: Filter và Search
Tạo danh sách sản phẩm:
- Có input search
- Filter sản phẩm theo tên
- Hiển thị số kết quả tìm được

---

## 🧪 9. Mini Test

### Câu 1: v-for dùng để làm gì?
<details>
<summary>Xem đáp án</summary>
Render danh sách (array hoặc object) thành các elements trong template.
</details>

### Câu 2: Tại sao cần :key?
<details>
<summary>Xem đáp án</summary>
Để Vue track elements, update đúng khi data thay đổi, và tối ưu performance.
</details>

### Câu 3: Key nên là gì?
<details>
<summary>Xem đáp án</summary>
ID unique và stable từ database. Tránh dùng index khi có thể thêm/xóa items.
</details>

### Câu 4: Có thể dùng v-if và v-for trên cùng element không?
<details>
<summary>Xem đáp án</summary>
Không, nên dùng template wrapper hoặc filter trong computed.
</details>

### Câu 5: Làm sao lấy index trong v-for?
<details>
<summary>Xem đáp án</summary>
Dùng syntax: `v-for="(item, index) in items"`.
</details>

---

## 📌 10. Quick Notes

### v-for với Array
```vue
<li v-for="item in items" :key="item.id">
<li v-for="(item, index) in items" :key="item.id">
```

### v-for với Object
```vue
<li v-for="(value, key) in object" :key="key">
<li v-for="(value, key, index) in object" :key="key">
```

### Key Rules
- ✅ Dùng ID unique
- ❌ Tránh index khi có thể thêm/xóa
- ❌ Tránh dùng object làm key

### Common Patterns
```vue
<!-- Filter -->
<div v-for="item in filteredItems" :key="item.id">

<!-- Nested -->
<div v-for="parent in parents" :key="parent.id">
  <div v-for="child in parent.children" :key="child.id">
```

---

**👉 Bài tiếp theo: [07_form_handling.md](./07_form_handling.md) - Form Handling với v-model**

