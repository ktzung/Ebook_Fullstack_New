# 🟦 BÀI 06: KHỞI TẠO FRONTEND VUE + VUETIFY

## 🎯 Mục tiêu
- Tạo SPA Vue.
- Cài Vuetify + cấu trúc thư mục.

---

## 1) Tạo project
```bash
npm create vite@latest LibraryManagement.Admin -- --template vue
cd LibraryManagement.Admin
npm install
npm add vuetify @mdi/font axios pinia vue-router
```

## 2) Cấu trúc đề xuất
```
src/
  plugins/vuetify.js
  router/index.js
  stores/authStore.js
  services/api.js
  views/
  components/
```

---

## ✅ Checkpoint
- [ ] Chạy được `npm run dev`.
- [ ] Vuetify hiển thị nút mẫu.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: Tạo dự án Vue
```bash
npm create vite@latest LibraryManagement.Admin -- --template vue
cd LibraryManagement.Admin
npm install
```

### Step 2: Cài Vuetify + thư viện cần thiết
```bash
npm add vuetify @mdi/font axios pinia vue-router
```

### Step 3: Cấu hình Vuetify
`src/plugins/vuetify.js`
```javascript
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({ components, directives })
```

`src/main.js`
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'

createApp(App).use(createPinia()).use(vuetify).mount('#app')
```

### Step 4: Test Vuetify
`src/App.vue`
```html
<template>
  <v-app>
    <v-main class="pa-4">
      <v-btn color="primary">Vuetify OK</v-btn>
    </v-main>
  </v-app>
</template>
```
