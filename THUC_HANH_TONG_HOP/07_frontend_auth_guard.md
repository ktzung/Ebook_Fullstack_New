# 🟦 BÀI 07: ĐĂNG NHẬP + PINIA + ROUTER GUARD

## 🎯 Mục tiêu
- Login lấy JWT.
- Lưu token/roles bằng Pinia.
- Chặn route khi chưa đăng nhập.

---

## 1) Axios interceptor
Tự gắn `Authorization: Bearer <token>` cho mọi request.

## 2) Pinia auth store
State: `token`, `username`, `roles`  
Getters: `isAuth`, `isAdmin`, `isLibrarian`

## 3) Router guard
Route cần login → chuyển `/login`.

---

## ✅ Checkpoint
- [ ] Login OK, token lưu localStorage.
- [ ] Logout xóa token.
- [ ] Route bảo vệ hoạt động.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: Axios client có interceptor
`src/services/api.js`
```javascript
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({ baseURL: 'https://localhost:5001' })

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

export default api
```

### Step 2: Pinia auth store
`src/stores/authStore.js`
```javascript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    roles: JSON.parse(localStorage.getItem('roles') || '[]'),
    username: localStorage.getItem('username') || '',
  }),
  getters: {
    isAuth: (s) => !!s.token,
    isAdmin: (s) => s.roles.includes('Admin'),
    isLibrarian: (s) => s.roles.includes('Librarian'),
  },
  actions: {
    setAuth({ token, username, roles }) {
      this.token = token
      this.username = username
      this.roles = roles
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      localStorage.setItem('roles', JSON.stringify(roles))
    },
    logout() {
      localStorage.clear()
      this.token = ''
      this.username = ''
      this.roles = []
    },
  },
})
```

### Step 3: Router guard
`src/router/index.js`
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import LoginPage from '../views/LoginPage.vue'
import BooksPage from '../views/BooksPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/books', component: BooksPage, meta: { auth: true } },
  { path: '/', redirect: '/books' },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isAuth) return '/login'
  return true
})

export default router
```

### Step 4: Login view
`src/views/LoginPage.vue`
```html
<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ username: '', password: '' })
const error = ref('')

const login = async () => {
  try {
    const res = await api.post('/api/Auth/login', form.value)
    auth.setAuth({ token: res.data.token, username: res.data.username, roles: res.data.roles })
    router.push('/books')
  } catch {
    error.value = 'Sai tài khoản hoặc mật khẩu'
  }
}
</script>
```

### Step 5: Thông tin tài khoản demo
- Admin: `admin / Admin123!`
- Librarian: `librarian1 / Lib123!`
- Reader: `reader1 / Reader123!`
