# 🟦 BÀI 2: SETUP MÔI TRƯỜNG & TẠO PROJECT ĐẦU TIÊN

## 🎯 Mục tiêu
- Cài đặt Node.js và npm
- Hiểu về Vite và tại sao dùng nó
- Tạo project Vue 3 đầu tiên
- Chạy được ứng dụng "Hello World"
- Hiểu cấu trúc thư mục cơ bản

---

## 🛠️ 1. Cài đặt Node.js

### 🎬 Ví dụ dẫn nhập: Tại sao cần Node.js?

Hãy tưởng tượng bạn muốn xây dựng website như **Shopee**:

**Vấn đề thực tế:**
- Code Vue.js không thể chạy trực tiếp trên trình duyệt (cần compile)
- Cần cài đặt hàng trăm thư viện (Vue, Router, Pinia, Vuetify...)
- Cần công cụ để build code thành file tĩnh (HTML/CSS/JS)
- Cần server để chạy code trong quá trình development

**Giải pháp: Node.js**
- Node.js = Môi trường chạy JavaScript bên ngoài trình duyệt
- npm = Công cụ quản lý thư viện (giống như "App Store" cho code)
- Vite = Công cụ build và chạy development server

**Ví dụ thực tế:**
```
Không có Node.js:
❌ Không thể cài thư viện
❌ Không thể build code
❌ Không thể chạy development server

Có Node.js:
✅ Cài thư viện: npm install vue
✅ Build code: npm run build
✅ Chạy server: npm run dev
```

### 🧠 Node.js là gì?

**Node.js** là môi trường chạy JavaScript bên ngoài trình duyệt. Chúng ta cần Node.js để:
- Chạy các công cụ build (Vite)
- Cài đặt thư viện (npm)
- Chạy development server

### 🌐 Liên hệ thực tế

**Node.js được dùng ở mọi dự án frontend:**
- **React**: Cần Node.js để chạy Create React App
- **Vue**: Cần Node.js để chạy Vite
- **Angular**: Cần Node.js để chạy Angular CLI
- **Next.js, Nuxt.js**: Tất cả đều cần Node.js

**npm được dùng để:**
- Cài đặt thư viện (vue, axios, vuetify...)
- Quản lý dependencies
- Chạy scripts (dev, build, test...)

### Bước 1: Tải và cài đặt

1. Truy cập [nodejs.org](https://nodejs.org)
2. Tải bản **LTS** (Long Term Support) - khuyến nghị
3. Cài đặt như phần mềm thông thường
4. Kiểm tra cài đặt:

```powershell
node --version
npm --version
```

**Kết quả mong đợi:**
```
v20.x.x
10.x.x
```

### npm là gì?

**npm (Node Package Manager)** là công cụ quản lý thư viện JavaScript. Tương tự như:
- `pip` cho Python
- `composer` cho PHP
- `nuget` cho .NET

**Các lệnh npm cơ bản:**
```powershell
npm install          # Cài đặt dependencies
npm install vue      # Cài thư viện vue
npm run dev          # Chạy development server
npm run build        # Build production
```

---

## ⚡ 2. Vite là gì?

### 🧠 Tại sao dùng Vite?

**Vite** (phát âm là "veet", tiếng Pháp nghĩa là "nhanh") là công cụ build hiện đại cho frontend.

**So sánh Vite vs Vue CLI:**

| Đặc điểm | Vue CLI (Webpack) | Vite |
|----------|-------------------|------|
| **Khởi động** | 30-60 giây | 1-3 giây ⚡ |
| **Hot Reload** | Chậm (rebuild toàn bộ) | Cực nhanh (ESM) |
| **Build** | Chậm | Nhanh (Rollup) |
| **Cấu hình** | Phức tạp | Đơn giản |

**Vite hoạt động như thế nào?**

1. **Development**: Dùng ESM (ES Modules) native, không cần bundle
2. **Production**: Dùng Rollup để bundle tối ưu

**Ưu điểm:**
- ✅ Khởi động cực nhanh
- ✅ Hot Module Replacement (HMR) tức thì
- ✅ Cấu hình đơn giản
- ✅ Hỗ trợ nhiều framework (Vue, React, Svelte)

---

## 🚀 3. Tạo Project Vue 3

### Bước 1: Tạo project

Mở Terminal (VS Code) tại thư mục muốn lưu dự án:

```powershell
npm create vue@latest
```

**Giải thích lệnh:**
- `npm create` - Tạo project mới
- `vue@latest` - Dùng template Vue mới nhất

### Bước 2: Trả lời các câu hỏi

Bạn sẽ được hỏi các câu hỏi sau:

```
✔ Project name: … dnu-shop-client
✔ Add TypeScript? … No
✔ Add JSX Support? … No
✔ Add Vue Router for Single Page Application development? … Yes
✔ Add Pinia for state management? … Yes
✔ Add Vitest for Unit Testing? … No
✔ Add an End-to-End Testing Solution? … No
✔ Add ESLint for code quality? … Yes
✔ Add Prettier for code formatting? … Yes
```

**Giải thích từng lựa chọn:**

| Câu hỏi | Lựa chọn | Lý do |
|---------|----------|-------|
| **Project name** | `dnu-shop-client` | Tên thư mục dự án |
| **TypeScript** | No | Để đơn giản cho người mới (production nên dùng TS) |
| **JSX** | No | JSX là syntax của React, Vue dùng template |
| **Vue Router** | Yes | Cần thiết để điều hướng trang (sẽ học sau) |
| **Pinia** | Yes | Quản lý state toàn cục (sẽ học sau) |
| **Vitest** | No | Unit testing, có thể thêm sau |
| **E2E Testing** | No | Testing nâng cao |
| **ESLint** | Yes | Kiểm tra lỗi code, giúp code sạch hơn |
| **Prettier** | Yes | Tự động format code đẹp |

### Bước 3: Cài đặt dependencies

```powershell
cd dnu-shop-client
npm install
```

**Lệnh này làm gì?**
- Đọc file `package.json`
- Tải về tất cả thư viện cần thiết vào `node_modules`
- Mất 1-3 phút tùy mạng

### Bước 4: Chạy development server

```powershell
npm run dev
```

**Kết quả:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Truy cập `http://localhost:5173` để xem ứng dụng Vue đầu tiên!

---

## 📁 4. Cấu trúc thư mục

### Cấu trúc cơ bản

```
dnu-shop-client/
├── node_modules/          # Thư viện đã cài (KHÔNG chỉnh sửa)
├── public/                # File tĩnh (ảnh, favicon)
│   └── favicon.ico
├── src/                   # Source code chính
│   ├── assets/            # Ảnh, CSS, fonts
│   ├── components/        # Components tái sử dụng
│   │   └── HelloWorld.vue
│   ├── router/            # Cấu hình routing
│   │   └── index.js
│   ├── stores/            # Pinia stores
│   │   └── counter.js
│   ├── views/             # Các trang chính
│   ├── App.vue            # Component gốc
│   └── main.js            # Điểm khởi chạy
├── .gitignore             # Git ignore
├── index.html             # HTML template
├── package.json           # Dependencies và scripts
├── vite.config.js         # Cấu hình Vite
└── README.md              # Hướng dẫn
```

### Giải thích các file quan trọng

**`package.json`**
```json
{
  "name": "dnu-shop-client",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",           // Chạy development
    "build": "vite build",   // Build production
    "preview": "vite preview" // Xem preview build
  },
  "dependencies": {
    "vue": "^3.4.0",        // Vue framework
    "vue-router": "^4.2.0"  // Router
  }
}
```

**`main.js`** - Điểm khởi chạy
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

**`App.vue`** - Component gốc
```vue
<template>
  <div id="app">
    <RouterView />
  </div>
</template>
```

**`index.html`** - HTML template
```html
<!DOCTYPE html>
<html>
  <head>
    <title>DNU Shop</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## 🎨 5. Tạo "Hello World" đầu tiên

### Bước 1: Sửa `App.vue`

Xóa nội dung mặc định và viết:

```vue
<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <p>Chào mừng đến với Vue 3!</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello World!')
</script>

<style scoped>
.app {
  text-align: center;
  padding: 50px;
}

h1 {
  color: #42b983;
}
</style>
```

### Bước 2: Xem kết quả

Lưu file và xem trình duyệt tự động cập nhật (Hot Reload)!

**Giải thích code:**
- `<template>` - HTML template
- `<script setup>` - JavaScript logic
- `<style scoped>` - CSS chỉ áp dụng cho component này
- `{{ message }}` - Hiển thị giá trị biến (sẽ học chi tiết ở bài sau)

---

## 🧪 6. Thực hành

### Bài tập 1: Thay đổi message
- Thay "Hello World!" thành tên của bạn
- Thêm tuổi của bạn
- Thêm màu sắc yêu thích

### Bài tập 2: Tạo component mới
1. Tạo file `src/components/MyInfo.vue`
2. Hiển thị thông tin cá nhân
3. Import và dùng trong `App.vue`

---

## ❌ 7. Các lỗi thường gặp

### Lỗi 1: `npm: command not found`

**❌ Vấn đề:**
```
npm: command not found
```

**✅ Giải pháp:**
- Cài đặt Node.js từ [nodejs.org](https://nodejs.org)
- Restart Terminal sau khi cài
- Kiểm tra: `node --version`

---

### Lỗi 2: Port đã được sử dụng

**❌ Vấn đề:**
```
Port 5173 is already in use
```

**✅ Giải pháp:**
```powershell
# Cách 1: Dùng port khác
npm run dev -- --port 3000

# Cách 2: Tắt process đang dùng port 5173
```

---

### Lỗi 3: Module not found

**❌ Vấn đề:**
```
Cannot find module 'vue'
```

**✅ Giải pháp:**
```powershell
# Chạy lại
npm install
```

---

### Lỗi 4: Hot reload không hoạt động

**❌ Vấn đề:**
Thay đổi code nhưng trình duyệt không cập nhật

**✅ Giải pháp:**
- Kiểm tra console có lỗi không
- Restart dev server: `Ctrl+C` rồi `npm run dev` lại
- Hard refresh trình duyệt: `Ctrl+Shift+R`

---

## 💡 8. Best Practices

### Tổ chức thư mục

**Cấu trúc khuyến nghị cho dự án lớn:**
```
src/
├── assets/          # Ảnh, CSS, Fonts
├── components/       # Components nhỏ tái sử dụng
│   ├── common/      # Button, Card, Input...
│   └── layout/       # Header, Footer, Sidebar
├── views/           # Các trang chính
│   ├── admin/
│   └── public/
├── router/          # Routing
├── stores/          # Pinia stores
├── services/         # API services
├── utils/           # Helper functions
└── composables/     # Reusable logic
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.vue`)
- **Files**: kebab-case (`my-component.vue`)
- **Variables**: camelCase (`myVariable`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)

---

## 🧪 9. Mini Test

### Câu 1: Node.js dùng để làm gì?
<details>
<summary>Xem đáp án</summary>
Chạy JavaScript bên ngoài trình duyệt, cần để chạy các công cụ build và npm.
</details>

### Câu 2: Vite khác Vue CLI như thế nào?
<details>
<summary>Xem đáp án</summary>
Vite nhanh hơn nhiều (1-3s vs 30-60s), dùng ESM thay vì bundle trong development.
</details>

### Câu 3: `npm install` làm gì?
<details>
<summary>Xem đáp án</summary>
Đọc package.json và tải về tất cả thư viện vào node_modules.
</details>

### Câu 4: File nào là điểm khởi chạy?
<details>
<summary>Xem đáp án</summary>
main.js - nơi tạo và mount Vue app.
</details>

### Câu 5: Hot Reload là gì?
<details>
<summary>Xem đáp án</summary>
Tự động cập nhật trình duyệt khi code thay đổi, không cần refresh thủ công.
</details>

---

## 📌 10. Quick Notes

### Cài đặt
```powershell
# Kiểm tra
node --version
npm --version

# Tạo project
npm create vue@latest

# Cài dependencies
npm install

# Chạy dev
npm run dev
```

### Cấu trúc quan trọng
- `src/main.js` - Điểm khởi chạy
- `src/App.vue` - Component gốc
- `package.json` - Dependencies
- `vite.config.js` - Cấu hình Vite

### Lệnh quan trọng
- `npm run dev` - Development
- `npm run build` - Build production
- `npm run preview` - Preview build

---

**👉 Bài tiếp theo: [03_template_syntax.md](./03_template_syntax.md) - Template Syntax cơ bản**

