# 🟦 BÀI 10: PROPS VÀ EMITS CHI TIẾT

## 🎯 Mục tiêu
- Hiểu Props là gì và cách sử dụng
- Validate Props
- Hiểu Emits là gì và cách sử dụng
- Two-way binding với v-model
- Slots cơ bản

---

## 📥 1. Props - Truyền data từ Parent xuống Child

### 🎬 Ví dụ dẫn nhập: Trang sản phẩm trên Shopee

Hãy tưởng tượng bạn đang xây dựng trang **danh sách sản phẩm**:

**Tình huống thực tế:**
- Trang chủ Shopee hiển thị 100 sản phẩm
- Mỗi sản phẩm có: ảnh, tên, giá, đánh giá, số lượt mua
- Tất cả sản phẩm dùng cùng 1 design (ProductCard component)
- Nhưng mỗi sản phẩm có **data khác nhau**

**Vấn đề:**
- Làm sao truyền data của từng sản phẩm vào component ProductCard?
- Làm sao component ProductCard biết khi user click "Mua ngay"?

**Giải pháp: Props và Emits**

### Props cơ bản

**Props** = Properties - Dữ liệu truyền từ component cha xuống component con

### 🌐 Liên hệ thực tế

**Props và Emits được dùng ở mọi nơi:**
- **Facebook**: Post component nhận props (author, content, likes), emit event khi like
- **YouTube**: VideoCard nhận props (title, thumbnail, views), emit event khi click
- **Shopee**: ProductCard nhận props (name, price, image), emit event khi mua
- **Gmail**: EmailItem nhận props (sender, subject, date), emit event khi click

```vue
<!-- Parent.vue -->
<template>
  <ChildComponent 
    :name="userName"
    :age="userAge"
    :is-active="isActive"
  />
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const userName = ref('Nguyễn Văn A')
const userAge = ref(20)
const isActive = ref(true)
</script>

<!-- ChildComponent.vue -->
<template>
  <div>
    <p>Tên: {{ name }}</p>
    <p>Tuổi: {{ age }}</p>
    <p>Trạng thái: {{ isActive ? 'Hoạt động' : 'Không hoạt động' }}</p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  age: Number,
  isActive: Boolean
})
</script>
```

### Props với validation

```vue
<script setup>
defineProps({
  // Required
  name: {
    type: String,
    required: true
  },
  
  // With default
  age: {
    type: Number,
    default: 0
  },
  
  // With validator
  price: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  
  // Multiple types
  id: {
    type: [String, Number],
    required: true
  },
  
  // Object with default
  user: {
    type: Object,
    default: () => ({ name: 'Guest' })
  },
  
  // Array with default
  items: {
    type: Array,
    default: () => []
  }
})
</script>
```

### Ví dụ: ProductCard với Props

```vue
<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <img :src="image" :alt="name">
    <h3>{{ name }}</h3>
    <p class="price">{{ formatPrice(price) }}</p>
    <p v-if="description">{{ description }}</p>
    <span :class="['badge', inStock ? 'in-stock' : 'out-of-stock']">
      {{ inStock ? 'Còn hàng' : 'Hết hàng' }}
    </span>
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
    required: true,
    validator: (value) => value > 0
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

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' đ'
}
</script>
```

---

## 📤 2. Emits - Gửi event từ Child lên Parent

### Emits cơ bản

**Emits** = Events - Cách component con gửi thông tin lên component cha

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

function handleUpdate() {
  emit('update', { value: 123 })
}
</script>

<!-- Parent.vue -->
<template>
  <ChildComponent 
    @click="handleChildClick"
    @update="handleChildUpdate"
  />
</template>

<script setup>
function handleChildClick(data) {
  console.log('Received:', data)
}

function handleChildUpdate(data) {
  console.log('Update:', data)
}
</script>
```

### Emits với validation

```vue
<script setup>
const emit = defineEmits({
  // No validation
  click: null,
  
  // With validation
  submit: (payload) => {
    if (payload.email && payload.password) {
      return true
    }
    console.warn('Invalid submit payload!')
    return false
  }
})
</script>
```

### Ví dụ: Counter Component

```vue
<!-- Counter.vue -->
<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:count', 'change'])

const count = ref(props.initialValue)

function increment() {
  count.value++
  emit('update:count', count.value)
  emit('change', count.value)
}

function decrement() {
  count.value--
  emit('update:count', count.value)
  emit('change', count.value)
}
</script>

<!-- Parent.vue -->
<template>
  <Counter 
    :initial-value="5"
    @update:count="handleCountUpdate"
    @change="handleCountChange"
  />
  <p>Count từ parent: {{ count }}</p>
</template>

<script setup>
import { ref } from 'vue'
import Counter from './Counter.vue'

const count = ref(5)

function handleCountUpdate(newCount) {
  count.value = newCount
}

function handleCountChange(newCount) {
  console.log('Count changed:', newCount)
}
</script>
```

---

## 🔄 3. v-model với Components

### Two-way binding

Vue cho phép dùng `v-model` với custom components:

```vue
<!-- CustomInput.vue -->
<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<!-- Parent.vue -->
<template>
  <CustomInput v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const message = ref('')
</script>
```

### v-model với custom prop name

```vue
<!-- CustomInput.vue -->
<template>
  <input 
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  title: String
})

defineEmits(['update:title'])
</script>

<!-- Parent.vue -->
<template>
  <CustomInput v-model:title="bookTitle" />
</template>
```

### Ví dụ: Custom Checkbox

```vue
<!-- CustomCheckbox.vue -->
<template>
  <label class="checkbox-wrapper">
    <input 
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  label: String
})

defineEmits(['update:modelValue'])
</script>

<!-- Parent.vue -->
<template>
  <CustomCheckbox 
    v-model="agree"
    label="Tôi đồng ý với điều khoản"
  />
</template>
```

---

## 🎰 4. Slots - Truyền content vào Component

### Default Slot

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="card-body">
      <slot></slot>  <!-- Content từ parent -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<!-- Parent.vue -->
<template>
  <Card title="Sản phẩm">
    <p>Đây là nội dung trong card</p>
    <button>Click me</button>
  </Card>
</template>
```

### Named Slots

```vue
<!-- Layout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>  <!-- Default slot -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- Parent.vue -->
<template>
  <Layout>
    <template #header>
      <h1>Header Content</h1>
    </template>
    
    <p>Main Content</p>
    
    <template #footer>
      <p>Footer Content</p>
    </template>
  </Layout>
</template>
```

### Scoped Slots

```vue
<!-- List.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: Array
})
</script>

<!-- Parent.vue -->
<template>
  <List :items="products">
    <template #default="{ item, index }">
      <strong>{{ index + 1 }}. {{ item.name }}</strong>
      <span>{{ item.price }} đ</span>
    </template>
  </List>
</template>
```

---

## 💻 5. Ví dụ thực tế: Form Component

```vue
<!-- FormField.vue -->
<template>
  <div class="form-field">
    <label v-if="label">{{ label }}</label>
    <input 
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="{ error: hasError }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  modelValue: [String, Number],
  error: String
})

defineEmits(['update:modelValue'])

const hasError = computed(() => !!props.error)
</script>

<!-- Parent.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <FormField
      v-model="form.name"
      label="Tên"
      placeholder="Nhập tên"
      :error="errors.name"
    />
    
    <FormField
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="email@example.com"
      :error="errors.email"
    />
    
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import FormField from './FormField.vue'

const form = ref({
  name: '',
  email: ''
})

const errors = ref({})

function handleSubmit() {
  // Validation...
  console.log('Submit:', form.value)
}
</script>
```

---

## ⚠️ 6. Các lỗi thường gặp

### Lỗi 1: Mutate props

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

### Lỗi 2: Quên default cho Object/Array

**❌ Vấn đề:**
```vue
<script setup>
defineProps({
  user: {
    type: Object,
    default: {}  // ❌ Tất cả instances dùng chung object
  }
})
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
defineProps({
  user: {
    type: Object,
    default: () => ({})  // ✅ Function trả về object mới
  },
  items: {
    type: Array,
    default: () => []  // ✅ Function trả về array mới
  }
})
</script>
```

---

### Lỗi 3: Quên emit update:modelValue

**❌ Vấn đề:**
```vue
<template>
  <input :value="modelValue" @input="handleInput" />
</template>

<script setup>
function handleInput(e) {
  // ❌ Quên emit
}
</script>
```

**✅ Giải pháp:**
```vue
<template>
  <input 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
  />
</template>
```

---

## 💡 7. Best Practices

### 1. Validate props đầy đủ

```vue
<script setup>
defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => value.length > 0
  }
})
</script>
```

### 2. Dùng v-model cho two-way binding

```vue
<!-- ✅ Tốt -->
<CustomInput v-model="value" />

<!-- ❌ Tránh -->
<CustomInput :value="value" @update:value="value = $event" />
```

### 3. Dùng slots cho flexible content

```vue
<!-- ✅ Tốt - Flexible -->
<Card>
  <p>Custom content</p>
</Card>

<!-- ❌ Tránh - Rigid -->
<Card content="Fixed content" />
```

---

## 🧪 8. Thực hành

### Bài tập 1: Tạo Input Component
Tạo component Input:
- Props: label, type, placeholder, error
- v-model support
- Hiển thị error message

### Bài tập 2: Tạo Modal Component
Tạo component Modal:
- Props: isOpen, title
- Emits: close, confirm
- Slot cho content

### Bài tập 3: Tạo List Component
Tạo component List:
- Props: items
- Scoped slot cho custom item rendering

---

## 🧪 9. Mini Test

### Câu 1: Props dùng để làm gì?
<details>
<summary>Xem đáp án</summary>
Truyền data từ component cha xuống component con.
</details>

### Câu 2: Emits dùng để làm gì?
<details>
<summary>Xem đáp án</summary>
Gửi event từ component con lên component cha.
</details>

### Câu 3: Tại sao không được mutate props?
<details>
<summary>Xem đáp án</summary>
Props là read-only, mutate sẽ gây lỗi. Nên emit event để parent update.
</details>

### Câu 4: Slots dùng để làm gì?
<details>
<summary>Xem đáp án</summary>
Truyền content (HTML) vào component, giúp component linh hoạt hơn.
</details>

---

## 📌 10. Quick Notes

### Props
```javascript
defineProps({
  name: String,
  age: { type: Number, default: 0 }
})
```

### Emits
```javascript
const emit = defineEmits(['click'])
emit('click', data)
```

### v-model
```vue
<!-- Child -->
<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />

<!-- Parent -->
<Child v-model="value" />
```

### Slots
```vue
<!-- Default -->
<slot></slot>

<!-- Named -->
<slot name="header"></slot>

<!-- Scoped -->
<slot :item="item"></slot>
```

---

**👉 Bài tiếp theo: [11_lifecycle_hooks.md](./11_lifecycle_hooks.md) - Lifecycle Hooks**

