# 🟦 TUẦN 4: HTTP CLIENT & API SERVICE

## 🎯 Mục tiêu
- Cài đặt Axios.
- Cấu hình Interceptors để xử lý Token tự động.
- Áp dụng Service Pattern để tách biệt logic gọi API.

---

## 📡 1. Axios Setup

**Axios** là thư viện phổ biến nhất để gọi API.

### 1.1. Cài đặt
```powershell
npm add axios
```

### 1.2. Tạo Instance (`utils/axios.js`)
Thay vì gọi `axios.get()` trực tiếp, ta tạo một instance chung để cấu hình Base URL.

```javascript
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:5001/api', // URL của Backend .NET
    timeout: 10000, // 10 giây
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Chạy trước khi gửi request
instance.interceptors.request.use(config => {
    // Lấy token từ LocalStorage gửi kèm
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: Chạy sau khi nhận response
instance.interceptors.response.use(
    response => response.data, // Chỉ lấy phần data
    error => {
        // Xử lý lỗi chung (VD: 401 thì logout)
        if (error.response && error.response.status === 401) {
            // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default instance;
```

---

## 🧱 2. Service Pattern

Không nên gọi `axios.get('/products')` trực tiếp trong Component. Hãy gom vào các Service file.

### 2.1. Tạo `services/productService.js`

```javascript
import axios from '@/utils/axios';

export default {
    getAll() {
        return axios.get('/products');
    },
    
    getById(id) {
        return axios.get(`/products/${id}`);
    },
    
    create(data) {
        return axios.post('/products', data);
    },
    
    update(id, data) {
        return axios.put(`/products/${id}`, data);
    },
    
    delete(id) {
        return axios.delete(`/products/${id}`);
    }
};
```

### 2.2. Sử dụng trong Component

```html
<script setup>
import { ref, onMounted } from 'vue';
import productService from '@/services/productService';

const products = ref([]);

async function loadData() {
    try {
        products.value = await productService.getAll();
    } catch (error) {
        console.error("Lỗi tải dữ liệu", error);
    }
}

onMounted(() => {
    loadData();
});
</script>
```

---

## 🧪 3. Thực hành

1. Tạo file `utils/axios.js` với cấu hình như trên.
2. Tạo `services/authService.js` với hàm `login(credentials)`.
3. Tạo `services/productService.js`.
4. (Tạm thời) Dùng [MockAPI.io](https://mockapi.io) để giả lập API test thử việc gọi dữ liệu và hiển thị lên Console.

---

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Quên cấu hình baseURL

**❌ Vấn đề:**
```javascript
axios.get('/products') // ❌ Relative path không hoạt động
```

**✅ Giải pháp:**
```javascript
const instance = axios.create({
  baseURL: 'https://localhost:5001/api' // ✅ Base URL
})
instance.get('/products') // ✅ Tự động thêm baseURL
```

**🔍 Giải thích:** Cần baseURL để axios biết gọi đến đâu.

---

### Lỗi 2: Quên xử lý lỗi

**❌ Vấn đề:**
```javascript
const data = await axios.get('/products') // ❌ Không try-catch
```

**✅ Giải pháp:**
```javascript
try {
  const data = await axios.get('/products')
} catch (error) {
  console.error('Lỗi:', error.response?.data || error.message)
}
```

**🔍 Giải thích:** API có thể fail, cần xử lý lỗi.

---

### Lỗi 3: Quên gửi token trong header

**❌ Vấn đề:**
```javascript
axios.get('/protected') // ❌ Không có token
```

**✅ Giải pháp:**
```javascript
// Dùng interceptor tự động thêm token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**🔍 Giải thích:** Protected routes cần token trong header.

---

## 💡 5. Best Practices

### 5.1. Tổ chức Services
```
services/
├── api.js          # Axios instance
├── authService.js  # Auth APIs
├── productService.js
└── orderService.js
```

### 5.2. Error Handling
- Centralized error handling trong interceptor
- User-friendly error messages
- Log errors để debug

### 5.3. Loading States
```javascript
const isLoading = ref(false)

async function fetchData() {
  isLoading.value = true
  try {
    const data = await service.get()
    return data
  } finally {
    isLoading.value = false
  }
}
```

---

## 🎯 6. Case Study: Service Pattern hoàn chỉnh

**`services/productService.js`:**

```javascript
import axios from '@/utils/axios'

export default {
  async getAll(params = {}) {
    return axios.get('/products', { params })
  },
  
  async getById(id) {
    return axios.get(`/products/${id}`)
  },
  
  async create(data) {
    return axios.post('/products', data)
  },
  
  async update(id, data) {
    return axios.put(`/products/${id}`, data)
  },
  
  async delete(id) {
    return axios.delete(`/products/${id}`)
  },
  
  async search(keyword) {
    return axios.get('/products/search', { 
      params: { q: keyword } 
    })
  }
}
```

**Sử dụng trong component:**

```html
<script setup>
import { ref, onMounted } from 'vue'
import productService from '@/services/productService'

const products = ref([])
const isLoading = ref(false)
const error = ref(null)

async function loadProducts() {
  isLoading.value = true
  error.value = null
  try {
    products.value = await productService.getAll()
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi tải dữ liệu'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>
```

---

## 📝 7. Bài tập thực hành

1. Tạo axios instance với interceptors
2. Tạo authService với login/logout
3. Tạo productService với CRUD
4. Xử lý loading và error states
5. Tạo composable `useApi` để tái sử dụng

---

## 🧪 8. Mini Test

### Câu 1: Axios interceptor dùng để làm gì?
<details>
<summary>Xem đáp án</summary>
Xử lý request/response trước/sau khi gửi/nhận, như thêm token, xử lý lỗi chung.
</details>

### Câu 2: Service Pattern là gì?
<details>
<summary>Xem đáp án</summary>
Tách logic gọi API ra file riêng, không gọi trực tiếp trong component.
</details>

### Câu 3: Làm sao thêm token vào mọi request?
<details>
<summary>Xem đáp án</summary>
Dùng request interceptor để tự động thêm Authorization header.
</details>

---

## 📌 9. Quick Notes

### Axios Setup
```javascript
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
})

// Request interceptor
instance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor
instance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)
```

### Service Pattern
```javascript
// services/example.js
export default {
  getAll() { return axios.get('/items') },
  getById(id) { return axios.get(`/items/${id}`) }
}
```

---

## 💡 Tổng kết Giai đoạn 1
Chúc mừng! Bạn đã hoàn thành nền tảng Frontend.
- Đã có Project Vue 3 chuẩn.
- Đã có Router, Pinia, Vuetify.
- Đã có lớp giao tiếp API.

👉 **Tuần sau chúng ta sẽ code Backend .NET thực sự!**
