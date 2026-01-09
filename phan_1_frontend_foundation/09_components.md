# 🟦 BÀI 9: COMPONENTS CƠ BẢN

## 🎯 Mục tiêu
- Hiểu Component là gì và tại sao cần
- Tạo và sử dụng Component
- Tổ chức Components
- Component communication cơ bản
- Thực hành tạo Component tái sử dụng

---

## 🧠 1. Component là gì?

### 🎬 Ví dụ dẫn nhập: Trang sản phẩm trên Shopee

Hãy tưởng tượng bạn đang xây dựng trang **danh sách sản phẩm** cho website bán hàng:

**Tình huống thực tế:**
- Trang chủ Shopee hiển thị 100+ sản phẩm
- Mỗi sản phẩm có cấu trúc giống nhau: ảnh, tên, giá, nút "Mua ngay"
- Khi cần thay đổi design (ví dụ: thêm badge "Sale"), phải sửa 100+ chỗ
- Khi cần thêm tính năng (ví dụ: thêm nút "Yêu thích"), phải thêm vào 100+ chỗ

**Vấn đề: Code lặp lại**

**Ví dụ không dùng Component:**
```vue
<template>
  <div>
    <!-- Product 1 -->
    <div class="product-card">
      <img src="/iphone15.jpg" alt="iPhone 15">
      <h3>iPhone 15</h3>
      <p class="price">20.000.000 đ</p>
      <p class="old-price">25.000.000 đ</p>
      <button>Mua ngay</button>
    </div>
    
    <!-- Product 2 -->
    <div class="product-card">
      <img src="/samsung24.jpg" alt="Samsung S24">
      <h3>Samsung S24</h3>
      <p class="price">18.000.000 đ</p>
      <p class="old-price">22.000.000 đ</p>
      <button>Mua ngay</button>
    </div>
    
    <!-- Product 3 - 100... -->
    <!-- ❌ Code lặp lại 100 lần! -->
  </div>
</template>
```

**Vấn đề:**
- Code lặp lại nhiều (100+ lần)
- Khó maintain (sửa 1 chỗ phải sửa 100 chỗ)
- Khó thay đổi (thêm tính năng phải thêm vào 100 chỗ)
- Dễ lỗi (quên sửa 1 chỗ → UI không nhất quán)

**Giải pháp: Component**

**Với Component:**
```vue
<!-- ProductCard.vue - Component tái sử dụng -->
<template>
  <div class="product-card">
    <img :src="image" :alt="name">
    <h3>{{ name }}</h3>
    <p class="price">{{ formatPrice(price) }} đ</p>
    <p v-if="oldPrice" class="old-price">{{ formatPrice(oldPrice) }} đ</p>
    <button @click="handleBuy">Mua ngay</button>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  price: Number,
  oldPrice: Number,
  image: String
})

const emit = defineEmits(['buy'])

function formatPrice(price) {
  return price.toLocaleString('vi-VN')
}

function handleBuy() {
  emit('buy')
}
</script>

<!-- App.vue - Sử dụng Component -->
<template>
  <div>
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :name="product.name"
      :price="product.price"
      :old-price="product.oldPrice"
      :image="product.image"
      @buy="handleBuy(product)"
    />
  </div>
</template>

<script setup>
import ProductCard from './components/ProductCard.vue'

const products = [
  { id: 1, name: 'iPhone 15', price: 20000000, oldPrice: 25000000, image: '/iphone15.jpg' },
  { id: 2, name: 'Samsung S24', price: 18000000, oldPrice: 22000000, image: '/samsung24.jpg' }
  // ... 98 sản phẩm nữa
]

function handleBuy(product) {
  console.log('Mua:', product.name)
}
</script>
```

**Ưu điểm:**
- ✅ Code ngắn gọn (1 component dùng 100 lần)
- ✅ Dễ maintain (sửa 1 chỗ → tất cả update)
- ✅ Dễ thay đổi (thêm tính năng vào component → tất cả có)
- ✅ Nhất quán (tất cả sản phẩm giống nhau)

### 🌐 Liên hệ thực tế

**Components được dùng ở mọi nơi:**
- **Facebook**: Component "Post", "Comment", "Like Button" - dùng lại hàng nghìn lần
- **YouTube**: Component "Video Card", "Channel Card" - hiển thị hàng trăm video
- **Shopee**: Component "Product Card", "Order Card" - hiển thị hàng nghìn sản phẩm
- **Gmail**: Component "Email Item", "Attachment" - hiển thị hàng trăm email
- **Instagram**: Component "Post", "Story", "Comment" - dùng lại liên tục

**Tất cả đều dùng Components để tái sử dụng code!**

### Giải pháp: Component

**Component** = Khối code tái sử dụng, có thể dùng nhiều lần

```vue
<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <h3>{{ name }}</h3>
    <p>Giá: {{ price.toLocaleString('vi-VN') }} đ</p>
    <button>Mua ngay</button>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  price: Number
})
</script>

<!-- App.vue -->
<template>
  <div>
    <ProductCard name="iPhone 15" :price="20000000" />
    <ProductCard name="Samsung S24" :price="18000000" />
    <ProductCard name="MacBook Pro" :price="45000000" />
  </div>
</template>
```

**Ưu điểm:**
- ✅ Tái sử dụng code
- ✅ Dễ maintain (sửa 1 chỗ)
- ✅ Tổ chức code tốt hơn
- ✅ Test dễ hơn

---

## 📦 2. Tạo Component

### Cấu trúc Component

Mỗi Component là một file `.vue` gồm 3 phần:

```vue
<template>
  <!-- HTML Template -->
  <div class="my-component">
    <h2>{{ title }}</h2>
  </div>
</template>

<script setup>
// JavaScript Logic
import { ref } from 'vue'

const title = ref('My Component')
</script>

<style scoped>
/* CSS Styles */
.my-component {
  padding: 20px;
}
</style>
```

### Ví dụ: Button Component

**`components/MyButton.vue`:**
```vue
<template>
  <button 
    :class="['my-button', variant]"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.my-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.my-button.primary {
  background: blue;
  color: white;
}

.my-button.secondary {
  background: gray;
  color: white;
}

.my-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

**Sử dụng:**
```vue
<template>
  <MyButton 
    label="Click me" 
    variant="primary"
    @click="handleButtonClick"
  />
</template>

<script setup>
import MyButton from '@/components/MyButton.vue'

function handleButtonClick() {
  console.log('Button clicked!')
}
</script>
```

---

## 🗂️ 3. Tổ chức Components

### Cấu trúc thư mục

```
src/
├── components/
│   ├── common/          # Components dùng chung
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   └── Input.vue
│   ├── layout/          # Layout components
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── Sidebar.vue
│   └── features/        # Feature-specific
│       ├── ProductCard.vue
│       └── UserProfile.vue
```

### Ví dụ: ProductCard Component

**`components/ProductCard.vue`:**
```vue
<template>
  <div class="product-card">
    <img :src="image" :alt="name" class="product-image">
    <h3 class="product-name">{{ name }}</h3>
    <p class="product-price">{{ formatPrice(price) }}</p>
    <p class="product-description">{{ description }}</p>
    <button 
      class="buy-button"
      @click="handleBuy"
      :disabled="!inStock"
    >
      {{ inStock ? 'Mua ngay' : 'Hết hàng' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: '/placeholder.jpg'
  },
  description: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['buy'])

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' đ'
}

function handleBuy() {
  if (props.inStock) {
    emit('buy')
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  margin: 12px 0;
  font-size: 1.2em;
}

.product-price {
  font-size: 1.5em;
  color: #e74c3c;
  font-weight: bold;
}

.buy-button {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buy-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style>
```

**Sử dụng:**
```vue
<template>
  <div class="products">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :name="product.name"
      :price="product.price"
      :image="product.image"
      :description="product.description"
      :in-stock="product.stock > 0"
      @buy="handleBuy(product)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

const products = ref([
  {
    id: 1,
    name: 'iPhone 15',
    price: 20000000,
    image: '/iphone15.jpg',
    description: 'Điện thoại mới nhất',
    stock: 10
  }
])

function handleBuy(product) {
  console.log('Mua:', product.name)
}
</script>
```

---

## 🔄 4. Component Communication

### Parent → Child: Props

**Parent component truyền data xuống child:**

```vue
<!-- Parent.vue -->
<template>
  <ChildComponent :message="parentMessage" />
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const parentMessage = ref('Hello from parent')
</script>

<!-- ChildComponent.vue -->
<template>
  <p>{{ message }}</p>
</template>

<script setup>
defineProps({
  message: String
})
</script>
```

### Child → Parent: Emits

**Child component gửi event lên parent:**

```vue
<!-- ChildComponent.vue -->
<template>
  <button @click="handleClick">Click me</button>
</template>

<script setup>
const emit = defineEmits(['click', 'update'])

function handleClick() {
  emit('click', 'Data from child')
}
</script>

<!-- Parent.vue -->
<template>
  <ChildComponent @click="handleChildClick" />
</template>

<script setup>
function handleChildClick(data) {
  console.log('Received:', data)
}
</script>
```

---

## 💻 5. Ví dụ thực tế

### Ví dụ: Modal Component

**`components/Modal.vue`:**
```vue
<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button @click="close" class="close-button">×</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <button @click="close">Đóng</button>
        <button @click="confirm">Xác nhận</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: 'Modal'
  }
})

const emit = defineEmits(['close', 'confirm'])

function close() {
  emit('close')
}

function confirm() {
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
```

**Sử dụng:**
```vue
<template>
  <div>
    <button @click="openModal">Mở Modal</button>
    
    <Modal 
      :is-open="isModalOpen"
      title="Xác nhận"
      @close="closeModal"
      @confirm="handleConfirm"
    >
      <p>Bạn có chắc chắn muốn xóa?</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'

const isModalOpen = ref(false)

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleConfirm() {
  console.log('Confirmed!')
  closeModal()
}
</script>
```

---

## ⚠️ 6. Các lỗi thường gặp

### Lỗi 1: Quên import component

**❌ Vấn đề:**
```vue
<template>
  <MyComponent />  <!-- ❌ Lỗi: Component chưa import -->
</template>
```

**✅ Giải pháp:**
```vue
<template>
  <MyComponent />
</template>

<script setup>
import MyComponent from '@/components/MyComponent.vue'  // ✅ Import
</script>
```

---

### Lỗi 2: Quên defineProps

**❌ Vấn đề:**
```vue
<template>
  <p>{{ message }}</p>  <!-- ❌ message không được định nghĩa -->
</template>
```

**✅ Giải pháp:**
```vue
<template>
  <p>{{ message }}</p>
</template>

<script setup>
defineProps({
  message: String  // ✅ Định nghĩa props
})
</script>
```

---

### Lỗi 3: Mutate props trực tiếp

**❌ Vấn đề:**
```vue
<script setup>
const props = defineProps({ count: Number })

function increment() {
  props.count++  // ❌ Không được mutate props
}
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const props = defineProps({ count: Number })
const emit = defineEmits(['update:count'])

function increment() {
  emit('update:count', props.count + 1)  // ✅ Emit event
}
</script>
```

---

## 💡 7. Best Practices

### 1. Đặt tên Component rõ ràng

```vue
<!-- ✅ Tốt -->
ProductCard.vue
UserProfile.vue
ShoppingCart.vue

<!-- ❌ Tránh -->
Card.vue
Profile.vue
Cart.vue
```

### 2. Dùng scoped styles

```vue
<style scoped>
/* ✅ Chỉ áp dụng cho component này */
.my-class {
  color: red;
}
</style>
```

### 3. Validate props

```vue
<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  }
})
</script>
```

---

## 🧪 8. Thực hành

### Bài tập 1: Tạo Button Component
Tạo component Button:
- Props: label, variant, disabled
- Emit: click event
- Styles khác nhau cho mỗi variant

### Bài tập 2: Tạo Card Component
Tạo component Card:
- Props: title, content, image
- Slot cho custom content
- Styles đẹp

### Bài tập 3: Tạo Alert Component
Tạo component Alert:
- Props: type (success, error, warning), message
- Có thể đóng được
- Emit close event

---

## 🧪 9. Mini Test

### Câu 1: Component là gì?
<details>
<summary>Xem đáp án</summary>
Khối code tái sử dụng, có thể dùng nhiều lần, giúp tổ chức code tốt hơn.
</details>

### Câu 2: Làm sao truyền data từ parent xuống child?
<details>
<summary>Xem đáp án</summary>
Dùng props: defineProps trong child, truyền qua attributes trong parent.
</details>

### Câu 3: Làm sao gửi data từ child lên parent?
<details>
<summary>Xem đáp án</summary>
Dùng emits: defineEmits trong child, emit event, listen trong parent.
</details>

### Câu 4: scoped trong style làm gì?
<details>
<summary>Xem đáp án</summary>
Chỉ áp dụng styles cho component đó, không ảnh hưởng components khác.
</details>

---

## 📌 10. Quick Notes

### Component Structure
```vue
<template>...</template>
<script setup>...</script>
<style scoped>...</style>
```

### Props
```javascript
defineProps({
  name: String,
  price: Number
})
```

### Emits
```javascript
const emit = defineEmits(['click'])
emit('click', data)
```

### Import & Use
```javascript
import MyComponent from '@/components/MyComponent.vue'
```

---

**👉 Bài tiếp theo: [10_props_emits.md](./10_props_emits.md) - Props và Emits chi tiết**

