# 🟦 BÀI 12: COMPOSITION API NÂNG CAO

## 🎯 Mục tiêu
- Hiểu reactive() và khi nào dùng
- So sánh ref() vs reactive()
- Tạo Composables (reusable logic)
- Tổ chức code với Composition API
- Best practices

---

## 🧠 1. reactive() vs ref()

### 🎬 Ví dụ dẫn nhập: Form đăng ký phức tạp

Hãy tưởng tượng bạn đang xây dựng form **đăng ký tài khoản** với nhiều thông tin:

**Tình huống thực tế:**
- Form có: Thông tin cá nhân (tên, tuổi, email), Địa chỉ (thành phố, quận, đường), Sở thích (nhiều checkbox)
- Tất cả thuộc về 1 object `form`
- Muốn code ngắn gọn, không phải dùng `.value` nhiều

**Với ref():**
```vue
<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  age: 0,
  email: '',
  address: {
    city: '',
    district: '',
    street: ''
  },
  hobbies: []
})

function updateForm() {
  form.value.name = 'New Name'           // ✅ Phải dùng .value
  form.value.address.city = 'Hà Nội'    // ✅ Phải dùng .value
  form.value.hobbies.push('Reading')     // ✅ Phải dùng .value
}
</script>
```

**Với reactive():**
```vue
<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  age: 0,
  email: '',
  address: {
    city: '',
    district: '',
    street: ''
  },
  hobbies: []
})

function updateForm() {
  form.name = 'New Name'           // ✅ Không cần .value
  form.address.city = 'Hà Nội'     // ✅ Không cần .value
  form.hobbies.push('Reading')     // ✅ Không cần .value
}
</script>
```

**Ưu điểm reactive():**
- Code ngắn gọn hơn (không cần `.value`)
- Dễ đọc hơn với object phức tạp

### reactive() là gì?

**`reactive()`** tạo reactive object, không cần `.value`

```vue
<script setup>
import { reactive } from 'vue'

const user = reactive({
  name: 'Nguyễn Văn A',
  age: 20,
  email: 'a@example.com'
})

function updateUser() {
  user.name = 'Nguyễn Văn B'  // ✅ Không cần .value
  user.age++                   // ✅ Không cần .value
}
</script>

<template>
  <p>{{ user.name }}</p>
  <p>{{ user.age }}</p>
</template>
```

### So sánh ref() vs reactive()

| Đặc điểm | ref() | reactive() |
|----------|-------|------------|
| **Dùng cho** | Primitive, Object, Array | Chỉ Object, Array |
| **Cần .value** | ✅ Có (trong script) | ❌ Không |
| **Gán lại toàn bộ** | ✅ Được | ❌ Mất reactivity |
| **Destructure** | Cần toRefs() | Cần toRefs() |
| **TypeScript** | Tốt hơn | Tốt |

### Khi nào dùng ref()?

✅ **Dùng ref() khi:**
- Primitive values (string, number, boolean)
- Cần gán lại toàn bộ object
- TypeScript support tốt hơn

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)           // ✅ Primitive
const name = ref('')           // ✅ Primitive
const user = ref({ name: 'A' }) // ✅ Có thể gán lại
</script>
```

### Khi nào dùng reactive()?

✅ **Dùng reactive() khi:**
- Object phức tạp, nhiều properties
- Không cần gán lại toàn bộ
- Muốn code ngắn gọn hơn (không cần .value)

```vue
<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
  address: {
    city: '',
    district: ''
  }
})

function updateForm() {
  form.name = 'New Name'        // ✅ Không cần .value
  form.address.city = 'Hà Nội'  // ✅ Nested vẫn reactive
}
</script>
```

---

## 🔧 2. toRefs() - Giữ reactivity khi destructure

### Vấn đề

```vue
<script setup>
import { reactive } from 'vue'

const user = reactive({
  name: 'Nguyễn Văn A',
  age: 20
})

// ❌ Destructure mất reactivity
const { name, age } = user

function update() {
  name = 'B'  // ❌ Không update user.name
}
</script>
```

### Giải pháp: toRefs()

```vue
<script setup>
import { reactive, toRefs } from 'vue'

const user = reactive({
  name: 'Nguyễn Văn A',
  age: 20
})

// ✅ Giữ reactivity
const { name, age } = toRefs(user)

function update() {
  name.value = 'B'  // ✅ Update user.name (cần .value vì là ref)
}
</script>
```

---

## 🎯 3. Composables - Reusable Logic

### Composables là gì?

**Composables** = Functions tái sử dụng logic, tương tự React hooks

### Ví dụ: useCounter

**`composables/useCounter.js`:**
```javascript
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

**Sử dụng:**
```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement, reset } = useCounter(10)
</script>
```

### Ví dụ: useFetch

**`composables/useFetch.js`:**
```javascript
import { ref, onMounted } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
```

**Sử dụng:**
```vue
<template>
  <div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">Lỗi: {{ error }}</div>
    <div v-else>
      <div v-for="item in data" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFetch } from '@/composables/useFetch'

const { data, loading, error, refetch } = useFetch('/api/products')
</script>
```

### Ví dụ: useLocalStorage

**`composables/useLocalStorage.js`:**
```javascript
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue = null) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)
  
  watch(value, (newValue) => {
    if (newValue === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })
  
  return value
}
```

**Sử dụng:**
```vue
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

const theme = useLocalStorage('theme', 'light')
const user = useLocalStorage('user', null)

// Tự động lưu vào localStorage khi thay đổi
theme.value = 'dark'
</script>
```

---

## 📁 4. Tổ chức code với Composition API

### Cấu trúc Component

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 2. Props & Emits
const props = defineProps({
  title: String
})

const emit = defineEmits(['update'])

// 3. Composables
const router = useRouter()
const authStore = useAuthStore()
const { data, loading } = useFetch('/api/data')

// 4. Reactive State
const count = ref(0)
const form = reactive({
  name: '',
  email: ''
})

// 5. Computed
const doubleCount = computed(() => count.value * 2)
const isFormValid = computed(() => form.name && form.email)

// 6. Methods
function handleSubmit() {
  // ...
}

// 7. Lifecycle Hooks
onMounted(() => {
  // ...
})
</script>
```

---

## 💻 5. Ví dụ thực tế: useAuth

**`composables/useAuth.js`:**
```javascript
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  
  function login(credentials) {
    // Giả lập API call
    return new Promise((resolve) => {
      setTimeout(() => {
        token.value = 'fake-token'
        user.value = { name: credentials.username }
        localStorage.setItem('token', token.value)
        router.push('/dashboard')
        resolve()
      }, 1000)
    })
  }
  
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
}
```

**Sử dụng:**
```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      <p>Xin chào, {{ user.name }}</p>
      <button @click="logout">Đăng xuất</button>
    </div>
    <div v-else>
      <button @click="handleLogin">Đăng nhập</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, login, logout } = useAuth()

function handleLogin() {
  login({ username: 'admin', password: '123' })
}
</script>
```

---

## ⚠️ 6. Các lỗi thường gặp

### Lỗi 1: Gán lại reactive object

**❌ Vấn đề:**
```vue
<script setup>
const user = reactive({ name: 'A' })

function update() {
  user = { name: 'B' }  // ❌ Mất reactivity
}
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const user = reactive({ name: 'A' })

function update() {
  user.name = 'B'  // ✅ Update property
  // hoặc
  Object.assign(user, { name: 'B' })  // ✅ Merge
}
</script>
```

---

### Lỗi 2: Destructure mất reactivity

**❌ Vấn đề:**
```vue
<script setup>
const user = reactive({ name: 'A' })
const { name } = user  // ❌ Mất reactivity
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
import { toRefs } from 'vue'
const user = reactive({ name: 'A' })
const { name } = toRefs(user)  // ✅ Giữ reactivity
</script>
```

---

## 💡 7. Best Practices

### 1. Dùng composables cho logic tái sử dụng

```javascript
// ✅ Tốt
export function useCounter() { ... }
export function useFetch() { ... }
export function useAuth() { ... }
```

### 2. Tổ chức code theo thứ tự

```vue
<script setup>
// 1. Imports
// 2. Props/Emits
// 3. Composables
// 4. State
// 5. Computed
// 6. Methods
// 7. Lifecycle
</script>
```

### 3. Đặt tên composables với prefix "use"

```javascript
// ✅ Tốt
useCounter()
useFetch()
useAuth()

// ❌ Tránh
counter()
fetchData()
auth()
```

---

## 🧪 8. Thực hành

### Bài tập 1: Tạo useCounter
Tạo composable useCounter:
- count, increment, decrement, reset
- Có thể set initial value

### Bài tập 2: Tạo useForm
Tạo composable useForm:
- form state
- errors
- validate function
- submit function

### Bài tập 3: Tạo useDebounce
Tạo composable useDebounce:
- Debounce value
- Dùng cho search input

---

## 🧪 9. Mini Test

### Câu 1: reactive() khác ref() như thế nào?
<details>
<summary>Xem đáp án</summary>
reactive() không cần .value, nhưng không thể gán lại toàn bộ. ref() cần .value nhưng linh hoạt hơn.
</details>

### Câu 2: Composables là gì?
<details>
<summary>Xem đáp án</summary>
Functions tái sử dụng logic, tương tự React hooks, giúp tổ chức code tốt hơn.
</details>

### Câu 3: Tại sao cần toRefs()?
<details>
<summary>Xem đáp án</summary>
Để giữ reactivity khi destructure object từ reactive().
</details>

---

## 📌 10. Quick Notes

### reactive()
```javascript
const user = reactive({ name: 'A' })
user.name = 'B'  // ✅ Không cần .value
```

### toRefs()
```javascript
const { name, age } = toRefs(user)
name.value = 'B'  // ✅ Cần .value vì là ref
```

### Composables
```javascript
export function useCounter() {
  const count = ref(0)
  return { count, increment, decrement }
}
```

---

**👉 Bài tiếp theo: [13_pinia_router.md](./13_pinia_router.md) - Pinia và Router**

