# Hướng Dẫn: Xây Dựng Ứng Dụng Vue 3 CRUD với MockAPI.io (Online)

Ở bài trước (bài 16), chúng ta đã dùng `json-server` để chạy một API giả trên máy tính cá nhân (localhost). Cách đó rất tốt để code offline.
Tuy nhiên, trong thực tế hoặc khi muốn chia sẻ ứng dụng cho người khác dùng thử, ta cần một API "trên mây" (Cloud). **MockAPI.io** là một công cụ miễn phí tuyệt vời để làm việc này.

Bài hướng dẫn này sẽ giúp bạn **thay thế json-server bằng MockAPI.io**. Các phần code về giao diện (Vue) gần như giữ nguyên, chứng tỏ sức mạnh của việc tách biệt API Service.

---

## Phần 1: Thiết Lập MockAPI.io

Thay vì tạo file `db.json`, ta sẽ tạo database trên web.

### Bước 1: Đăng ký tài khoản
1.  Truy cập [https://mockapi.io/](https://mockapi.io/).
2.  Đăng nhập bằng tài khoản Google hoặc GitHub.

### Bước 2: Tạo Project
1.  Tại màn hình Dashboard, bấm nút **"+"** (hoặc **"New Project"**).
2.  Nhập tên Project: `VueCrudApp`.
3.  API Prefix: Để mặc định (thường là `/api/v1`).
4.  Bấm **Create**.

### Bước 3: Tạo Resource (Tạo bảng dữ liệu)
Project vừa tạo đang trống, ta cần tạo bảng `products`.
1.  Bấm vào project **VueCrudApp** vừa tạo.
2.  Bấm nút **"New Resource"**.
3.  Điền thông tin:
    - **Resource Name**: `products` (Lưu ý viết thường, số nhiều).
4.  Định nghĩa Schema (Các trường dữ liệu):
    - Mặc định đã có `id`, `createdAt`.
    - Thêm các trường sau:
        - `name` (Type: startCase / String)
        - `price` (Type: Number / Money)
        - `image` (Type: Faker.js -> Image -> avatar/image)
        - `description` (Type: String)
5.  Bấm **Create**.

### Bước 4: Lấy Endpoint (Đường dẫn API)
Sau khi tạo xong, bạn sẽ thấy một đường link dạng:
`https://67...mockapi.io/api/v1/products`
-> Hãy copy phần gốc: `https://67...mockapi.io/api/v1` ( Bỏ chữ `/products` đuôi đi).
*Ví dụ ID của bạn là `677f805d0476123f76a6b5a1`, thì URL là `https://677f805d0476123f76a6b5a1.mockapi.io/api/v1`.*

---

## Phần 2: Khởi Tạo Dự Án Vue

Chúng ta sẽ tạo một dự án Vue 3 mới hoàn toàn, tương tự như các bài trước nhưng sẽ đi vào chi tiết cấu hình để đảm bảo bạn hiểu rõ các thành phần.

### Bước 1: Tạo Project
Mở Terminal và chạy lệnh sau để khởi tạo dự án:

```bash
npm init vue@latest vue-mockapi-app
```

Bạn sẽ gặp các câu hỏi cấu hình. Hãy chọn như sau (dùng phím mũi tên và Enter để chọn):

1.  **Project name**: `vue-mockapi-app` (Tên dự án)
2.  **Add TypeScript?**: `No` (Chúng ta dùng JavaScript thuần cho đơn giản)
3.  **Add JSX Support?**: `No` (Dùng template syntax chuẩn của Vue)
4.  **Add Vue Router?**: `Yes` (Cần để chuyển trang Home/Create/Edit)
5.  **Add Pinia?**: `No` (Chưa cần quản lý state phức tạp)
6.  **Add Vitest?**: `No` (Chưa cần test)
7.  **Add End-to-End Testing Solution?**: `No`
8.  **Add ESLint?**: `Yes` (Để kiểm tra lỗi code)
9.  **Add Prettier?**: `Yes` (Để format code đẹp tự động)

### Bước 2: Cài Đặt Thư Viện
Di chuyển vào thư mục dự án và cài đặt các dependencies:

```bash
cd vue-mockapi-app
npm install
```

Cài đặt thư viện **Axios** để gọi API:

```bash
npm install axios
```
*Lưu ý: Chúng ta KHÔNG CẦN cài `json-server` vì dữ liệu đã nằm trên MockAPI.io.*

### Bước 3: Chạy Thử
Khởi động dự án để đảm bảo mọi thứ hoạt động ổn:

```bash
npm run dev
```
Truy cập `http://localhost:5173` trên trình duyệt. Nếu thấy trang Welcome của Vue là thành công.

---

## Phần 2 Bis: Cấu Trúc Dự Án (Project Structure)

Sau khi tạo xong, cấu trúc thư mục của bạn sẽ trông như thế này. Chúng ta sẽ tập trung vào các folder và file được đánh dấu sao (*).

```text
vue-mockapi-app/
├── node_modules/       # Thư viện tải về (không cần đụng vào)
├── public/             # File tĩnh
├── src/                # CODE CỦA BẠN NẰM Ở ĐÂY
│   ├── assets/         # CSS, hình ảnh, logo
│   │   ├── main.css    # File CSS toàn cục (Global CSS)
│   ├── components/     # Các thành phần giao diện nhỏ (Widgets)
│   │   ├── ProductCard.vue  # (*) Hiển thị 1 sản phẩm
│   │   ├── ProductForm.vue  # (*) Form dùng chung cho Thêm/Sửa
│   ├── router/         # Cấu hình đường dẫn (URL)
│   │   └── index.js    # (*) Định nghĩa các route
│   ├── services/       # Thư mục chứa code gọi API
│   │   └── api.js      # (*) Cấu hình Axios & các hàm gọi MockAPI
│   ├── views/          # Các trang chính (Pages)
│   │   ├── HomeView.vue     # (*) Trang chủ: Danh sách SP
│   │   ├── CreateView.vue   # (*) Trang thêm mới
│   │   ├── EditView.vue     # (*) Trang chỉnh sửa
│   ├── App.vue         # Component gốc, chứa RouterView
│   └── main.js         # Điểm khởi chạy ứng dụng
├── index.html          # File HTML chính
├── package.json        # Khai báo thư viện & lệnh chạy
└── vite.config.js      # Cấu hình Vite (Build tool)
```

### Các File Bạn Cần Tạo/Sửa:
Trong bài hướng dẫn này, chúng ta sẽ lần lượt làm việc với các file sau:

1.  `src/services/api.js`: (Tạo mới) Kết nối với MockAPI.io.
2.  `src/components/ProductCard.vue`: (Tạo mới) Giao diện thẻ sản phẩm.
3.  `src/components/ProductForm.vue`: (Tạo mới) Giao diện nhập liệu.
4.  `src/views/HomeView.vue`: (Sửa/Tạo) Trang hiển thị danh sách.
5.  `src/views/CreateView.vue`: (Tạo mới) Trang thêm sản phẩm.
6.  `src/views/EditView.vue`: (Tạo mới) Trang sửa sản phẩm.
7.  `src/router/index.js`: (Sửa) Khai báo đường dẫn cho các trang trên.
8.  `src/assets/main.css`: (Sửa) Thêm chút CSS cho đẹp.

---

## Phần 3: Cấu Hình API Service (Quan Trọng)

Đây là nơi thay đổi duy nhất so với bài trước. Ta sẽ trỏ địa chỉ vào MockAPI.io thay vì localhost.

File: `src/services/api.js`

```javascript
import axios from 'axios';

// 1. Dán đường link MockAPI của bạn vào đây
// LƯU Ý: Thay đổi ID dưới đây bằng ID thật của bạn vừa copy ở Bước 1.4
const MOCK_API_URL = 'https://Thay_ID_Cua_Ban_Vao_Day.mockapi.io/api/v1';

const apiClient = axios.create({
  baseURL: MOCK_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getProducts() {
    return apiClient.get('/products');
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}`);
  },
  createProduct(data) {
    return apiClient.post('/products', data);
  },
  updateProduct(id, data) {
    return apiClient.put(`/products/${id}`, data);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
};
```

---

## Phần 4: Xây Dựng Giao Diện (Components & Views)

Phần này **HOÀN TOÀN GIỐNG** bài 16. Bạn có thể copy code từ bài trước sang. Mình sẽ tóm tắt lại code để bạn tiện theo dõi nếu làm bài này độc lập.

### 4.1 ProductCard.vue
Hiển thị từng sản phẩm.

```html
<script setup>
defineProps({ product: Object })
defineEmits(['delete'])
</script>

<template>
  <div class="card">
    <img :src="product.image" alt="SP" width="100%">
    <h3>{{ product.name }}</h3>
    <p>{{ product.price }} $</p>
    <router-link :to="`/edit/${product.id}`">Sửa</router-link>
    <button @click="$emit('delete', product.id)">Xóa</button>
  </div>
</template>

<style scoped>
.card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
</style>
```

### 4.2 ProductForm.vue
Form nhập liệu dùng chung.

```html
<script setup>
import { reactive } from 'vue'
const props = defineProps({
  initialData: { type: Object, default: () => ({ name: '', price: '', image: '' }) }
})
const emit = defineEmits(['submit'])
const formData = reactive({ ...props.initialData })
</script>

<template>
  <form @submit.prevent="$emit('submit', formData)">
    <input v-model="formData.name" placeholder="Tên" required />
    <input v-model="formData.price" placeholder="Giá" required />
    <input v-model="formData.image" placeholder="Link ảnh (Tùy chọn)" />
    <button type="submit">Lưu</button>
  </form>
</template>
```

### 4.3 HomeView.vue (Trang chủ)

```html
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])

onMounted(async () => {
  // Lúc này nó sẽ gọi lên MockAPI.io chứ không phải localhost
  const res = await api.getProducts()
  products.value = res.data
})

const handleRemove = async (id) => {
  if(confirm("Xóa nhé?")) {
    await api.deleteProduct(id)
    products.value = products.value.filter(p => p.id !== id)
  }
}
</script>

<template>
  <h1>Danh Sách MockAPI Online</h1>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
    <ProductCard 
      v-for="p in products" 
      :key="p.id" 
      :product="p" 
      @delete="handleRemove"
    />
  </div>
</template>
```

### 4.4 CreateView.vue (Trang tạo mới)
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
    // Gọi API để lưu dữ liệu mới trên MockAPI
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

### 4.5 EditView.vue (Trang sửa)
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
  
  // Gọi API lấy thông tin cũ từ MockAPI
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

### 4.6 Cấu Hình Router (Định tuyến)

Chúng ta cần khai báo cho Vue biết đường dẫn nào thì hiện View nào.

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

### 4.7 Trang trí đẹp hơn với CSS
Để giao diện không bị xấu, hãy thêm chút CSS vào file `src/assets/main.css`.
Copy toàn bộ nội dung dưới đây:

File: `src/assets/main.css`

```css
/* Base Design System */
:root {
  /* HSL Color Palette */
  --pk-hue: 220; /* Primary Blue */
  --pk-sat: 90%;
  --pk-lig: 55%;
  
  --color-primary: hsl(var(--pk-hue), var(--pk-sat), var(--pk-lig));
  --color-primary-dark: hsl(var(--pk-hue), var(--pk-sat), 45%);
  --color-primary-light: hsl(var(--pk-hue), var(--pk-sat), 96%);
  
  --color-text-main: hsl(220, 20%, 20%);
  --color-text-muted: hsl(220, 15%, 50%);
  --color-text-invert: hsl(0, 0%, 100%);
  
  --color-bg-body: hsl(220, 30%, 97%);
  --color-bg-card: hsl(0, 0%, 100%);
  
  --color-danger: hsl(350, 80%, 60%);
  --color-success: hsl(150, 80%, 40%);

  /* Spacing & Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --container-width: 1200px;
}

*, *::before, *::after {
  box-sizing: border-box; margin: 0; padding: 0;
}

body {
  min-height: 100vh;
  color: var(--color-text-main);
  background: var(--color-bg-body);
  font-family: var(--font-sans);
  line-height: 1.6;
}

/* Utilities */
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.btn {
  display: inline-flex;
  align-items: center; justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: none; cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem; gap: 0.5rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-invert);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow-md);
}

/* Form Styles */
.form-group { margin-bottom: 1.5rem; }

label {
  display: block; font-weight: 600;
  margin-bottom: 0.5rem; color: var(--color-text-main);
}

input, textarea, select {
  width: 100%; padding: 0.75rem;
  border: 1px solid hsl(220, 15%, 85%);
  border-radius: var(--radius-sm);
  font-family: inherit; font-size: 1rem;
  transition: border-color 0.2s;
  background: #fff;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
```

Phần CSS này sẽ giúp ứng dụng của bạn trông "xịn xò" hơn rất nhiều so với mặc định!

---

## Phần 5: Chạy Thử & Kiểm Tra

1.  Chạy ứng dụng:
    ```bash
    npm run dev
    ```
2.  Mở trình duyệt: `http://localhost:5173`.
3.  **Thử Thêm Mới**:
    - Bấm nút thêm, điền thông tin.
    - Sau khi lưu, hãy quay lại trang Dashboard của MockAPI.io, refresh trình duyệt, bạn sẽ thấy dữ liệu mới xuất hiện trên đó!
4.  **Thử Xóa/Sửa**:
    - Tương tác trên web local của bạn, dữ liệu trên MockAPI cloud cũng thay đổi theo.

## Tổng Kết Sự Khác Biệt

| Đặc điểm | json-server (Bài 16) | MockAPI.io (Bài 17) |
| :--- | :--- | :--- |
| **Nơi chứa dữ liệu** | File `db.json` trên máy bạn | Server của MockAPI.io (Cloud) |
| **Cài đặt** | Cần cài `json-server` (`npm i json-server`) | Không cần cài, chỉ cần đăng ký Web |
| **Môi trường** | Chỉ chạy nội mạng (Offline) | Chạy mọi nơi có Internet (Online) |
| **Phù hợp** | Dev một mình, test nhanh | Demo cho khách hàng, làm việc nhóm |

**Lời khuyên**: Khi học thì dùng `json-server` cho nhanh. Khi làm bài tập nhóm hoặc muốn demo sản phẩm mà chưa biết code Backend thật, hãy dùng `MockAPI.io`.
