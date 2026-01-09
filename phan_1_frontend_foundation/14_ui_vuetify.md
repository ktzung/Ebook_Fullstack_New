# 🟦 TUẦN 3: UI FRAMEWORK (VUETIFY)

## 🎯 Mục tiêu
- Cài đặt thư viện UI Vuetify.
- Sử dụng Grid System để layout responsive.
- Thiết kế giao diện Dashboard và Data Table.

---

## 🎨 1. Tại sao dùng UI Framework?

Thay vì viết CSS từ đầu, UI Framework cung cấp sẵn các component đẹp, chuẩn UX và Responsive.
Trong khóa này, ta dùng **Vuetify** (Material Design cho Vue).

### 1.1. Cài đặt Vuetify
```powershell
npm add vuetify
npm add @mdi/font
```

Cấu hình `main.js`:
```javascript
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})

app.use(vuetify)
```

---

## 📐 2. Grid System

Vuetify dùng hệ thống lưới 12 cột (`v-row`, `v-col`).

```html
<v-container>
  <v-row>
    <!-- Cột chiếm 12 phần (full) trên mobile, 6 phần (một nửa) trên desktop -->
    <v-col cols="12" md="6">
      <div class="bg-red">Cột trái</div>
    </v-col>
    <v-col cols="12" md="6">
      <div class="bg-blue">Cột phải</div>
    </v-col>
  </v-row>
</v-container>
```

---

## 📊 3. Các Component quan trọng

### 3.1. Data Table (`v-data-table`)
Dùng để hiển thị danh sách sản phẩm.

```html
<script setup>
const headers = [
  { title: 'Tên sản phẩm', key: 'name' },
  { title: 'Giá', key: 'price' },
  { title: 'Hành động', key: 'actions', sortable: false },
]

const products = [
  { name: 'iPhone 15', price: 20000000 },
  { name: 'Samsung S24', price: 18000000 },
]
</script>

<template>
  <v-data-table :headers="headers" :items="products">
    <template v-slot:item.actions="{ item }">
      <v-icon color="blue">mdi-pencil</v-icon>
      <v-icon color="red">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>
```

### 3.2. Form Input
```html
<v-text-field label="Tên đăng nhập" variant="outlined"></v-text-field>
<v-btn color="primary">Đăng nhập</v-btn>
```

---

## 🧪 4. Thực hành: Thiết kế Dashboard

1. Trong `views/admin/DashboardPage.vue`:
   - Tạo 4 Card thống kê (Doanh thu, Đơn hàng, Khách hàng...).
   - Dùng `v-row` và `v-col` để chia 4 cột trên Desktop, 2 cột trên Tablet.

2. Trong `views/admin/ProductPage.vue`:
   - Tạo bảng danh sách sản phẩm dùng `v-data-table`.
   - Thêm nút "Thêm mới" ở góc trên.

---

## 💡 Mẹo nhỏ
> [!TIP]
> Tham khảo trang [Vuetify Component Explorer](https://vuetifyjs.com/en/components/all/) để copy code mẫu nhanh chóng.

---

## ❌ 5. Các lỗi thường gặp

### Lỗi 1: Quên import Vuetify styles

**❌ Vấn đề:**
```javascript
// main.js
import { createVuetify } from 'vuetify'
// ❌ Quên import styles
```

**✅ Giải pháp:**
```javascript
import 'vuetify/styles' // ✅ Phải import styles
import { createVuetify } from 'vuetify'
```

**🔍 Giải thích:** Vuetify cần CSS styles để hiển thị đúng.

---

### Lỗi 2: Grid không responsive

**❌ Vấn đề:**
```html
<v-col cols="6"> <!-- ❌ Luôn 6 cột, không responsive -->
```

**✅ Giải pháp:**
```html
<v-col cols="12" sm="6" md="4" lg="3"> <!-- ✅ Responsive -->
```

**🔍 Giải thích:** Dùng breakpoints (xs, sm, md, lg, xl) để responsive.

---

### Lỗi 3: Data Table không hiển thị

**❌ Vấn đề:**
```html
<v-data-table :items="products"> <!-- ❌ Thiếu headers -->
```

**✅ Giải pháp:**
```html
<v-data-table :headers="headers" :items="products"> <!-- ✅ Đầy đủ -->
```

**🔍 Giải thích:** Data table cần cả `headers` và `items`.

---

## 💡 6. Best Practices

### 6.1. Tổ chức Components
- Tách component nhỏ, tái sử dụng
- Dùng slots để customize
- Props validation

### 6.2. Responsive Design
- Mobile-first approach
- Test trên nhiều kích thước màn hình
- Dùng Vuetify breakpoints

### 6.3. Performance
- Lazy load components
- Virtual scrolling cho danh sách dài
- Debounce cho search input

---

## 🎯 7. Case Study: Dashboard hoàn chỉnh

**`views/admin/DashboardPage.vue`:**

```html
<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  { title: 'Doanh thu', value: '125.000.000', icon: 'mdi-cash', color: 'success' },
  { title: 'Đơn hàng', value: '45', icon: 'mdi-cart', color: 'primary' },
  { title: 'Khách hàng', value: '120', icon: 'mdi-account-group', color: 'info' },
  { title: 'Sản phẩm', value: '89', icon: 'mdi-package-variant', color: 'warning' }
])
</script>

<template>
  <v-container>
    <h1 class="mb-4">Dashboard</h1>
    
    <v-row>
      <v-col 
        v-for="stat in stats" 
        :key="stat.title"
        cols="12" 
        sm="6" 
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon :color="stat.color" size="40" class="mr-4">
                {{ stat.icon }}
              </v-icon>
              <div>
                <div class="text-h6">{{ stat.value }}</div>
                <div class="text-caption">{{ stat.title }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
```

---

## 📝 8. Bài tập thực hành

1. Tạo Dashboard với 4 stat cards responsive
2. Tạo Data Table với pagination, search, sort
3. Tạo Form với validation
4. Tạo Dialog/Modal component
5. Tạo Navigation drawer (sidebar)

---

## 🧪 9. Mini Test

### Câu 1: Vuetify dùng Grid System bao nhiêu cột?
<details>
<summary>Xem đáp án</summary>
12 cột
</details>

### Câu 2: Breakpoints trong Vuetify là gì?
<details>
<summary>Xem đáp án</summary>
xs, sm, md, lg, xl - các điểm màn hình khác nhau
</details>

### Câu 3: Làm sao tạo responsive layout?
<details>
<summary>Xem đáp án</summary>
Dùng `cols`, `sm`, `md`, `lg` trong `v-col`
</details>

---

## 📌 10. Quick Notes

### Grid System
```html
<v-container>
  <v-row>
    <v-col cols="12" md="6"> <!-- 12 cột mobile, 6 cột desktop -->
  </v-row>
</v-container>
```

### Common Components
- `v-btn` - Button
- `v-card` - Card
- `v-text-field` - Input
- `v-data-table` - Table
- `v-dialog` - Modal
- `v-navigation-drawer` - Sidebar