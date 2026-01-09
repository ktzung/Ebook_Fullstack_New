# Hướng Dẫn Chi Tiết: Xây Dựng Ứng Dụng Quản Lý Sản Phẩm (Vue 3 + Mock API)

Tài liệu này được thiết kế dành cho người mới bắt đầu (Beginner), chưa có nhiều kinh nghiệm về Frontend. Chúng ta sẽ đi từng bước rất nhỏ, giải thích cặn kẽ từng khái niệm và dòng code.

## Phần 1: Giới Thiệu & Chuẩn Bị

### 1.1 Chúng Ta Sẽ Làm Gì?
Chúng ta sẽ xây dựng một website quản lý sản phẩm đơn giản giống như trang quản trị của Shop bán hàng.
Các chức năng chính (CRUD):
1.  **C**reate (Tạo mới): Nhập thông tin sản phẩm và lưu lại.
2.  **R**ead (Đọc/Xem): Hiển thị danh sách sản phẩm đang có.
3.  **U**pdate (Cập nhật): Sửa lại thông tin (ví dụ sửa giá, sửa tên).
4.  **D**elete (Xóa): Xóa sản phẩm sai hoặc không bán nữa.

### 1.2 Kiến Trúc Ứng Dụng
Ứng dụng Web hiện đại thường chia làm 2 phần:
*   **Frontend (Giao diện)**: Phần người dùng nhìn thấy và tương tác. Chúng ta dùng **Vue.js**.
*   **Backend (Dữ liệu)**: Phần lưu trữ dữ liệu và xử lý logic nghiệp vụ.
    *   *Vì chưa học Backend (với Node.js/Java/PHP), ta sẽ dùng một công cụ giả lập tên là `json-server` (Mock API).*
    *   *Nó giúp ta có một Server "như thật" chỉ với 1 file text chứa dữ liệu.*

### 1.3 Cấu Trúc Thư Mục
Sau khi hoàn thành, dự án của bạn sẽ trông như thế này:

```text
vue-crud-app/
├── db.json                 <-- "Cơ sở dữ liệu" giả (Đóng vai trò Backend)
├── src/
│   ├── assets/             <-- Chứa file CSS, hình ảnh, logo
│   │   └── main.css        <-- CSS chung cho toàn app
│   ├── components/         <-- Các khối giao diện nhỏ (Nút bấm, Card sản phẩm...)
│   │   ├── AppHeader.vue   <-- Thanh menu trên cùng
│   │   ├── ProductCard.vue <-- Khung hiển thị 1 sản phẩm
│   │   └── ProductForm.vue <-- Form nhập liệu (dùng chung cho Thêm & Sửa)
│   ├── services/           <-- Nơi quản lý việc "nói chuyện" với Backend
│   │   └── api.js          <-- File cấu hình gọi API
│   ├── views/              <-- Các trang chính của web
│   │   ├── HomeView.vue    <-- Trang chủ (Xem danh sách)
│   │   ├── CreateView.vue  <-- Trang thêm mới
│   │   └── EditView.vue    <-- Trang sửa
│   ├── App.vue             <-- Khung sườn chính của ứng dụng
│   └── main.js             <-- Điểm khởi chạy đầu tiên của Vue
└── package.json            <-- File khai báo thư viện (dependencies)
```

---

## Phần 2: Khởi Tạo Dự Án (Làm Từng Bước)

### Bước 1: Tạo Vue Project
Mở Terminal (hoặc CMD/PowerShell), gõ lệnh sau để tải bộ công cụ tạo dự án:

```bash
npm init vue@latest vue-crud-app
```
*Giải thích: Lệnh này bảo máy tính "Hãy tạo một dự án Vue mới tên là `vue-crud-app` bằng phiên bản mới nhất".*

Hệ thống sẽ hỏi bạn một số câu hỏi, hãy chọn như sau (Dùng phím mũi tên và Enter):
- TypeScript: **No** (Ta dùng JavaScript thuần cho dễ hiểu).
- JSX: **No**.
- Vue Router: **Yes** (Để chuyển trang mà không load lại web).
- Pinia: **No** (Tạm thời chưa cần quản lý state phức tạp).
- Vitest/Cypress: **No** (Chưa cần test tự động).
- ESLint/Prettier: **Yes** (Giúp code đẹp và chuẩn).

### Bước 2: Cài Đặt Thư Viện
Di chuyển vào thư mục vừa tạo và cài đặt các gói cần thiết.

```bash
cd vue-crud-app
npm install           # Cài các thư viện cơ bản của Vue
npm install axios     # Thư viện giúp gửi yêu cầu HTTP (Get/Post)
npm install json-server -D  # Công cụ tạo Server giả (-D nghĩa là chỉ dùng khi code, không dùng khi chạy thật)
```

Check lại: Mở file `package.json`, bạn sẽ thấy tên các thư viện vừa cài trong danh sách.

---

## Phần 3: Thiết Lập "Backend Giả" (Mock API)

### Bước 1: Tạo Database
Tại thư mục gốc (ngang hàng với `package.json`), tạo file tên là `db.json`.
Copy nội dung sau:

```json
{
  "products": [
    {
      "id": "1",
      "name": "Iphone 15 Pro",
      "price": 999,
      "category": "Điện thoại",
      "description": "Điện thoại xịn nhất năm.",
      "image": "https://placehold.co/600x400"
    }
  ]
}
```
*Giải thích: Đây là dữ liệu mẫu ban đầu. `products` là tên bảng dữ liệu.*

### Bước 2: Tạo Lệnh Chạy Server
Mở file `package.json`, tìm phần `"scripts"`. Thêm dòng `"api": ...` vào như sau:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "api": "json-server db.json --port 3000"  // <-- Thêm dòng này
}
```

### Bước 3: Chạy Thử
Mở 2 cửa sổ Terminal:
1.  Terminal 1: Chạy Backend -> `npm run api`
    *   Bạn sẽ thấy thông báo: `Index: http://localhost:3000/`
2.  Terminal 2: Chạy Frontend -> `npm run dev`
    *   Bạn sẽ thấy thông báo: `Local: http://localhost:5173/`

**Tuyệt vời! Bây giờ bạn đã có cả Web (Frontend) và Server (Backend) đang chạy song song.**

---

## Phần 4: Kết Nối Dữ Liệu (API Service)

Thay vì viết code gọi Server lặp đi lặp lại ở khắp nơi, ta viết gom vào một chỗ.
Tạo file: `src/services/api.js`

```javascript
import axios from 'axios';

// 1. Tạo một "người vận chuyển" chuyên biệt
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Địa chỉ nhà kho (Server Mock)
  headers: {
    'Content-Type': 'application/json', // Nói với server: "Tôi gửi dữ liệu dạng JSON nhé"
  },
});

// 2. Xuất ra các hàm để dùng ở nơi khác
export default {
  // Lấy toàn bộ danh sách
  getProducts() {
    return apiClient.get('/products');
  },
  // Lấy chi tiết 1 cái (theo ID)
  getProduct(id) {
    return apiClient.get(`/products/${id}`);
  },
  // Gừi dữ liệu lên để tạo mới
  createProduct(data) {
    return apiClient.post('/products', data);
  },
  // Gửi dữ liệu lên để sửa (theo ID)
  updateProduct(id, data) {
    return apiClient.put(`/products/${id}`, data);
  },
  // Gửi yêu cầu xóa (theo ID)
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
};
```

---

## Phần 5: Xây Dựng Component (Những mảnh ghép nhỏ)

### 5.1 ProductCard.vue (Thẻ sản phẩm)
Component này có nhiệm vụ hiển thị đẹp mắt 1 sản phẩm. Nó "ngốc" (dump component) vì nó không tự đi lấy dữ liệu, nó chỉ nhận dữ liệu từ cha đưa xuống và hiển thị.

File: `src/components/ProductCard.vue`

```html
<script setup>
// Định nghĩa props: Những gì cha truyền vào
defineProps({
  product: {
    type: Object,
    required: true // Bắt buộc phải có thông tin sản phẩm mới hiển thị
  }
})

// Định nghĩa events: Những sự kiện con báo lên cha
// Ở đây là báo: "Cha ơi, người dùng bấm nút Xóa rồi!"
defineEmits(['delete'])
</script>

<template>
  <div class="product-card">
    <img :src="product.image" alt="Ảnh sản phẩm" class="card-img">
    <div class="card-body">
      <h3>{{ product.name }}</h3>
      <p class="price">{{ product.price }} $</p>
      
      <div class="actions">
        <!-- Nút Sửa: Dùng RouterLink để chuyển trang -->
        <!-- `:to` là binding động, tạo đường dẫn dạng /edit/1 -->
        <router-link :to="`/edit/${product.id}`" class="btn-edit">Sửa</router-link>
        
        <!-- Nút Xóa: Khi click thì báo sự kiện 'delete' kèm ID lên cha -->
        <button @click="$emit('delete', product.id)" class="btn-delete">Xóa</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS chỉ áp dụng cho component này */
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}
.card-img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 1rem; }
.price { color: red; font-weight: bold; font-size: 1.2rem; }
.actions { display: flex; gap: 10px; margin-top: 10px; }
/* ... thêm css cho button ... */
</style>
```

### 5.2 ProductForm.vue (Form nhập liệu)
Form này dùng chung. Logic là:
- Nếu Thêm mới: Form trống.
- Nếu Sửa: Form điền sẵn dữ liệu cũ.

File: `src/components/ProductForm.vue`

```html
<script setup>
import { reactive } from 'vue'

const props = defineProps({
  // Dữ liệu ban đầu (nếu có)
  initialData: {
    type: Object,
    // Mặc định là rỗng nếu không truyền vào (trường hợp Thêm mới)
    default: () => ({ name: '', price: 0, image: '', description: '' })
  }
})

const emit = defineEmits(['submit'])

// 1. Tạo biến reactive để liên kết với các ô input
// Lưu ý: Phải copy (spread ...) props ra object mới
// để tránh sửa trực tiếp vào props (Vue cấm sửa props)
const formData = reactive({ ...props.initialData })

// 2. Hàm xử lý khi bấm Lưu
const handleSubmit = () => {
  // Báo lên cha: "Tôi xong rồi, dữ liệu đây"
  emit('submit', formData)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <!-- Dùng v-model để liên kết biến formData.name với ô input -->
    <div class="form-group">
      <label>Tên sản phẩm</label>
      <input v-model="formData.name" type="text" required placeholder="Ví dụ: Iphone 15">
    </div>

    <div class="form-group">
      <label>Giá ($)</label>
      <input v-model="formData.price" type="number" required>
    </div>

    <div class="form-group">
      <label>Link ảnh</label>
      <input v-model="formData.image" type="text" placeholder="https://...">
    </div>

    <button type="submit">Lưu Sản Phẩm</button>
  </form>
</template>

<style scoped>
.form-container { max-width: 500px; margin: 0 auto; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input { width: 100%; padding: 8px; }
</style>
```

---

## Phần 6: Xây Dựng Các Trang Chính (Views)

### 6.1 HomeView.vue (Trang chủ)
Logic:
1. Khi trang tải xong (`onMounted`): Gọi API lấy danh sách.
2. Lưu danh sách vào biến `products`.
3. Dùng vòng lặp `v-for` để vẽ ra các `ProductCard`.

File: `src/views/HomeView.vue`

```html
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api' // Import công cụ gọi API
import ProductCard from '../components/ProductCard.vue' // Import thẻ sản phẩm

// Biến chứa danh sách, khởi tạo là mảng rỗng
const products = ref([])

// Hàm lấy dữ liệu từ server
const fetchData = async () => {
  try {
    const response = await api.getProducts()
    products.value = response.data // Cập nhật dữ liệu vào biến
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error)
  }
}

// Chạy hàm này ngay khi component được tải
onMounted(() => {
  fetchData()
})

// Hàm xóa sản phẩm
const handleRemove = async (idOfProduct) => {
  const xacNhan = confirm("Bạn có chắc chắn muốn xóa không?")
  if (!xacNhan) return; // Nếu user chọn Cancel thì dừng

  try {
    // 1. Gọi API báo Server xóa đi
    await api.deleteProduct(idOfProduct)
    
    // 2. Cập nhật lại giao diện ngay lập tức
    // (Lọc bỏ sản phẩm vừa xóa ra khỏi danh sách đang hiển thị)
    products.value = products.value.filter(item => item.id !== idOfProduct)
    
    alert("Đã xóa thành công!")
  } catch (error) {
    alert("Xóa thất bại!")
  }
}
</script>

<template>
  <main>
    <h1>Danh sách sản phẩm</h1>
    
    <!-- Hiển thị lưới sản phẩm -->
    <div class="grid-container">
      <!-- v-for: Lặp qua từng sản phẩm trong danh sách products -->
      <!-- :product="item": Truyền toàn bộ thông tin sản phẩm xuống con -->
      <!-- @delete="handleRemove": Lắng nghe sự kiện xóa từ con -->
      <ProductCard 
        v-for="item in products" 
        :key="item.id" 
        :product="item"
        @delete="handleRemove"
      />
    </div>
  </main>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive tự động */
  gap: 20px;
}
</style>
```

### 6.2 CreateView.vue (Trang tạo mới)
Logic: Hiển thị Form, khi user submit thì gọi API `createProduct` rồi chuyển hướng về Home.

File: `src/views/CreateView.vue`

```html
<script setup>
import ProductForm from '../components/ProductForm.vue'
import api from '../services/api'
import { useRouter } from 'vue-router' // Dùng để chuyển trang

const router = useRouter() // Công cụ điều hướng

const handleCreate = async (formData) => {
  try {
    // Gọi API để lưu dữ liệu mới
    await api.createProduct(formData)
    alert("Thêm mới thành công!")
    
    // Chuyển hướng người dùng về trang chủ
    router.push('/') 
  } catch (error) {
    alert("Lỗi khi thêm mới!")
  }
}
</script>

<template>
  <div class="create-page">
    <h1>Thêm Sản Phẩm Mới</h1>
    <!-- Sử dụng Form dùng chung -->
    <ProductForm @submit="handleCreate" />
  </div>
</template>
```

### 6.3 EditView.vue (Trang sửa)
Logic phức tạp hơn một chút:
1. Lấy `id` từ thanh địa chỉ (URL).
2. Gọi API lấy thông tin chi tiết của sản phẩm đó.
3. Hiển thị Form với dữ liệu cũ.
4. Khi user sửa xong và submit, gọi API `updateProduct`.

File: `src/views/EditView.vue`

```html
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import ProductForm from '../components/ProductForm.vue'

const route = useRoute()   // Lấy thông tin URL hiện tại
const router = useRouter() // Công cụ chuyển trang
const productData = ref(null) // Biến chứa data cũ

onMounted(async () => {
  // Lấy id từ URL (ví dụ: /edit/1 -> id là 1)
  const id = route.params.id
  
  // Gọi API lấy thông tin cũ
  const response = await api.getProduct(id)
  productData.value = response.data
})

const handleUpdate = async (updatedData) => {
  try {
    const id = route.params.id
    // Gọi API cập nhật
    await api.updateProduct(id, updatedData)
    alert("Cập nhật thành công!")
    router.push('/')
  } catch (error) {
    alert("Lỗi cập nhật!")
  }
}
</script>

<template>
  <div class="edit-page">
    <h1>Chỉnh Sửa Sản Phẩm</h1>
    
    <!-- Chỉ hiện form khi đã tải xong dữ liệu cũ (v-if) -->
    <ProductForm 
      v-if="productData" 
      :initial-data="productData"
      @submit="handleUpdate" 
    />
    <p v-else>Đang tải dữ liệu...</p>
  </div>
</template>
```

---

## Phần 7: Cấu Hình Router (Định tuyến)

Cuối cùng, ta phải khai báo cho Vue biết đường dẫn nào thì hiện View nào.

File: `src/router/index.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateView.vue'
import EditView from '../views/EditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',          // Trang chủ
      name: 'home',
      component: HomeView
    },
    {
      path: '/create',    // Trang thêm mới
      name: 'create',
      component: CreateView
    },
    {
      path: '/edit/:id',  // Trang sửa (có tham số động :id)
      name: 'edit',
      component: EditView
    }
  ]
})

export default router
```

## Tổng Kết Bài Học
Bạn vừa hoàn thành một ứng dụng Vue.js "Fullstack" (giả lập).
Quy trình phát triển luôn là:
1.  **Data First**: Định nghĩa dữ liệu (`db.json`) và API (`services/api.js`).
2.  **Component**: Chia nhỏ giao diện (`ProductCard`, `ProductForm`).
3.  **View**: Ghép các component lại, xử lý logic lấy dữ liệu và sự kiện người dùng.
4.  **Router**: Kết nối các View lại với nhau qua đường dẫn URL.

Hãy thử tự tay gõ lại từng dòng code trên để hiểu rõ bản chất nhé! Chúc bạn thành công.
