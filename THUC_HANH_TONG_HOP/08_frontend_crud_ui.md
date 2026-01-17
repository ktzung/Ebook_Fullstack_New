# 🟦 BÀI 08: UI CRUD + HIỂN THỊ THEO ROLE

## 🎯 Mục tiêu
- Hiển thị danh sách Books/Categories.
- Ẩn/hiện nút theo role.

---

## 1) Categories UI
- Admin thấy: Thêm/Sửa/Xóa
- Librarian/Reader: chỉ xem

## 2) Books UI
- Admin + Librarian: Thêm/Sửa
- Admin: Xóa
- Guest: không vào trang (router guard)

---

## ✅ Checkpoint
- [ ] Nút hiển thị đúng role.
- [ ] API nhận JWT hợp lệ.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: CategoriesPage (list + action)
`src/views/CategoriesPage.vue`
```html
<script setup>
import { ref, onMounted } from 'vue'
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
```

### Step 2: BooksPage (list + action)
`src/views/BooksPage.vue`
```html
<script setup>
import { ref, onMounted } from 'vue'
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
```

### Step 3: Hiển thị nút theo role
```html
<v-btn v-if="auth.isAdmin" color="primary">Thêm thể loại</v-btn>
<v-btn v-if="auth.isAdmin || auth.isLibrarian" color="primary">Thêm sách</v-btn>
```

### Step 4: Dialog form (gợi ý)
```html
<v-dialog v-model="open" width="500">
  <v-card>
    <v-card-title>Thêm / Sửa</v-card-title>
    <v-card-text>
      <v-text-field label="Tên" />
      <v-text-field label="Giá" type="number" />
      <v-btn color="primary">Lưu</v-btn>
    </v-card-text>
  </v-card>
</v-dialog>
```
