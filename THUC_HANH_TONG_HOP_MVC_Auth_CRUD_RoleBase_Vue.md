# 🟦 THỰC HÀNH TỔNG HỢP: HỆ THỐNG QUẢN LÝ THƯ VIỆN VỚI PHÂN QUYỀN (FRONTEND VUE)

> Phiên bản này giữ nguyên **tư tưởng, cấu trúc và minh họa** từ bản gốc,  
> chỉ thay **UI Razor** bằng **Vue (SPA)**. Backend API, JWT, Role-based vẫn giữ nguyên.

---

## 🎯 MỤC TIÊU BÀI THỰC HÀNH

Xây dựng **hệ thống quản lý thư viện điện tử hoàn chỉnh** với:
- ✅ **Phân quyền rõ ràng** theo vai trò (Role-Based Access Control - RBAC)
- ✅ **Xác thực người dùng** (Authentication) với JWT
- ✅ **Phân quyền truy cập** (Authorization) theo chức năng
- ✅ **CRUD đầy đủ** với giao diện **Vue + Vuetify**
- ✅ **Kiến trúc MVC chuẩn** tách biệt Backend API và Frontend Admin

---

## 🧒 GIẢI THÍCH DỄ HIỂU (CHO NGƯỜI MỚI BẮT ĐẦU)

> **Hệ thống thư viện** giống như một thư viện thật ngoài đời:
> - **Thủ thư trưởng** (Admin): Quản lý toàn bộ, thêm/xóa sách, quản lý nhân viên
> - **Thủ thư** (Librarian): Quản lý mượn/trả sách, xem thông tin sách
> - **Độc giả** (Reader): Chỉ xem danh sách sách, mượn sách
> - **Khách** (Guest): Chỉ xem danh sách công khai

> **Authentication (Xác thực)**: Kiểm tra "bạn là ai?" - giống như xuất trình thẻ thư viện  
> **Authorization (Phân quyền)**: Kiểm tra "bạn được làm gì?" - giống như thẻ thư viện có ghi quyền hạn

---

## 📘 PHẦN A: MÔ TẢ BÀI TOÁN & LÝ THUYẾT

## 📋 PHẦN 1: PHÂN TÍCH YÊU CẦU VÀ THIẾT KẾ HỆ THỐNG

### 1.1. Mô tả bài toán chi tiết

**Bối cảnh**: Thư viện Đại học Đà Nẵng cần một hệ thống quản lý sách điện tử.  
Hệ thống có nhiều loại người dùng với quyền hạn khác nhau.

**Các chức năng chính**:
1. **Quản lý sách** (Books): Thêm, sửa, xóa, xem danh sách sách
2. **Quản lý thể loại** (Categories): Thêm, sửa, xóa, xem danh sách thể loại
3. **Quản lý người dùng** (Users): Xem danh sách, phân quyền
4. **Đăng nhập/Đăng xuất**: Xác thực người dùng

### 1.2. Định nghĩa các vai trò (Roles) và quyền hạn

| Chức năng | Admin | Librarian | Reader | Guest (Chưa đăng nhập) |
|-----------|-------|-----------|--------|------------------------|
| **QUẢN LÝ SÁCH** |
| Xem danh sách sách | ✅ | ✅ | ✅ | ✅ (Chỉ sách công khai) |
| Xem chi tiết sách | ✅ | ✅ | ✅ | ✅ |
| Thêm sách mới | ✅ | ✅ | ❌ | ❌ |
| Sửa thông tin sách | ✅ | ✅ | ❌ | ❌ |
| Xóa sách | ✅ | ❌ | ❌ | ❌ |
| **QUẢN LÝ THỂ LOẠI** |
| Xem danh sách thể loại | ✅ | ✅ | ✅ | ✅ |
| Thêm thể loại | ✅ | ❌ | ❌ | ❌ |
| Sửa thể loại | ✅ | ❌ | ❌ | ❌ |
| Xóa thể loại | ✅ | ❌ | ❌ | ❌ |
| **QUẢN LÝ NGƯỜI DÙNG** |
| Xem danh sách user | ✅ | ❌ | ❌ | ❌ |
| Thêm user mới | ✅ | ❌ | ❌ | ❌ |
| Phân quyền user | ✅ | ❌ | ❌ | ❌ |
| Xóa user | ✅ | ❌ | ❌ | ❌ |
| **XÁC THỰC** |
| Đăng ký tài khoản | ✅ | ✅ | ✅ | ✅ |
| Đăng nhập | ✅ | ✅ | ✅ | ❌ |
| Đăng xuất | ✅ | ✅ | ✅ | ❌ |

### 1.3. Sơ đồ kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
│  - Admin UI (Vue SPA + Vuetify)                          │
│  - Login/Logout                                          │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Requests (with JWT Token)
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Vue Frontend (SPA)                          │
│  - Router Guards (Auth)                                  │
│  - Pinia Store (Token/Roles)                             │
│  - Views (Login, Categories, Books)                      │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP API Calls
                 ▼
┌─────────────────────────────────────────────────────────┐
│              ASP.NET Core API (Backend)                  │
│  - API Controllers (with [Authorize])                    │
│  - JWT Authentication Middleware                         │
│  - Role-based Authorization                              │
└────────────────┬────────────────────────────────────────┘
                 │ Entity Framework Core
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   SQL Server Database                    │
│  - Books, Categories                                     │
│  - AspNetUsers, AspNetRoles (Identity tables)            │
└─────────────────────────────────────────────────────────┘
```

---

## 📘 PHẦN B: THỰC HÀNH TỪNG BƯỚC

## 🛠️ CHUẨN BỊ (PREREQUISITES)
- Cài **.NET SDK**, **SQL Server**, **SSMS**.
- Cài **Node.js LTS**, **npm**.
- Biết cách chạy lệnh `dotnet`, `npm`.

---

## 🧭 HƯỚNG DẪN TỪNG BƯỚC (STEP-BY-STEP WALKTHROUGH)

### Step 1: Tạo CSDL bằng Migration
**Giải thích:** CSDL là nơi lưu dữ liệu thật, cần tạo trước khi chạy API.
```bash
dotnet ef migrations add InitialDb
dotnet ef database update
```
**Lưu ý:** Nếu báo lỗi kết nối SQL, kiểm tra lại **ConnectionStrings**.

### Step 2: Seed dữ liệu giả (Fake Data)
**Giải thích:** Dữ liệu fake giúp demo và test nhanh.

### Step 3: Xây dựng API + Auth + Role
**Giải thích:** API xử lý CRUD và xác thực người dùng.  
**Lưu ý:** Đảm bảo `[Authorize]` và Role hoạt động đúng.

---

## 📋 PHẦN 2: XÂY DỰNG BACKEND API VỚI PHÂN QUYỀN

> **Giữ nguyên** như bản gốc: Models, DbContext, DTOs, AutoMapper, JWT, Controllers...
> Hãy dùng trực tiếp phần Backend từ file `THUC_HANH_TONG_HOP_MVC_Auth_CRUD_RoleBase.md`.

---

## 📋 PHẦN 3: XÂY DỰNG FRONTEND VUE (THAY CHO MVC RAZOR)

## 3.1. Khởi tạo dự án Vue + Vuetify
```bash
npm create vite@latest LibraryManagement.Admin -- --template vue
cd LibraryManagement.Admin
npm install
npm add vuetify @mdi/font axios pinia vue-router
```

### 3.2. Cấu trúc thư mục gợi ý
```
src/
  main.js
  plugins/vuetify.js
  router/index.js
  stores/authStore.js
  services/api.js
  views/
    LoginPage.vue
    CategoriesPage.vue
    BooksPage.vue
  components/
    AppLayout.vue
    CategoryTable.vue
    BookTable.vue
```

### 3.3. Cấu hình Vuetify
`src/plugins/vuetify.js`
```javascript
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
})
```

`src/main.js`
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
```

### 3.4. Tạo Axios client gắn JWT
`src/services/api.js`
```javascript
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: 'https://localhost:5001', // API backend
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export default api
```

### 3.5. Pinia Store quản lý đăng nhập
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
      this.token = ''
      this.username = ''
      this.roles = []
      localStorage.clear()
    },
  },
})
```

### 3.6. Router + Guard (bảo vệ trang)
`src/router/index.js`
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import LoginPage from '../views/LoginPage.vue'
import CategoriesPage from '../views/CategoriesPage.vue'
import BooksPage from '../views/BooksPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/categories', component: CategoriesPage, meta: { auth: true } },
  { path: '/books', component: BooksPage, meta: { auth: true } },
  { path: '/', redirect: '/books' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isAuth) return '/login'
  return true
})

export default router
```

---

## 📋 PHẦN 4: XÂY DỰNG MÀN HÌNH LOGIN

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
    auth.setAuth({
      token: res.data.token,
      username: res.data.username,
      roles: res.data.roles,
    })
    router.push('/books')
  } catch (e) {
    error.value = 'Đăng nhập thất bại!'
  }
}
</script>

<template>
  <v-container class="fill-height" style="max-width: 420px;">
    <v-card class="pa-4">
      <h2 class="mb-4">Đăng nhập</h2>
      <v-text-field v-model="form.username" label="Username" />
      <v-text-field v-model="form.password" label="Password" type="password" />
      <v-btn color="primary" @click="login">Login</v-btn>
      <div v-if="error" class="text-red mt-2">{{ error }}</div>
    </v-card>
  </v-container>
</template>
```

---

## 📋 PHẦN 5: QUẢN LÝ CATEGORIES (ROLE ADMIN)

`src/views/CategoriesPage.vue`
```html
<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const items = ref([])

const load = async () => {
  const res = await api.get('/api/Categories')
  items.value = res.data
}

const remove = async (id) => {
  if (!auth.isAdmin) return
  await api.delete(`/api/Categories/${id}`)
  await load()
}

onMounted(load)
</script>

<template>
  <v-container>
    <h2>Thể loại</h2>
    <v-btn v-if="auth.isAdmin" color="primary">Thêm mới</v-btn>

    <v-data-table :items="items">
      <template v-slot:item.actions="{ item }">
        <v-btn v-if="auth.isAdmin" icon="mdi-pencil" />
        <v-btn v-if="auth.isAdmin" icon="mdi-delete" @click="remove(item.id)" />
      </template>
    </v-data-table>
  </v-container>
</template>
```

---

## 📋 PHẦN 6: QUẢN LÝ BOOKS (ADMIN + LIBRARIAN)

`src/views/BooksPage.vue`
```html
<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const items = ref([])

const load = async () => {
  const res = await api.get('/api/Books')
  items.value = res.data
}

const remove = async (id) => {
  if (!auth.isAdmin) return
  await api.delete(`/api/Books/${id}`)
  await load()
}

onMounted(load)
</script>

<template>
  <v-container>
    <h2>Sách</h2>
    <v-btn v-if="auth.isAdmin || auth.isLibrarian" color="primary">Thêm mới</v-btn>

    <v-data-table :items="items">
      <template v-slot:item.actions="{ item }">
        <v-btn v-if="auth.isAdmin || auth.isLibrarian" icon="mdi-pencil" />
        <v-btn v-if="auth.isAdmin" icon="mdi-delete" @click="remove(item.id)" />
      </template>
    </v-data-table>
  </v-container>
</template>
```

---

## 📋 PHẦN 7: TEST TOÀN BỘ HỆ THỐNG

### 7.1. Chạy Backend API
```bash
cd LibraryManagement.API
dotnet run
```

### 7.2. Chạy Frontend Vue
```bash
cd LibraryManagement.Admin
npm run dev
```

### 7.3. Test Case
- Login Admin → xem, thêm, sửa, xóa Categories và Books.
- Login Librarian → chỉ thêm/sửa Books, không xóa.
- Guest → không vào được `/books`, `/categories`.

---

## ✅ CHECKLIST
- [ ] API chạy được
- [ ] Login thành công, nhận JWT
- [ ] Admin thấy đủ CRUD
- [ ] Librarian không thấy nút Xóa
- [ ] Guest bị chặn bởi Router Guard

---

## 🎯 KẾT LUẬN

Phiên bản Vue giữ nguyên tư tưởng **RBAC + JWT + CRUD** nhưng thay giao diện Razor bằng **Vue SPA**.  
Nhờ Pinia + Router Guard + Axios interceptor, việc phân quyền UI trở nên rõ ràng và dễ mở rộng.

---

**📚 TÀI LIỆU THAM KHẢO**
- [Vue 3](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
