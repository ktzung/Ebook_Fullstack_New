# 🟦 TUẦN 3: UI FRAMEWORK (VUETIFY) - HƯỚNG DẪN THỰC HÀNH CHI TIẾT

## 🎯 Mục tiêu
- Cài đặt và cấu hình Vuetify chuẩn cho dự án Vue 3.
- **Làm chủ Grid System**: Responsive, Alignment, Spacing.
- **Thành thạo Components**: Buttons, Cards, Forms, Tables, Dialogs.
- **Tùy biến giao diện**: Theme, Colors, Typography.
- Thực hành xây dựng giao diện Dashboard và CRUD chuyên nghiệp.

---

## 🧭 1. Tổng quan về Vuetify 3
Vuetify là framework UI Material Design phổ biến nhất cho Vue.
- **Ưu điểm**: Hàng trăm component "mì ăn liền", chuẩn Google Material You, cộng đồng lớn.
- **Nhược điểm**: Kích thước bundle có thể lớn nếu không tree-shaking (Vite đã xử lý tốt).

---

## 🛠️ 2. Cài đặt Vuetify (Vue 3 + Vite)

### 2.1. Cài đặt thủ công (Khuyên dùng để hiểu bản chất)
Nếu đã có dự án Vue:
```powershell
npm add vuetify
npm add @mdi/font  # Bộ icon Material Design
```

### 2.2. Cấu hình `src/main.js`
```javascript
import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Icons
import '@mdi/font/css/materialdesignicons.css' 

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2', // Xanh dương đậm
          secondary: '#424242', // Xám đậm
          success: '#2E7D32',
          warning: '#ED6C02',
          error: '#D32F2F',
          surface: '#FFFFFF',
        },
      },
    },
  },
})

createApp(App).use(vuetify).mount('#app')
```

---

## 📐 3. Grid System & Layout (Quan trọng)

Vuetify sử dụng hệ thống lưới 12 cột dựa trên Flexbox.
Cấu trúc: `v-container` > `v-row` > `v-col`.

### 3.1. Breakpoints
| Mã | Kích thước màn hình | Thiết bị ví dụ |
| :--- | :--- | :--- |
| **xs** | < 600px | Mobile (đứng) |
| **sm** | 600px - 960px | Tablet (nhỏ), Mobile (ngang) |
| **md** | 960px - 1280px | Laptop, Tablet (lớn) |
| **lg** | 1280px - 1920px | Màn hình Desktop |
| **xl** | > 1920px | Màn hình siêu rộng |

### 3.2. Cách chia cột Responsive
```html
<v-row>
  <!-- Mobile: 12 cột (full dòng), Tablet/Desktop: 6 cột (1/2 dòng) -->
  <v-col cols="12" md="6">
    <div class="bg-primary pa-4">Cột 1</div>
  </v-col>
  
  <v-col cols="12" md="6">
    <div class="bg-secondary pa-4">Cột 2</div>
  </v-col>
</v-row>
```

### 3.3. Canh chỉnh (Flex Helpers)
Dùng props trên `v-row`:
- `justify`: `start`, `center`, `end`, `space-between`, `space-around`.
- `align` (trục dọc): `start`, `center`, `end`.

```html
<v-row justify="center" align="center" style="height: 200px;">
  <v-col cols="4">Giữa màn hình</v-col>
</v-row>
```

### 3.4. Khoảng cách (Gutters)
Mặc định `v-row` có khoảng cách giữa các cột.
- `no-gutters`: Xóa khoảng cách.
- `dense`: Giảm khoảng cách.

---

## 🎨 4. Style & Helper Classes (Dùng hàng ngày)
Thay vì viết CSS thủ công, hãy dùng utility classes của Vuetify.

### 4.1. Spacing (Margin & Padding)
Công thức: `{property}{direction}-{size}`
- **Property**: `m` (margin), `p` (padding).
- **Direction**: `t` (top), `b` (bottom), `l` (left), `r` (right), `x` (trái+phải), `y` (trên+dưới), `a` (all).
- **Size**: 0 đến 16 (mỗi đơn vị = 4px).

Ví dụ:
- `ma-4` = `margin: 16px`
- `px-2` = `padding-left: 8px; padding-right: 8px`
- `mt-n2` = `margin-top: -8px` (số âm)
- `mb-auto` = `margin-bottom: auto`

### 4.2. Typography (Chữ)
- **Cỡ chữ**: `text-h1` ... `text-h6`, `text-body-1`, `text-caption` (nhỏ), `text-overline` (in hoa nhỏ).
- **Căn lề**: `text-center`, `text-right`, `text-justify`.
- **Màu sắc**: `text-primary`, `text-red`, `text-grey-darken-1`.
- **Kiểu**: `font-weight-bold`, `text-uppercase`, `font-italic`.

### 4.3. Colors & Background
- `bg-primary`, `bg-red-lighten-4`.
- Sử dụng màu trong component: `color="primary"`.

---

## 🧩 5. Các Component thiết yếu (Chi tiết)

### 5.1. Buttons (`v-btn`)
Nút bấm là linh hồn của tương tác.
```html
<!-- Các loại variant -->
<v-btn variant="elevated">Mặc định (Có bóng)</v-btn>
<v-btn variant="flat">Phẳng (Không bóng)</v-btn>
<v-btn variant="tonal">Nhẹ nhàng (Nền nhạt)</v-btn>
<v-btn variant="outlined">Viền</v-btn>
<v-btn variant="text">Chỉ có chữ</v-btn>
<v-btn variant="plain">Thuần text (Không hover bg)</v-btn>

<!-- Kích thước & Trạng thái -->
<v-btn size="small">Nhỏ</v-btn>
<v-btn size="large">Lớn</v-btn>
<v-btn block>Full chiều rộng</v-btn>
<v-btn loading>Đang tải...</v-btn>
<v-btn disabled>Vô hiệu</v-btn>

<!-- Icon Button -->
<v-btn icon="mdi-heart" color="red" variant="text"></v-btn>
<v-btn prepend-icon="mdi-check" color="success">Lưu lại</v-btn>
```

### 5.2. Cards (`v-card`)
Khung chứa nội dung đa năng.
```html
<v-card
  class="mx-auto"
  max-width="400"
  variant="elevated" <!-- elevated, toner, outlined -->
  hover <!-- Hiệu ứng khi di chuột -->
>
  <v-img src="https://..." height="200" cover></v-img>
  
  <v-card-item>
    <v-card-title>Tiêu đề Card</v-card-title>
    <v-card-subtitle>Phụ đề nhỏ bên dưới</v-card-subtitle>
  </v-card-item>

  <v-card-text>
    Nội dung chính của card. Có thể chứa chữ, form, hoặc bất cứ gì.
  </v-card-text>

  <v-card-actions>
    <v-spacer></v-spacer> <!-- Đẩy nút sang phải -->
    <v-btn variant="text" color="primary">Chi tiết</v-btn>
    <v-btn variant="elevated" color="primary">Mua ngay</v-btn>
  </v-card-actions>
</v-card>
```

### 5.3. Form Inputs (Nhập liệu)
Tất cả form control của Vuetify đều hỗ trợ: `v-model`, `rules`, `label`, `variant`, `density`...

**a. Text Field (`v-text-field`)**
```html
<v-text-field
  label="Họ tên"
  variant="outlined" <!-- underlined, solo, filled... -->
  density="compact" <!-- Làm input gọn hơn -->
  prepend-inner-icon="mdi-account" <!-- Icon bên trong, bên trái -->
  append-inner-icon="mdi-eye" <!-- Icon bên trong, bên phải -->
  clearable <!-- Nút X để xóa -->
  hint="Nhập đầy đủ họ tên"
  persistent-hint
></v-text-field>
```

**b. Select (`v-select` & `v-autocomplete`)**
- `v-select`: Danh sách thả xuống đơn giản.
- `v-autocomplete`: Có ô tìm kiếm (dùng khi list dài).
```html
<v-select
  :items="['Hà Nội', 'Đà Nẵng', 'TP.HCM']"
  label="Tỉnh/Thành"
  variant="outlined"
  multiple
  chips
></v-select>
```

**c. Checkbox, Radio, Switch**
```html
<v-checkbox label="Đồng ý điều khoản" color="primary"></v-checkbox>

<v-radio-group v-model="gender" inline>
  <v-radio label="Nam" value="male"></v-radio>
  <v-radio label="Nữ" value="female"></v-radio>
</v-radio-group>

<v-switch label="Chế độ tối" color="indigo" inset></v-switch>
```

### 5.4. Data Table (`v-data-table`)
Component mạnh mẽ nhất để hiển thị dữ liệu dạng bảng.
*Cần cài thêm:* `npm add v-data-table` (nếu dùng bản Vuetify labs cũ, nhưng bản mới đã tích hợp sẵn).

```html
<v-data-table
  :headers="headers"
  :items="items"
  items-per-page="5"
  hover
>
  <!-- Custom hiển thị 1 cột cụ thể -->
  <template v-slot:item.status="{ item }">
    <v-chip :color="item.status === 'Active' ? 'success' : 'error'">
      {{ item.status }}
    </v-chip>
  </template>

  <!-- Custom toolbar trên bảng -->
  <template v-slot:top>
    <v-toolbar flat>
      <v-toolbar-title>Danh sách User</v-toolbar-title>
    </v-toolbar>
  </template>
</v-data-table>
```

### 5.5. Dialogs & Overlays
Tương tác nổi trên giao diện.

**a. Dialog (`v-dialog`)**
Dùng cho Modal, Popup form.
```html
<v-dialog v-model="isOpen" width="500" persistent>
  <v-card>
    <v-card-title>Xác nhận</v-card-title>
    <v-card-text>Bạn có chắc muốn xóa?</v-card-text>
    <v-card-actions>
      <v-btn @click="isOpen = false">Hủy</v-btn>
      <v-btn color="error" @click="deleteItem">Xóa</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**b. Snackbar (`v-snackbar`)**
Thông báo nhỏ góc màn hình (Toast).
```html
<v-snackbar v-model="showToast" color="success" timeout="3000" location="top right">
  Lưu thành công!
  <template v-slot:actions>
    <v-btn variant="text" @click="showToast = false">Đóng</v-btn>
  </template>
</v-snackbar>
```

---

## 🧩 6. Thực hành: Xây dựng Dashboard Quản trị

### 6.1. Layout App Shell (`v-app`, `v-navigation-drawer`, `v-app-bar`)
Đây là bộ khung chuẩn cho mọi Web App.

```html
<script setup>
import { ref } from 'vue'
const drawer = ref(true)
const rail = ref(false) // Chế độ thu nhỏ menu
</script>

<template>
  <v-app>
    <!-- Sidebar trái -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="Admin User"
        subtitle="admin@example.com"
        nav
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Khách hàng" value="users"></v-list-item>
        <v-list-item prepend-icon="mdi-package-variant" title="Sản phẩm" value="products"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Header trên cùng -->
    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="!drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Hệ thống Quản lý</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-bell"></v-btn>
      <v-btn icon="mdi-logout"></v-btn>
    </v-app-bar>

    <!-- Nội dung chính -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### 6.2. Trang Dashboard (Grid + Cards)
```html
<template>
  <v-row>
    <v-col cols="12" sm="6" md="3" v-for="item in stats" :key="item.title">
      <v-card class="mx-auto" :color="item.color" theme="dark">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="text-h5">{{ item.value }}</v-card-title>
            <v-card-subtitle>{{ item.title }}</v-card-subtitle>
          </div>
          <v-avatar class="ma-3" size="125" rounded="0">
            <v-icon size="64">{{ item.icon }}</v-icon>
          </v-avatar>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- Biểu đồ hoặc bảng bên dưới -->
  <v-row class="mt-4">
    <v-col cols="12" md="8">
      <v-card title="Doanh thu theo tháng" height="400">
        <!-- Chỗ để biểu đồ (Chart.js / ApexCharts) -->
        <div class="d-flex align-center justify-center h-100 bg-grey-lighten-3">
          Chart Placeholder
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card title="Hoạt động gần đây" height="400">
        <v-list lines="one">
          <v-list-item title="Đơn hàng mới #123" subtitle="2 phút trước" prepend-icon="mdi-cart"></v-list-item>
          <v-list-item title="User đăng ký" subtitle="5 phút trước" prepend-icon="mdi-account"></v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>
```

---

## 🧩 7. Dự án CRUD (Nâng cao): Quản lý Sản phẩm

### 7.1. Cấu trúc dữ liệu & Store (Pinia)
(Như phần trước, dùng MockAPI để test thật).

### 7.2. Giao diện CRUD hoàn chỉnh
Kết hợp: Toolbar tìm kiếm, Data Table, Dialog Form thêm/sửa, Confirm Dialog xóa.

**`ProductsView.vue`**
```html
<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const dialog = ref(false)
const dialogDelete = ref(false)
const headers = [
  { title: 'Sản phẩm', key: 'name' },
  { title: 'Giá', key: 'price' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Hành động', key: 'actions', sortable: false },
]
const products = ref([]) // Load từ API
const editedItem = ref({})
</script>

<template>
  <v-card flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Tìm kiếm"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="products"
      :search="search"
    >
      <!-- Custom Toolbar -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Danh sách sản phẩm</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="dialog = true">
            Tạo mới
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Custom Column Giá -->
      <template v-slot:item.price="{ item }">
        <span class="text-green font-weight-bold">{{ item.price }} đ</span>
      </template>

      <!-- Custom Column Actions -->
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon size="small" color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Dialog Form Thêm/Sửa -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedItem.id ? 'Sửa' : 'Thêm' }} Sản phẩm</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.name" label="Tên SP"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.price" label="Giá" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.status" :items="['Còn hàng', 'Hết hàng']" label="Trạng thái"></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Hủy</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
```

---

## 🎨 8. Theming: Light, Dark & Custom Theme (Nâng cao)

### 8.1. Chuyển đổi Light/Dark Mode
Trong component bất kỳ:
```script
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
```
Nút bấm toggle:
```html
<v-btn icon @click="toggleTheme">
  <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
</v-btn>
```

### 8.2. Định nghĩa Brand Colors
Sửa trong `createVuetify` (`main.js`):
```javascript
theme: {
  themes: {
    light: {
      colors: {
        background: '#f5f5f5',
        primary: '#6200EE', // Tím Google
        secondary: '#03DAC6', // Xanh ngọc
        'on-primary': '#FFFFFF', // Màu chữ trên nền primary
      }
    }
  }
}
```
Sử dụng: `class="bg-background text-primary"` hoặc `<v-btn color="primary">`.

---

## ⚠️ 9. Các lỗi thường gặp & Mẹo
1.  **Lỗi icon không hiện**: Quên cài `@mdi/font` hoặc quên import css trong `main.js`.
2.  **Lỗi `v-row` bị tràn ngang**: Do `v-row` có margin âm. Luôn bọc `v-row` trong `v-container`.
3.  **Lỗi Form không validate**: Cần wrap trong `v-form` và gọi `form.value.validate()`.
4.  **Tối ưu**: Chỉ import components cần dùng (Tree shaking) thay vì import `*` nếu dự án quá lớn (Vite làm điều này khá tốt tự động, nhưng cần lưu ý nếu config thủ công).