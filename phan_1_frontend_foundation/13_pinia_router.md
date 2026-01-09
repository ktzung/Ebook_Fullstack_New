# 🟦 TUẦN 2: ROUTING & STATE MANAGEMENT

## 🎯 Mục tiêu
- Cấu hình Vue Router để điều hướng trang.
- Sử dụng Nested Routes cho Layout.
- Quản lý trạng thái toàn cục với Pinia.

---

## 🛣️ 1. Vue Router & Layouts

### 🧠 Giải thích chi tiết

Vue Router là thư viện routing chính thức của Vue.js, giúp xây dựng Single Page Application (SPA) với điều hướng trang mượt mà.

**Tại sao cần Vue Router?**
- ✅ Điều hướng giữa các trang mà không reload
- ✅ Quản lý URL và history (back/forward button)
- ✅ Bảo vệ routes (authentication, authorization)
- ✅ Lazy loading components (tối ưu performance)
- ✅ Nested routes cho layout phức tạp

Trong một ứng dụng thực tế, ta thường có nhiều Layout khác nhau (VD: Trang Admin có Sidebar, Trang User có Menu ngang).

### 1.1. Tạo Layout Components

**`layouts/AdminLayout.vue`**:
```html
<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <nav>
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        <RouterLink to="/admin/products">Sản phẩm</RouterLink>
        <RouterLink to="/admin/orders">Đơn hàng</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <RouterView /> <!-- Nội dung thay đổi ở đây -->
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
```

**`layouts/PublicLayout.vue`**:
```html
<template>
  <div class="public-layout">
    <header class="header">
      <nav>
        <RouterLink to="/">Trang chủ</RouterLink>
        <RouterLink to="/products">Sản phẩm</RouterLink>
        <RouterLink to="/about">Giới thiệu</RouterLink>
        <RouterLink to="/login">Đăng nhập</RouterLink>
      </nav>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>&copy; 2025 DNU Shop. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}

.main-content {
  flex: 1;
}

.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
```

**Giải thích:**
- `<RouterView />` là component đặc biệt của Vue Router, nơi hiển thị component tương ứng với route hiện tại
- Layout component bao bọc các route con (children routes)
- Mỗi layout có thể có header, sidebar, footer riêng

### 1.2. Cấu hình Router (`router/index.js`)

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  // History mode: tạo URL đẹp (không có #)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Routes
    {
      path: '/',
      component: PublicLayout,
      children: [
        { 
          path: '', 
          name: 'home',
          component: () => import('@/views/public/HomePage.vue') 
        },
        { 
          path: 'login', 
          name: 'login',
          component: () => import('@/views/public/LoginPage.vue') 
        },
        { 
          path: 'products', 
          name: 'products',
          component: () => import('@/views/public/ProductListPage.vue') 
        },
        { 
          path: 'products/:id', 
          name: 'product-detail',
          component: () => import('@/views/public/ProductDetailPage.vue'),
          props: true // Truyền params như props
        }
      ]
    },
    // Admin Routes
    {
      path: '/admin',
      component: AdminLayout,
      // Meta để bảo vệ route (sẽ học ở bài sau)
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { 
          path: '', 
          redirect: '/admin/dashboard' // Redirect mặc định
        },
        { 
          path: 'dashboard', 
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardPage.vue') 
        },
        { 
          path: 'products', 
          name: 'admin-products',
          component: () => import('@/views/admin/ProductPage.vue') 
        },
        { 
          path: 'orders', 
          name: 'admin-orders',
          component: () => import('@/views/admin/OrderPage.vue') 
        }
      ]
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue')
    }
  ]
})

// Navigation Guards (sẽ học ở bài sau)
router.beforeEach((to, from, next) => {
  // Logic kiểm tra authentication
  next()
})

export default router
```

**Giải thích các khái niệm:**

1. **History Mode:**
   - `createWebHistory()`: URL đẹp như `/admin/dashboard` (cần server config)
   - `createWebHashHistory()`: URL có # như `/#/admin/dashboard` (không cần server config)

2. **Lazy Loading:**
   - `() => import('@/views/...')`: Chỉ load component khi cần (tối ưu performance)
   - Giảm bundle size ban đầu

3. **Named Routes:**
   - `name: 'home'`: Đặt tên route để dễ navigate
   - `router.push({ name: 'home' })` thay vì `router.push('/')`

4. **Route Params:**
   - `path: 'products/:id'`: Dynamic route với parameter
   - Truy cập: `$route.params.id` hoặc `props: true` để nhận như props

5. **Redirect:**
   - `redirect: '/admin/dashboard'`: Tự động chuyển hướng

### 1.3. Sử dụng Router trong Component

**Navigation với RouterLink:**
```html
<template>
  <nav>
    <!-- Cách 1: Dùng path -->
    <RouterLink to="/">Trang chủ</RouterLink>
    
    <!-- Cách 2: Dùng named route -->
    <RouterLink :to="{ name: 'products' }">Sản phẩm</RouterLink>
    
    <!-- Cách 3: Dùng params -->
    <RouterLink :to="{ name: 'product-detail', params: { id: 123 } }">
      Chi tiết sản phẩm
    </RouterLink>
    
    <!-- Cách 4: Dùng query -->
    <RouterLink :to="{ path: '/products', query: { page: 1, search: 'laptop' } }">
      Tìm kiếm
    </RouterLink>
  </nav>
</template>
```

**Programmatic Navigation:**
```javascript
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navigate
function goToHome() {
  router.push('/')
  // hoặc
  router.push({ name: 'home' })
}

// Go back
function goBack() {
  router.back()
}

// Go forward
function goForward() {
  router.forward()
}

// Replace (không thêm vào history)
function replaceRoute() {
  router.replace('/login')
}

// Lấy params/query từ URL
console.log(route.params.id)      // Từ /products/:id
console.log(route.query.page)      // Từ ?page=1
</script>
```

---

## 🍍 2. Pinia State Management

### 🧠 Giải thích chi tiết

Pinia là thư viện quản lý state chính thức của Vue 3, thay thế Vuex. Pinia giúp chia sẻ dữ liệu giữa các component (ví dụ: thông tin User đăng nhập, Giỏ hàng).

**Tại sao cần Pinia?**
- ✅ Quản lý state toàn cục (global state)
- ✅ Chia sẻ data giữa nhiều component
- ✅ DevTools support tốt
- ✅ TypeScript support tốt
- ✅ Code splitting tự động
- ✅ Dễ test và maintain

**Khi nào dùng Pinia?**
- State cần chia sẻ giữa nhiều component
- State phức tạp, cần quản lý tập trung
- Cần persistence (lưu vào localStorage)
- Cần logic phức tạp (async actions, computed)

**Khi KHÔNG cần Pinia?**
- State chỉ dùng trong 1 component → dùng `ref()`/`reactive()`
- State chỉ truyền từ parent → child → dùng `props`/`emit`

### 2.1. Định nghĩa Store (`stores/auth.js`)

**Setup Syntax (Composition API style):**

```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  // Getters (Computed)
  const userRole = computed(() => user.value?.role || 'guest')
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  function login(userData, authToken) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Async Action
  async function fetchUser() {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      const userData = await response.json()
      user.value = userData
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout() // Logout nếu token không hợp lệ
    }
  }

  // Initialize từ localStorage
  function init() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return { 
    // State
    user, 
    token,
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    // Actions
    login, 
    logout,
    fetchUser,
    init
  }
})
```

**Options Syntax (Vuex style - tùy chọn):**

```javascript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || 'guest'
  },
  
  actions: {
    login(userData, authToken) {
      this.user = userData
      this.token = authToken
    },
    
    logout() {
      this.user = null
      this.token = null
    }
  }
})
```

**Khuyến nghị:** Dùng Setup Syntax vì tương thích tốt với Composition API và TypeScript.

### 2.2. Sử dụng trong Component

**Cách 1: Sử dụng trực tiếp (Reactive)**

```html
<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()

// Destructure để dùng trực tiếp (giữ reactivity)
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore)

function handleLogin() {
  authStore.login(
    { name: 'Admin', role: 'admin', email: 'admin@dnu.edu.vn' },
    'jwt-token-here'
  )
}

function handleLogout() {
  authStore.logout()
}
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Xin chào, {{ user.name }}</p>
    <p>Role: {{ authStore.userRole }}</p>
    <p v-if="isAdmin">Bạn là Admin</p>
    <button @click="handleLogout">Đăng xuất</button>
  </div>
  <button v-else @click="handleLogin">Đăng nhập</button>
</template>
```

**Cách 2: Sử dụng với computed (Khi cần transform data)**

```html
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const displayName = computed(() => {
  return authStore.user 
    ? `${authStore.user.name} (${authStore.user.email})`
    : 'Guest'
})
</script>

<template>
  <p>{{ displayName }}</p>
</template>
```

**Cách 3: Sử dụng trong nhiều component**

```html
<!-- Component A -->
<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<!-- Component B -->
<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore() // Cùng instance, state được chia sẻ
</script>
```

### 2.3. Ví dụ Store phức tạp: Shopping Cart

**`stores/cart.js`:**

```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  
  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
  })
  
  const isEmpty = computed(() => items.value.length === 0)
  
  // Actions
  function addItem(product) {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    }
    
    // Lưu vào localStorage
    saveToLocalStorage()
  }
  
  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveToLocalStorage()
  }
  
  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
    saveToLocalStorage()
  }
  
  function clearCart() {
    items.value = []
    saveToLocalStorage()
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  function loadFromLocalStorage() {
    const saved = localStorage.getItem('cart')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }
  
  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadFromLocalStorage
  }
})
```

**Sử dụng trong component:**

```html
<script setup>
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { items, totalItems, totalPrice } = storeToRefs(cartStore)

// Load cart khi component mount
onMounted(() => {
  cartStore.loadFromLocalStorage()
})

function addToCart(product) {
  cartStore.addItem(product)
}
</script>

<template>
  <div>
    <p>Giỏ hàng: {{ totalItems }} sản phẩm</p>
    <p>Tổng tiền: {{ totalPrice.toLocaleString('vi-VN') }} đ</p>
    
    <div v-for="item in items" :key="item.id">
      <p>{{ item.name }} - {{ item.quantity }}x</p>
      <button @click="cartStore.removeItem(item.id)">Xóa</button>
    </div>
  </div>
</template>
```

---

## 🧪 3. Thực hành

1. Cài đặt Router như hướng dẫn trên.
2. Tạo 2 Layout: Admin và Public.
3. Tạo Store `counter` đơn giản để test Pinia.
4. Chạy thử: Vào `/` thấy PublicLayout, vào `/admin/dashboard` thấy AdminLayout.

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Quên import RouterLink/RouterView

**❌ Vấn đề:**
```html
<template>
  <Link to="/">Home</Link> <!-- ❌ SAI -->
</template>
```

**✅ Giải pháp:**
```html
<template>
  <RouterLink to="/">Home</RouterLink> <!-- ✅ ĐÚNG -->
</template>
```

**🔍 Giải thích:** Phải dùng `RouterLink` và `RouterView` từ vue-router, không phải HTML thông thường.

---

### Lỗi 2: Quên dùng storeToRefs khi destructure

**❌ Vấn đề:**
```javascript
const authStore = useAuthStore()
const { user, isAuthenticated } = authStore // ❌ Mất reactivity
```

**✅ Giải pháp:**
```javascript
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore) // ✅ Giữ reactivity
```

**🔍 Giải thích:** Destructuring thông thường làm mất reactivity. Dùng `storeToRefs()` để giữ reactivity.

---

### Lỗi 3: Sử dụng router trước khi mount

**❌ Vấn đề:**
```javascript
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/login') // ❌ Có thể lỗi nếu chưa mount
</script>
```

**✅ Giải pháp:**
```javascript
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.push('/login') // ✅ Đúng
})
</script>
```

**🔍 Giải thích:** Router chỉ sẵn sàng sau khi app mount. Dùng trong `onMounted()` hoặc event handler.

---

### Lỗi 4: Quên return trong Setup Store

**❌ Vấn đề:**
```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  // ❌ Quên return
})
```

**✅ Giải pháp:**
```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  return { user } // ✅ Phải return
})
```

**🔍 Giải thích:** Setup function phải return object chứa state/getters/actions để expose ra ngoài.

---

### Lỗi 5: Sử dụng this trong Setup Store

**❌ Vấn đề:**
```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  function login() {
    this.user = {} // ❌ SAI - Không có this
  }
})
```

**✅ Giải pháp:**
```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  function login() {
    user.value = {} // ✅ ĐÚNG - Truy cập trực tiếp
  }
  
  return { user, login }
})
```

**🔍 Giải thích:** Setup syntax không có `this`, truy cập biến trực tiếp.

---

### Lỗi 6: Route không match do cấu hình sai

**❌ Vấn đề:**
```javascript
{
  path: '/admin',
  children: [
    { path: 'dashboard' } // ❌ Sẽ thành /dashboard (thiếu /admin)
  ]
}
```

**✅ Giải pháp:**
```javascript
{
  path: '/admin',
  children: [
    { path: 'dashboard' } // ✅ Sẽ thành /admin/dashboard (tự động kế thừa)
    // hoặc
    { path: '/admin/dashboard' } // ✅ Absolute path
  ]
}
```

**🔍 Giải thích:** Children routes tự động kế thừa path của parent. Dùng absolute path nếu muốn override.

---

## 💡 5. Best Practices

### 5.1. Tổ chức Router

**Cấu trúc thư mục:**
```
router/
├── index.js           # Router chính
├── routes/
│   ├── public.js      # Public routes
│   ├── admin.js       # Admin routes
│   └── auth.js        # Auth routes
└── guards.js          # Navigation guards
```

**Ví dụ tách routes:**

```javascript
// router/routes/public.js
export const publicRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', component: () => import('@/views/public/HomePage.vue') }
    ]
  }
]

// router/index.js
import { publicRoutes } from './routes/public'
import { adminRoutes } from './routes/admin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...publicRoutes,
    ...adminRoutes
  ]
})
```

### 5.2. Tổ chức Pinia Stores

**Cấu trúc thư mục:**
```
stores/
├── index.js           # Pinia instance
├── auth.js            # Auth store
├── cart.js            # Cart store
├── product.js         # Product store
└── ui.js              # UI state (loading, theme)
```

**Tạo Pinia instance:**

```javascript
// stores/index.js
import { createPinia } from 'pinia'

export const pinia = createPinia()

// main.js
import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

### 5.3. Navigation Guards

```javascript
// router/guards.js
export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // Kiểm tra authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // Kiểm tra authorization
    if (to.meta.role && authStore.userRole !== to.meta.role) {
      next({ name: 'forbidden' })
      return
    }
    
    next()
  })
  
  router.afterEach((to, from) => {
    // Log analytics, update title, etc.
    document.title = to.meta.title || 'DNU Shop'
  })
}
```

### 5.4. Persist State với Pinia Plugin

```javascript
// stores/plugins/persist.js
export function persistPlugin({ store }) {
  const key = `pinia-${store.$id}`
  
  // Load từ localStorage
  const saved = localStorage.getItem(key)
  if (saved) {
    store.$patch(JSON.parse(saved))
  }
  
  // Lưu mỗi khi state thay đổi
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}

// stores/index.js
import { createPinia } from 'pinia'
import { persistPlugin } from './plugins/persist'

const pinia = createPinia()
pinia.use(persistPlugin)
```

---

## 🎯 6. Case Study: Xây dựng Navigation với Auth

### Mô tả
Xây dựng hệ thống navigation thông minh:
- Hiển thị menu khác nhau cho user đã đăng nhập/chưa đăng nhập
- Bảo vệ admin routes
- Redirect sau khi login

### Implementation

**`components/Navigation.vue`:**

```html
<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore)

const publicMenu = [
  { name: 'Trang chủ', to: { name: 'home' } },
  { name: 'Sản phẩm', to: { name: 'products' } }
]

const userMenu = computed(() => {
  const menu = [...publicMenu]
  
  if (isAuthenticated.value) {
    menu.push({ name: 'Giỏ hàng', to: { name: 'cart' } })
    menu.push({ name: 'Đơn hàng', to: { name: 'orders' } })
    
    if (isAdmin.value) {
      menu.push({ name: 'Admin', to: { name: 'admin-dashboard' } })
    }
  }
  
  return menu
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <nav class="navigation">
    <RouterLink 
      v-for="item in userMenu" 
      :key="item.name"
      :to="item.to"
      :class="{ active: route.name === item.to.name }"
    >
      {{ item.name }}
    </RouterLink>
    
    <div v-if="isAuthenticated" class="user-section">
      <span>Xin chào, {{ user.name }}</span>
      <button @click="handleLogout">Đăng xuất</button>
    </div>
    <RouterLink v-else :to="{ name: 'login' }">
      Đăng nhập
    </RouterLink>
  </nav>
</template>
```

**`router/guards.js`:**

```javascript
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // Public routes - cho phép tất cả
    if (!to.meta.requiresAuth) {
      next()
      return
    }
    
    // Protected routes
    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Role-based access
    if (to.meta.role && authStore.userRole !== to.meta.role) {
      next({ name: 'forbidden' })
      return
    }
    
    next()
  })
}
```

---

## 📝 7. Bài tập thực hành

### Bài 1: Tạo Navigation Component
Tạo component navigation với:
- Menu động dựa trên authentication state
- Highlight route hiện tại
- Dropdown menu cho user (Profile, Settings, Logout)

### Bài 2: Protected Routes
Tạo hệ thống bảo vệ routes:
- Route `/admin/*` chỉ admin mới vào được
- Route `/profile` chỉ user đã đăng nhập
- Redirect về trang trước sau khi login

### Bài 3: Shopping Cart Store
Tạo store quản lý giỏ hàng:
- Thêm/xóa/sửa sản phẩm
- Tính tổng tiền, số lượng
- Lưu vào localStorage
- Restore khi reload trang

### Bài 4: Breadcrumb Component
Tạo component breadcrumb:
- Hiển thị đường dẫn hiện tại
- Click vào breadcrumb để navigate
- Tự động generate từ route meta

### Bài 5: Multi-step Form với Router
Tạo form nhiều bước:
- Mỗi bước là một route
- Validate trước khi chuyển bước
- Lưu data vào store
- Progress indicator

---

## 🧪 8. Mini Test

### Câu 1: Vue Router dùng để làm gì?
<details>
<summary>Xem đáp án</summary>

Điều hướng trang trong SPA, quản lý URL và history, bảo vệ routes.
</details>

### Câu 2: `<RouterView />` là gì?
<details>
<summary>Xem đáp án</summary>

Component đặc biệt của Vue Router, nơi hiển thị component tương ứng với route hiện tại.
</details>

### Câu 3: Lazy loading component trong router là gì?
<details>
<summary>Xem đáp án</summary>

Dùng `() => import('@/views/...')` để chỉ load component khi cần, giảm bundle size ban đầu.
</details>

### Câu 4: Pinia khác gì so với Vuex?
<details>
<summary>Xem đáp án</summary>

Pinia là thư viện mới hơn, đơn giản hơn, TypeScript support tốt hơn, không cần modules.
</details>

### Câu 5: Khi nào cần dùng `storeToRefs()`?
<details>
<summary>Xem đáp án</summary>

Khi destructure state/getters từ store để giữ reactivity.
</details>

### Câu 6: Setup Store và Options Store khác nhau như thế nào?
<details>
<summary>Xem đáp án</summary>

Setup Store dùng Composition API style (ref, computed), Options Store dùng object với state/getters/actions.
</details>

### Câu 7: Navigation Guards là gì?
<details>
<summary>Xem đáp án</summary>

Hàm chạy trước/sau khi navigate, dùng để kiểm tra auth, log analytics, v.v.
</details>

### Câu 8: Nested Routes là gì?
<details>
<summary>Xem đáp án</summary>

Routes con (children) kế thừa layout từ parent route, dùng cho layout phức tạp.
</details>

### Câu 9: Làm sao truyền params từ route vào component?
<details>
<summary>Xem đáp án</summary>

Dùng `props: true` trong route config, hoặc truy cập `$route.params` trong component.
</details>

### Câu 10: Làm sao persist Pinia store vào localStorage?
<details>
<summary>Xem đáp án</summary>

Dùng Pinia plugin hoặc subscribe `$subscribe` để lưu mỗi khi state thay đổi.
</details>

---

## 📌 9. Quick Notes

### Vue Router Syntax
```javascript
// Router config
const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})

// Navigation
router.push('/path')
router.push({ name: 'route-name' })
router.back()
router.replace('/path')

// Route info
const route = useRoute()
route.params.id
route.query.page
route.meta.title
```

### Pinia Syntax
```javascript
// Define store
export const useStore = defineStore('id', () => {
  const state = ref(0)
  const getter = computed(() => state.value * 2)
  function action() { state.value++ }
  return { state, getter, action }
})

// Use store
const store = useStore()
const { state } = storeToRefs(store)
store.action()
```

### Navigation Guards
```javascript
router.beforeEach((to, from, next) => {
  // Check auth
  if (to.meta.requiresAuth && !isAuth) {
    next('/login')
  } else {
    next()
  }
})
```

### Best Practices
- ✅ Dùng named routes thay vì path
- ✅ Lazy load components
- ✅ Tách routes thành modules
- ✅ Dùng `storeToRefs()` khi destructure
- ✅ Persist state quan trọng
