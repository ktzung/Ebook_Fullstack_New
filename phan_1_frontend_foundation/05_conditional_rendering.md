# 🟦 BÀI 5: CONDITIONAL RENDERING (v-if, v-show)

## 🎯 Mục tiêu
- Hiểu khi nào cần conditional rendering
- Sử dụng `v-if`, `v-else`, `v-else-if`
- Sử dụng `v-show`
- So sánh `v-if` vs `v-show`
- Thực hành với các ví dụ thực tế

---

## 🧠 1. Conditional Rendering là gì?

### 🎬 Ví dụ dẫn nhập: Trang Facebook

Hãy tưởng tượng bạn đang xây dựng trang **Facebook**:

**Tình huống thực tế:**
- **Khi chưa đăng nhập**: Hiển thị form "Đăng nhập" / "Đăng ký"
- **Khi đã đăng nhập**: Hiển thị "Xin chào [Tên]", nút "Đăng xuất"
- **Khi có thông báo mới**: Hiển thị badge đỏ với số lượng
- **Khi không có thông báo**: Ẩn badge
- **Khi đang load**: Hiển thị spinner
- **Khi load xong**: Hiển thị nội dung

**Với JavaScript thuần:**
```html
<div id="app"></div>

<script>
  const isLoggedIn = true
  const userName = 'Nguyễn Văn A'
  const notificationCount = 3
  const isLoading = false
  
  function render() {
    let html = ''
    
    if (isLoading) {
      html = '<div>Đang tải...</div>'
    } else if (isLoggedIn) {
      html = `
        <div>
          <p>Xin chào ${userName}!</p>
          ${notificationCount > 0 ? `<span>Thông báo: ${notificationCount}</span>` : ''}
          <button>Đăng xuất</button>
        </div>
      `
    } else {
      html = `
        <div>
          <input placeholder="Email">
          <input placeholder="Password">
          <button>Đăng nhập</button>
        </div>
      `
    }
    
    document.getElementById('app').innerHTML = html
  }
  
  // ❌ Phải tự render lại mỗi khi state thay đổi
  render()
</script>
```

**Vấn đề:**
- Phải tự select element
- Phải tự update DOM
- Code dài dòng, khó maintain
- Dễ quên update khi state thay đổi

**Với Vue Conditional Rendering:**
```vue
<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading">
      <p>Đang tải...</p>
    </div>
    
    <!-- Logged in state -->
    <div v-else-if="isLoggedIn">
      <p>Xin chào {{ userName }}!</p>
      <span v-if="notificationCount > 0">
        Thông báo: {{ notificationCount }}
      </span>
      <button @click="logout">Đăng xuất</button>
    </div>
    
    <!-- Not logged in state -->
    <div v-else>
      <!-- Lưu ý: v-model sẽ được học ở Bài 7 -->
      <!-- Hiện tại chỉ hiển thị form đăng nhập đơn giản -->
      <input type="email" placeholder="Email">
      <input type="password" placeholder="Password">
      <button @click="login">Đăng nhập</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
const isLoggedIn = ref(true)
const userName = ref('Nguyễn Văn A')
const notificationCount = ref(3)
const email = ref('')
const password = ref('')

function login() {
  isLoggedIn.value = true
  // ✅ Vue tự động update UI!
}

function logout() {
  isLoggedIn.value = false
  // ✅ Vue tự động update UI!
}
</script>
```

**Ưu điểm:**
- Code ngắn gọn, dễ đọc
- Tự động update khi state thay đổi
- Dễ maintain

### Vấn đề

Trong JavaScript thuần, để hiển thị/ẩn element:
```html
<div id="message"></div>

<script>
  const isLoggedIn = true
  
  if (isLoggedIn) {
    document.getElementById('message').textContent = 'Xin chào!'
    document.getElementById('message').style.display = 'block'
  } else {
    document.getElementById('message').style.display = 'none'
  }
</script>
```

**Vấn đề:**
- Phải tự select element
- Phải tự update DOM
- Code dài dòng, khó maintain

### 🌐 Liên hệ thực tế

**Conditional Rendering được dùng ở mọi nơi:**
- **Facebook**: Hiển thị/ẩn menu theo quyền, hiển thị/ẩn nút "Like" theo trạng thái
- **YouTube**: Hiển thị/ẩn nút "Subscribe" theo trạng thái đăng ký
- **Shopee**: Hiển thị "Còn hàng" / "Hết hàng", hiển thị/ẩn form đăng nhập
- **Gmail**: Hiển thị/ẩn email đã đọc, hiển thị/ẩn attachment
- **Banking App**: Hiển thị/ẩn số dư theo quyền, hiển thị/ẩn nút chuyển tiền

**Tất cả đều dùng Conditional Rendering để hiển thị/ẩn nội dung!**

### Giải pháp: Vue Directives

Vue cung cấp `v-if` và `v-show` để render có điều kiện:

```vue
<template>
  <div v-if="isLoggedIn">
    Xin chào!
  </div>
  <div v-else>
    Vui lòng đăng nhập
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(true)
</script>
```

**Ưu điểm:**
- Code ngắn gọn
- Tự động update khi data thay đổi
- Dễ đọc, dễ maintain

---

## ✅ 2. v-if, v-else, v-else-if

### v-if cơ bản

**Cú pháp:**
```vue
<div v-if="condition">Hiển thị nếu condition = true</div>
```

**Ví dụ:**
```vue
<template>
  <div>
    <p v-if="isVisible">Tôi đang hiển thị!</p>
    <button @click="toggle">Toggle</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(true)

function toggle() {
  isVisible.value = !isVisible.value
}
</script>
```

**Cách hoạt động:**
- Nếu `isVisible = true` → Element được render vào DOM
- Nếu `isVisible = false` → Element bị xóa khỏi DOM

### v-else

Dùng khi có 2 trường hợp đối lập:

```vue
<template>
  <div>
    <p v-if="isLoggedIn">Xin chào, {{ userName }}!</p>
    <p v-else>Vui lòng đăng nhập</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userName = ref('Nguyễn Văn A')
</script>
```

**Lưu ý:** `v-else` phải đi ngay sau `v-if` hoặc `v-else-if`.

### v-else-if

Dùng khi có nhiều điều kiện:

```vue
<template>
  <div>
    <p v-if="score >= 90">Xuất sắc!</p>
    <p v-else-if="score >= 70">Khá</p>
    <p v-else-if="score >= 50">Trung bình</p>
    <p v-else>Cần cố gắng</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const score = ref(85)
</script>
```

**Kết quả:** Hiển thị "Khá" (vì 85 >= 70)

---

## 👁️ 3. v-show

### Cú pháp

```vue
<div v-show="condition">Hiển thị/ẩn dựa trên condition</div>
```

**Ví dụ:**
```vue
<template>
  <div>
    <p v-show="isVisible">Tôi có thể ẩn/hiện</p>
    <button @click="toggle">Toggle</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(true)

function toggle() {
  isVisible.value = !isVisible.value
}
</script>
```

**Cách hoạt động:**
- Luôn render vào DOM
- Chỉ thay đổi CSS `display: none/block`

---

## ⚖️ 4. v-if vs v-show

### So sánh

| Đặc điểm | v-if | v-show |
|----------|------|--------|
| **DOM** | Thêm/xóa element | Luôn có, chỉ ẩn/hiện |
| **Performance** | Tốt khi ít render | Tốt khi toggle nhiều |
| **Initial cost** | Thấp (không render) | Cao (render ngay) |
| **Toggle cost** | Cao (thêm/xóa DOM) | Thấp (chỉ CSS) |
| **Lifecycle hooks** | Có (mount/unmount) | Không |

### Khi nào dùng v-if?

✅ **Dùng v-if khi:**
- Điều kiện ít thay đổi
- Cần tối ưu initial render
- Cần lifecycle hooks (mounted, unmounted)

**Ví dụ:**
```vue
<template>
  <!-- Chỉ render khi cần -->
  <AdminPanel v-if="user.role === 'admin'" />
</template>
```

### Khi nào dùng v-show?

✅ **Dùng v-show khi:**
- Toggle thường xuyên (menu, dropdown)
- Cần giữ state của component
- Performance khi toggle quan trọng

**Ví dụ:**
```vue
<template>
  <!-- Toggle nhiều lần -->
  <div v-show="isMenuOpen">
    <Menu />
  </div>
</template>
```

---

## 💻 5. Ví dụ thực tế

### Ví dụ 1: Login/Logout UI

```vue
<template>
  <div>
    <!-- Hiển thị khi đã login -->
    <div v-if="isLoggedIn">
      <p>Xin chào, {{ userName }}!</p>
      <button @click="logout">Đăng xuất</button>
    </div>
    
    <!-- Hiển thị khi chưa login -->
    <div v-else>
      <!-- Lưu ý: v-model sẽ được học ở Bài 7 -->
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button @click="login">Đăng nhập</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userName = ref('')
const username = ref('')
const password = ref('')

function login() {
  // Giả lập login
  isLoggedIn.value = true
  userName.value = username.value
}

function logout() {
  isLoggedIn.value = false
  userName.value = ''
}
</script>
```

### Ví dụ 2: Loading State

```vue
<template>
  <div>
    <!-- Loading -->
    <div v-if="isLoading">
      <p>Đang tải...</p>
    </div>
    
    <!-- Error -->
    <div v-else-if="error">
      <p>Lỗi: {{ error }}</p>
      <button @click="retry">Thử lại</button>
    </div>
    
    <!-- Success -->
    <div v-else>
      <p>Dữ liệu: {{ data }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
const error = ref(null)
const data = ref(null)

// Giả lập load data
setTimeout(() => {
  isLoading.value = false
  data.value = 'Dữ liệu đã tải xong!'
}, 2000)
</script>
```

### Ví dụ 3: Menu Toggle (dùng v-show)

```vue
<template>
  <div>
    <button @click="toggleMenu">Menu</button>
    
    <!-- Dùng v-show vì toggle nhiều -->
    <nav v-show="isMenuOpen">
      <ul>
        <li>Trang chủ</li>
        <li>Sản phẩm</li>
        <li>Liên hệ</li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
```

---

## ⚠️ 6. Các lỗi thường gặp

### Lỗi 1: v-else không đi sau v-if

**❌ Vấn đề:**
```vue
<template>
  <p v-if="condition">A</p>
  <div>Khác</div>
  <p v-else>B</p>  <!-- ❌ Lỗi -->
</template>
```

**✅ Giải pháp:**
```vue
<template>
  <p v-if="condition">A</p>
  <p v-else>B</p>  <!-- ✅ Đúng -->
</template>
```

---

### Lỗi 2: Dùng v-if trên cùng element với v-for

**❌ Vấn đề:**
```vue
<template>
  <li v-for="item in items" v-if="item.visible">
    {{ item.name }}
  </li>
</template>
```

**✅ Giải pháp:**
```vue
<template>
  <template v-for="item in items" :key="item.id">
    <li v-if="item.visible">
      {{ item.name }}
    </li>
  </template>
</template>
```

---

### Lỗi 3: Dùng v-if thay v-show cho toggle thường xuyên

**❌ Vấn đề:**
```vue
<!-- Toggle nhiều lần nhưng dùng v-if -->
<div v-if="isOpen">Menu</div>  <!-- ❌ Chậm -->
```

**✅ Giải pháp:**
```vue
<!-- Dùng v-show -->
<div v-show="isOpen">Menu</div>  <!-- ✅ Nhanh -->
```

---

## 💡 7. Best Practices

### 1. Dùng template tag cho multiple elements

```vue
<template>
  <!-- ✅ Tốt -->
  <template v-if="isLoggedIn">
    <h2>Dashboard</h2>
    <p>Welcome back!</p>
    <button>Logout</button>
  </template>
  
  <!-- ❌ Tránh - Phải wrap trong div -->
  <div v-if="isLoggedIn">
    <h2>Dashboard</h2>
    <p>Welcome back!</p>
  </div>
</template>
```

### 2. Tránh v-if phức tạp trong template

```vue
<!-- ❌ Tránh -->
<p v-if="user && user.role && user.role === 'admin' && !user.isBanned">
  Admin Panel
</p>

<!-- ✅ Tốt -->
<p v-if="canAccessAdmin">
  Admin Panel
</p>

<script setup>
const canAccessAdmin = computed(() => {
  return user.value && 
         user.value.role === 'admin' && 
         !user.value.isBanned
})
</script>
```

---

## 🧪 8. Thực hành

### Bài tập 1: Login Form
Tạo form login:
- Hiển thị form khi chưa login
- Hiển thị "Xin chào" khi đã login
- Có nút đăng xuất

### Bài tập 2: Rating Display
Hiển thị sao dựa trên điểm:
- >= 4.5: 5 sao
- >= 3.5: 4 sao
- >= 2.5: 3 sao
- >= 1.5: 2 sao
- < 1.5: 1 sao

### Bài tập 3: Toggle Menu
Tạo menu có thể toggle:
- Dùng v-show
- Có animation khi mở/đóng

---

## 🧪 9. Mini Test

### Câu 1: v-if khác v-show như thế nào?
<details>
<summary>Xem đáp án</summary>
v-if: Thêm/xóa element khỏi DOM. v-show: Luôn có trong DOM, chỉ ẩn/hiện bằng CSS.
</details>

### Câu 2: Khi nào nên dùng v-if?
<details>
<summary>Xem đáp án</summary>
Khi điều kiện ít thay đổi, cần tối ưu initial render, cần lifecycle hooks.
</details>

### Câu 3: Khi nào nên dùng v-show?
<details>
<summary>Xem đáp án</summary>
Khi toggle thường xuyên (menu, dropdown), cần giữ state, performance khi toggle quan trọng.
</details>

### Câu 4: v-else phải đặt ở đâu?
<details>
<summary>Xem đáp án</summary>
Ngay sau v-if hoặc v-else-if, không được có element khác ở giữa.
</details>

---

## 📌 10. Quick Notes

### v-if Syntax
```vue
<div v-if="condition">A</div>
<div v-else-if="condition2">B</div>
<div v-else>C</div>
```

### v-show Syntax
```vue
<div v-show="condition">Content</div>
```

### So sánh
- **v-if**: Thêm/xóa DOM, tốt cho ít toggle
- **v-show**: CSS display, tốt cho nhiều toggle

---

**👉 Bài tiếp theo: [06_list_rendering.md](./06_list_rendering.md) - List Rendering với v-for**

