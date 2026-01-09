# 🟩 TUẦN 9: AUTHENTICATION (FRONTEND)

## 🎯 Mục tiêu
- Thiết kế trang Login đẹp mắt.
- Gọi API Login và lưu Token vào LocalStorage.
- Bảo vệ Router (Navigation Guards).

---

## 🚪 1. Login Logic

### 🎬 Ví dụ dẫn nhập: Trang đăng nhập như Facebook/Shopee

Hãy tưởng tượng bạn đang xây dựng trang **đăng nhập** cho website:

**Tình huống thực tế:**
- User nhập email và password
- Click "Đăng nhập" → Gọi API
- Nếu thành công → Lưu token, chuyển đến trang chủ
- Nếu thất bại → Hiển thị lỗi
- Sau khi đăng nhập → Hiển thị tên user, nút "Đăng xuất"
- Refresh trang → Vẫn giữ trạng thái đăng nhập (nhờ token trong localStorage)

**Vấn đề:**
- Làm sao lưu token để dùng cho các request sau?
- Làm sao biết user đã đăng nhập hay chưa?
- Làm sao bảo vệ routes (chỉ user đã đăng nhập mới vào được)?

**Giải pháp:**
- Pinia Store: Quản lý state đăng nhập
- LocalStorage: Lưu token để persist
- Router Guards: Bảo vệ routes

Sử dụng `authStore` (Pinia) để xử lý logic đăng nhập.

### 🌐 Liên hệ thực tế

**Authentication được dùng ở mọi website:**
- **Facebook, Gmail**: Đăng nhập để truy cập tài khoản
- **Shopee, Tiki**: Đăng nhập để mua hàng, xem đơn hàng
- **Banking App**: Đăng nhập với OTP, 2FA
- **Admin Panel**: Đăng nhập để quản lý hệ thống

**Tất cả đều cần Authentication!**

### 1.1. Cập nhật Store (`stores/auth.js`)
```javascript
import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('accessToken') || null
    }),
    
    actions: {
        async login(credentials) {
            try {
                const response = await axios.post('/auth/login', credentials);
                
                // 1. Lưu token
                this.token = response.token;
                localStorage.setItem('accessToken', this.token);
                
                // 2. Chuyển hướng vào Admin
                router.push('/admin/dashboard');
            } catch (error) {
                throw error; // Ném lỗi ra để Component hiển thị
            }
        },
        
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('accessToken');
            router.push('/login');
        }
    }
});
```

---

## 🛡️ 2. Route Protection

Ngăn chặn người dùng chưa đăng nhập truy cập vào `/admin`.

### 2.1. Navigation Guard (`router/index.js`)

```javascript
router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('accessToken');

    if (authRequired && !loggedIn) {
        // Nếu cần auth mà chưa login -> Đá về login
        return next('/login');
    }

    next();
});
```

---

## 🧪 3. Thực hành

1. Tạo `views/public/LoginPage.vue` với form Username/Password.
2. Gọi `authStore.login()` khi submit form.
3. Thử truy cập trực tiếp `/admin/dashboard` khi chưa login -> Phải bị đẩy về Login.
4. Login thành công -> Phải vào được Dashboard.
5. F5 lại trang -> Vẫn phải giữ trạng thái đăng nhập (nhờ LocalStorage).

---

## 🎯 3. Case Study: Xây dựng Authentication Flow hoàn chỉnh

### Mô tả tình huống

Xây dựng hệ thống đăng nhập/đăng ký hoàn chỉnh trên Frontend, tương tự như **Shopee** hoặc **Facebook**.

### Yêu cầu

- Trang đăng ký với validation
- Trang đăng nhập với error handling
- Lưu token vào localStorage
- Bảo vệ routes (chỉ user đã đăng nhập mới vào được)
- Hiển thị thông tin user
- Đăng xuất và clear token

### Implementation

**1. Auth Store (`stores/auth.js`):**
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios'
import router from '@/router'
import jwt_decode from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  
  const userRole = computed(() => {
    if (!token.value) return null
    try {
      const decoded = jwt_decode(token.value)
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User'
    } catch {
      return null
    }
  })

  const isAdmin = computed(() => userRole.value === 'Admin')

  // Actions
  async function login(credentials) {
    loading.value = true
    try {
      const response = await axios.post('/auth/login', credentials)
      
      // Lưu token
      token.value = response.token
      localStorage.setItem('token', response.token)
      
      // Lưu user info
      user.value = response.user
      
      // Decode token để lấy thông tin
      const decoded = jwt_decode(response.token)
      user.value = {
        id: decoded.nameid,
        email: decoded.email,
        fullName: decoded.fullName,
        role: userRole.value
      }
      
      // Chuyển hướng
      const redirect = router.currentRoute.value.query.redirect || '/admin/dashboard'
      router.push(redirect)
      
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      const response = await axios.post('/auth/register', userData)
      
      // Tự động đăng nhập sau khi đăng ký
      token.value = response.token
      localStorage.setItem('token', response.token)
      user.value = response.user
      
      router.push('/admin/dashboard')
      
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    try {
      const response = await axios.get('/auth/me')
      user.value = response
    } catch (error) {
      // Token không hợp lệ, logout
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Initialize: Load user nếu có token
  function init() {
    if (token.value) {
      fetchUser()
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    userRole,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    init
  }
})
```

**2. Login Page (`views/public/LoginPage.vue`):**
```vue
<template>
  <div class="login-page">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-6">
            <h2 class="text-center mb-6">Đăng nhập</h2>
            
            <!-- Error Alert -->
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              closable
              @click:close="error = null"
            >
              {{ error }}
            </v-alert>
            
            <!-- Success Alert (sau khi đăng ký) -->
            <v-alert
              v-if="successMessage"
              type="success"
              class="mb-4"
            >
              {{ successMessage }}
            </v-alert>
            
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :error-messages="errors.email"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="form.password"
                label="Mật khẩu"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :error-messages="errors.password"
                required
                class="mb-3"
              />
              
              <div class="d-flex justify-space-between align-center mb-4">
                <v-checkbox
                  v-model="rememberMe"
                  label="Ghi nhớ đăng nhập"
                  density="compact"
                />
                <a href="#" class="text-caption">Quên mật khẩu?</a>
              </div>
              
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="authStore.loading"
                :disabled="!isFormValid"
              >
                Đăng nhập
              </v-btn>
            </v-form>
            
            <div class="text-center mt-4">
              <p>Chưa có tài khoản? 
                <router-link to="/register">Đăng ký ngay</router-link>
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const error = ref(null)
const rememberMe = ref(false)
const successMessage = ref(null)

const isFormValid = computed(() => {
  return form.value.email && form.value.password
})

onMounted(() => {
  // Hiển thị message nếu vừa đăng ký thành công
  if (route.query.registered === 'true') {
    successMessage.value = 'Đăng ký thành công! Vui lòng đăng nhập.'
    setTimeout(() => {
      successMessage.value = null
    }, 5000)
  }
})

async function handleLogin() {
  errors.value = {}
  error.value = null
  
  // Validation
  if (!form.value.email) {
    errors.value.email = 'Email là bắt buộc'
  } else if (!form.value.email.includes('@')) {
    errors.value.email = 'Email không hợp lệ'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Mật khẩu là bắt buộc'
  }
  
  if (Object.keys(errors.value).length > 0) {
    return
  }
  
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    // Login thành công, router guard sẽ chuyển hướng
  } catch (err) {
    error.value = err.message
  }
}
</script>
```

**3. Register Page (`views/public/RegisterPage.vue`):**
```vue
<template>
  <div class="register-page">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-6">
            <h2 class="text-center mb-6">Đăng ký</h2>
            
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
            >
              {{ error }}
            </v-alert>
            
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="form.fullName"
                label="Họ và tên"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :error-messages="errors.fullName"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :error-messages="errors.email"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="form.password"
                label="Mật khẩu"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :error-messages="errors.password"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="form.confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                :error-messages="errors.confirmPassword"
                required
                class="mb-3"
              />
              
              <v-checkbox
                v-model="form.agree"
                label="Tôi đồng ý với điều khoản sử dụng"
                :error-messages="errors.agree"
                required
                class="mb-4"
              />
              
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="authStore.loading"
                :disabled="!isFormValid"
              >
                Đăng ký
              </v-btn>
            </v-form>
            
            <div class="text-center mt-4">
              <p>Đã có tài khoản? 
                <router-link to="/login">Đăng nhập</router-link>
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const errors = ref({})
const error = ref(null)

const isFormValid = computed(() => {
  return form.value.fullName &&
         form.value.email &&
         form.value.password &&
         form.value.password === form.value.confirmPassword &&
         form.value.agree
})

async function handleRegister() {
  errors.value = {}
  error.value = null
  
  // Validation
  if (!form.value.fullName) {
    errors.value.fullName = 'Họ tên là bắt buộc'
  }
  
  if (!form.value.email) {
    errors.value.email = 'Email là bắt buộc'
  } else if (!form.value.email.includes('@')) {
    errors.value.email = 'Email không hợp lệ'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Mật khẩu là bắt buộc'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu không khớp'
  }
  
  if (!form.value.agree) {
    errors.value.agree = 'Bạn phải đồng ý với điều khoản'
  }
  
  if (Object.keys(errors.value).length > 0) {
    return
  }
  
  try {
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      fullName: form.value.fullName
    })
    // Register thành công, tự động login và chuyển hướng
  } catch (err) {
    error.value = err.message
    // Parse backend validation errors
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    }
  }
}
</script>
```

**4. Router Guards (`router/guards.js`):**
```javascript
import { useAuthStore } from '@/stores/auth'

export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // Public routes
    const publicRoutes = ['/login', '/register', '/']
    if (publicRoutes.includes(to.path)) {
      // Nếu đã đăng nhập, redirect về dashboard
      if (authStore.isAuthenticated && to.path === '/login') {
        next('/admin/dashboard')
      } else {
        next()
      }
      return
    }
    
    // Protected routes
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Role-based routes
    if (to.meta.role && authStore.userRole !== to.meta.role) {
      next({ path: '/forbidden' })
      return
    }
    
    next()
  })
}
```

**5. Axios Interceptor (`utils/axios.js`):**
```javascript
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://localhost:5001/api',
  timeout: 10000
})

// Request interceptor: Thêm token vào header
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Xử lý lỗi 401
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
```

**Giải thích:**
- **Auth Store**: Quản lý state đăng nhập, token, user
- **Login/Register Pages**: Form với validation đầy đủ
- **Router Guards**: Bảo vệ routes, redirect khi chưa đăng nhập
- **Axios Interceptor**: Tự động thêm token, xử lý 401
- **Token Persistence**: Lưu vào localStorage, restore khi reload

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Token không được gửi
**❌ Vấn đề:** API trả 401  
**✅ Giải pháp:** Kiểm tra interceptor có thêm token vào header không.

### Lỗi 2: Guard không hoạt động
**❌ Vấn đề:** Vẫn vào được protected route  
**✅ Giải pháp:** Kiểm tra logic trong `beforeEach`, đảm bảo check token đúng.

### Lỗi 3: Mất token khi refresh
**❌ Vấn đề:** Phải login lại  
**✅ Giải pháp:** Load token từ localStorage khi app khởi động.

---

## 💡 5. Best Practices

- Lưu token vào localStorage
- Auto logout khi token hết hạn
- Redirect về trang trước sau login
- Show loading khi đang login
- Validate form trước khi submit

---

## 📝 6. Bài tập thực hành

1. Thêm "Remember me" checkbox
2. Thêm forgot password
3. Thêm auto refresh token
4. Thêm logout all devices
5. Thêm session timeout warning

---

## 🧪 7. Mini Test

### Câu 1: Navigation Guard là gì?
<details>
<summary>Xem đáp án</summary>
Hàm chạy trước khi navigate, dùng để check auth.
</details>

### Câu 2: Làm sao persist login state?
<details>
<summary>Xem đáp án</summary>
Lưu token vào localStorage, load lại khi app start.
</details>

---

## 📌 8. Quick Notes

### Auth Store
```javascript
const token = ref(localStorage.getItem('token'))
async function login(creds) {
  const res = await axios.post('/auth/login', creds)
  token.value = res.token
  localStorage.setItem('token', res.token)
}
```

### Route Guard
```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})
```