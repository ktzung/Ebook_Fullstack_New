# 🟦 BÀI 11: LIFECYCLE HOOKS

## 🎯 Mục tiêu
- Hiểu Lifecycle của Component
- Sử dụng onMounted, onUpdated, onUnmounted
- Khi nào dùng mỗi hook
- Thực hành với các ví dụ thực tế

---

## 🧠 1. Component Lifecycle là gì?

### 🎬 Ví dụ dẫn nhập: Trang sản phẩm trên Shopee

Hãy tưởng tượng bạn đang xây dựng trang **chi tiết sản phẩm**:

**Tình huống thực tế:**
1. **Khi trang mở ra (Mounted)**: 
   - Fetch thông tin sản phẩm từ API
   - Load ảnh sản phẩm
   - Focus vào input số lượng
   - Bắt đầu đếm thời gian xem sản phẩm

2. **Khi user scroll (Updated)**:
   - Load thêm ảnh khi scroll đến
   - Update progress bar
   - Log analytics

3. **Khi user rời trang (Unmounted)**:
   - Dừng timer đếm thời gian
   - Cleanup event listeners
   - Cancel API requests đang chờ

**Ví dụ thực tế:**
```vue
<template>
  <div class="product-page">
    <div v-if="loading">Đang tải...</div>
    <div v-else>
      <h1>{{ product.name }}</h1>
      <img :src="product.image" :alt="product.name">
      <p>Giá: {{ product.price }} đ</p>
      <input ref="quantityInput" v-model.number="quantity" type="number">
      <button @click="addToCart">Thêm vào giỏ</button>
    </div>
    <p>Bạn đã xem: {{ viewTime }} giây</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const quantityInput = ref(null)
const viewTime = ref(0)
let timer = null

// 1. onMounted: Chạy khi component được gắn vào DOM
onMounted(async () => {
  console.log('1. Component đã mount - Bắt đầu load data')
  
  // Fetch sản phẩm từ API
  try {
    const response = await fetch('/api/products/1')
    product.value = await response.json()
  } catch (error) {
    console.error('Lỗi load sản phẩm:', error)
  } finally {
    loading.value = false
  }
  
  // Focus vào input số lượng
  quantityInput.value?.focus()
  
  // Bắt đầu đếm thời gian xem
  timer = setInterval(() => {
    viewTime.value++
  }, 1000)
  
  console.log('2. Đã setup xong - Sẵn sàng hiển thị')
})

// 2. onUpdated: Chạy sau mỗi lần component update
onUpdated(() => {
  console.log('Component đã update - Có thể log analytics')
  // Gửi analytics: User đang xem sản phẩm
})

// 3. onUnmounted: Chạy trước khi component bị gỡ
onUnmounted(() => {
  console.log('3. Component sắp unmount - Cleanup')
  
  // Dừng timer
  if (timer) {
    clearInterval(timer)
  }
  
  // Gửi analytics: Tổng thời gian xem
  console.log(`User đã xem ${viewTime.value} giây`)
})
</script>
```

**Giải thích flow:**
1. User vào trang → Component mount → `onMounted` chạy → Load data, setup timer
2. User thay đổi số lượng → Component update → `onUpdated` chạy → Log analytics
3. User rời trang → Component unmount → `onUnmounted` chạy → Cleanup timer

### Lifecycle Stages

Mỗi Vue component trải qua các giai đoạn:

```
1. Setup (Khởi tạo)
   ↓
2. Mounted (Gắn vào DOM) ← onMounted chạy ở đây
   ↓
3. Updated (Cập nhật) ← onUpdated chạy ở đây
   ↓
4. Unmounted (Gỡ khỏi DOM) ← onUnmounted chạy ở đây
```

### Lifecycle Hooks

**Lifecycle Hooks** = Functions chạy tại các thời điểm cụ thể trong lifecycle

### 🌐 Liên hệ thực tế

**Lifecycle hooks được dùng ở mọi nơi:**
- **Facebook**: onMounted → Load posts, onUnmounted → Stop auto-refresh
- **YouTube**: onMounted → Load video, onUnmounted → Pause video
- **Shopee**: onMounted → Load products, onUnmounted → Save cart to localStorage
- **Gmail**: onMounted → Load emails, onUnmounted → Mark as read
- **Banking App**: onMounted → Load balance, onUnmounted → Logout if timeout

**Tất cả đều dùng Lifecycle Hooks để quản lý component!**

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue'

// Chạy sau khi component được mount vào DOM
onMounted(() => {
  console.log('Component đã được mount')
})

// Chạy sau khi component được update
onUpdated(() => {
  console.log('Component đã được update')
})

// Chạy trước khi component bị unmount
onUnmounted(() => {
  console.log('Component sắp bị unmount')
})
</script>
```

---

## 📋 2. Các Lifecycle Hooks

### onMounted

**Chạy khi:** Component đã được gắn vào DOM

**Dùng khi:**
- Fetch data từ API
- Setup event listeners
- Khởi tạo thư viện bên thứ 3
- Focus vào input

```vue
<template>
  <div>
    <p v-if="loading">Đang tải...</p>
    <div v-else>
      <p v-for="item in items" :key="item.id">{{ item.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Fetch data từ API
    const response = await fetch('/api/items')
    items.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})
</script>
```

### onUpdated

**Chạy khi:** Component đã được update (sau khi DOM update)

**Dùng khi:**
- Log changes
- Update thư viện bên thứ 3
- Scroll to element

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Tăng</button>
  </div>
</template>

<script setup>
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  console.log('Count đã thay đổi:', count.value)
  // Có thể update chart, scroll, etc.
})
</script>
```

### onUnmounted

**Chạy khi:** Component sắp bị gỡ khỏi DOM

**Dùng khi:**
- Cleanup event listeners
- Clear timers/intervals
- Cancel API requests
- Cleanup thư viện bên thứ 3

```vue
<template>
  <div>
    <p>Timer: {{ seconds }}s</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  // ✅ Quan trọng: Clear interval
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

### onBeforeMount

**Chạy khi:** Trước khi component được mount

**Dùng khi:** Setup trước khi render

```vue
<script setup>
import { onBeforeMount } from 'vue'

onBeforeMount(() => {
  console.log('Sắp mount vào DOM')
})
</script>
```

### onBeforeUpdate

**Chạy khi:** Trước khi component được update

**Dùng khi:** Lưu state trước khi update

```vue
<script setup>
import { ref, onBeforeUpdate } from 'vue'

const count = ref(0)
let previousCount = 0

onBeforeUpdate(() => {
  previousCount = count.value
  console.log('Trước khi update:', previousCount)
})
</script>
```

### onBeforeUnmount

**Chạy khi:** Trước khi component bị unmount

**Dùng khi:** Cleanup trước khi unmount

```vue
<script setup>
import { onBeforeUnmount } from 'vue'

onBeforeUnmount(() => {
  console.log('Sắp bị unmount')
  // Cleanup...
})
</script>
```

---

## 💻 3. Ví dụ thực tế

### Ví dụ 1: Fetch Data on Mount

```vue
<template>
  <div>
    <h2>Danh sách sản phẩm</h2>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">Lỗi: {{ error }}</div>
    <div v-else>
      <div v-for="product in products" :key="product.id">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} đ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/api/products')
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    products.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
```

### Ví dụ 2: Event Listener

```vue
<template>
  <div>
    <p>Window width: {{ width }}px</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)

function updateWidth() {
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  // ✅ Quan trọng: Remove listener
  window.removeEventListener('resize', updateWidth)
})
</script>
```

### Ví dụ 3: Timer với Cleanup

```vue
<template>
  <div>
    <h2>Stopwatch</h2>
    <p>{{ formatTime(time) }}</p>
    <button @click="toggle">{{ isRunning ? 'Dừng' : 'Bắt đầu' }}</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const time = ref(0)
const isRunning = ref(false)
let intervalId = null

function toggle() {
  if (isRunning.value) {
    clearInterval(intervalId)
    isRunning.value = false
  } else {
    intervalId = setInterval(() => {
      time.value++
    }, 1000)
    isRunning.value = true
  }
}

function reset() {
  time.value = 0
  if (intervalId) {
    clearInterval(intervalId)
    isRunning.value = false
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  // ✅ Cleanup khi component unmount
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

### Ví dụ 4: Focus Input on Mount

```vue
<template>
  <div>
    <input ref="inputRef" v-model="message" placeholder="Nhập text">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')
const inputRef = ref(null)

onMounted(() => {
  // Focus vào input khi mount
  inputRef.value?.focus()
})
</script>
```

---

## ⚠️ 4. Các lỗi thường gặp

### Lỗi 1: Quên cleanup

**❌ Vấn đề:**
```vue
<script setup>
onMounted(() => {
  setInterval(() => {
    // Do something
  }, 1000)
  // ❌ Quên clear interval
})
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    // Do something
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)  // ✅ Cleanup
  }
})
</script>
```

---

### Lỗi 2: Fetch data không dùng onMounted

**❌ Vấn đề:**
```vue
<script setup>
// ❌ Fetch ngay, có thể chưa có DOM
const data = await fetch('/api/data')
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const data = ref(null)

onMounted(async () => {
  // ✅ Fetch sau khi mount
  data.value = await fetch('/api/data')
})
</script>
```

---

### Lỗi 3: Access DOM trước khi mount

**❌ Vấn đề:**
```vue
<script setup>
// ❌ DOM chưa có
const element = document.getElementById('my-element')
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
import { ref, onMounted } from 'vue'

const elementRef = ref(null)

onMounted(() => {
  // ✅ DOM đã có
  console.log(elementRef.value)
})
</script>

<template>
  <div ref="elementRef">Content</div>
</template>
```

---

## 💡 5. Best Practices

### 1. Luôn cleanup trong onUnmounted

```vue
<script setup>
let timer = null

onMounted(() => {
  timer = setInterval(() => {}, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)  // ✅ Cleanup
})
</script>
```

### 2. Dùng onMounted cho async operations

```vue
<script setup>
const data = ref(null)

onMounted(async () => {
  data.value = await fetchData()  // ✅ Async trong onMounted
})
</script>
```

### 3. Dùng template refs thay vì querySelector

```vue
<!-- ✅ Tốt -->
<template>
  <input ref="inputRef" />
</template>

<script setup>
const inputRef = ref(null)
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<!-- ❌ Tránh -->
<script setup>
onMounted(() => {
  document.querySelector('input')?.focus()  // ❌ Không tốt
})
</script>
```

---

## 🧪 6. Thực hành

### Bài tập 1: Fetch Data
Tạo component:
- Fetch danh sách sản phẩm khi mount
- Hiển thị loading state
- Xử lý error

### Bài tập 2: Timer Component
Tạo component timer:
- Bắt đầu/dừng timer
- Reset timer
- Cleanup khi unmount

### Bài tập 3: Window Resize
Tạo component:
- Theo dõi window width
- Update khi resize
- Cleanup listener khi unmount

---

## 🧪 7. Mini Test

### Câu 1: onMounted chạy khi nào?
<details>
<summary>Xem đáp án</summary>
Sau khi component được gắn vào DOM.
</details>

### Câu 2: Tại sao cần cleanup trong onUnmounted?
<details>
<summary>Xem đáp án</summary>
Để tránh memory leaks, clear timers, remove event listeners.
</details>

### Câu 3: Có thể fetch data trước onMounted không?
<details>
<summary>Xem đáp án</summary>
Có thể nhưng không nên, nên fetch trong onMounted để đảm bảo DOM đã sẵn sàng.
</details>

---

## 📌 8. Quick Notes

### Lifecycle Hooks
```javascript
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

onMounted(() => {
  // Fetch data, setup listeners
})

onUnmounted(() => {
  // Cleanup
})
```

### Common Patterns
```javascript
// Fetch data
onMounted(async () => {
  data.value = await fetchData()
})

// Event listener
onMounted(() => {
  window.addEventListener('resize', handler)
})
onUnmounted(() => {
  window.removeEventListener('resize', handler)
})

// Timer
let timer = null
onMounted(() => {
  timer = setInterval(() => {}, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
```

---

**👉 Bài tiếp theo: [12_composition_api.md](./12_composition_api.md) - Composition API nâng cao**

