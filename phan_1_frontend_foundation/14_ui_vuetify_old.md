# ≡ƒƒª TUß║ªN 3: UI FRAMEWORK (VUETIFY)

## ≡ƒÄ» Mß╗Ñc ti├¬u
- C├ái ─æß║╖t th╞░ viß╗çn UI Vuetify.
- Sß╗¡ dß╗Ñng Grid System ─æß╗â layout responsive.
- Thiß║┐t kß║┐ giao diß╗çn Dashboard v├á Data Table.

---

## ≡ƒÄ¿ 1. Tß║íi sao d├╣ng UI Framework?

Thay v├¼ viß║┐t CSS tß╗½ ─æß║ºu, UI Framework cung cß║Ñp sß║╡n c├íc component ─æß║╣p, chuß║⌐n UX v├á Responsive.
Trong kh├│a n├áy, ta d├╣ng **Vuetify** (Material Design cho Vue).

### 1.1. C├ái ─æß║╖t Vuetify
```powershell
npm add vuetify
npm add @mdi/font
```

Cß║Ñu h├¼nh `main.js`:
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

## ≡ƒôÉ 2. Grid System

Vuetify d├╣ng hß╗ç thß╗æng l╞░ß╗¢i 12 cß╗Öt (`v-row`, `v-col`).

```html
<v-container>
  <v-row>
    <!-- Cß╗Öt chiß║┐m 12 phß║ºn (full) tr├¬n mobile, 6 phß║ºn (mß╗Öt nß╗¡a) tr├¬n desktop -->
    <v-col cols="12" md="6">
      <div class="bg-red">Cß╗Öt tr├íi</div>
    </v-col>
    <v-col cols="12" md="6">
      <div class="bg-blue">Cß╗Öt phß║úi</div>
    </v-col>
  </v-row>
</v-container>
```

---

## ≡ƒôè 3. C├íc Component quan trß╗ìng

### 3.1. Data Table (`v-data-table`)
D├╣ng ─æß╗â hiß╗ân thß╗ï danh s├ích sß║ún phß║⌐m.

```html
<script setup>
const headers = [
  { title: 'T├¬n sß║ún phß║⌐m', key: 'name' },
  { title: 'Gi├í', key: 'price' },
  { title: 'H├ánh ─æß╗Öng', key: 'actions', sortable: false },
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
<v-text-field label="T├¬n ─æ─âng nhß║¡p" variant="outlined"></v-text-field>
<v-btn color="primary">─É─âng nhß║¡p</v-btn>
```

---

## ≡ƒº¬ 4. Thß╗▒c h├ánh: Thiß║┐t kß║┐ Dashboard

1. Trong `views/admin/DashboardPage.vue`:
   - Tß║ío 4 Card thß╗æng k├¬ (Doanh thu, ─É╞ín h├áng, Kh├ích h├áng...).
   - D├╣ng `v-row` v├á `v-col` ─æß╗â chia 4 cß╗Öt tr├¬n Desktop, 2 cß╗Öt tr├¬n Tablet.

2. Trong `views/admin/ProductPage.vue`:
   - Tß║ío bß║úng danh s├ích sß║ún phß║⌐m d├╣ng `v-data-table`.
   - Th├¬m n├║t "Th├¬m mß╗¢i" ß╗ƒ g├│c tr├¬n.

---

## ≡ƒÆí Mß║╣o nhß╗Å
> [!TIP]
> Tham khß║úo trang [Vuetify Component Explorer](https://vuetifyjs.com/en/components/all/) ─æß╗â copy code mß║½u nhanh ch├│ng.

---

## Γ¥î 5. C├íc lß╗ùi th╞░ß╗¥ng gß║╖p

### Lß╗ùi 1: Qu├¬n import Vuetify styles

**Γ¥î Vß║Ñn ─æß╗ü:**
```javascript
// main.js
import { createVuetify } from 'vuetify'
// Γ¥î Qu├¬n import styles
```

**Γ£à Giß║úi ph├íp:**
```javascript
import 'vuetify/styles' // Γ£à Phß║úi import styles
import { createVuetify } from 'vuetify'
```

**≡ƒöì Giß║úi th├¡ch:** Vuetify cß║ºn CSS styles ─æß╗â hiß╗ân thß╗ï ─æ├║ng.

---

### Lß╗ùi 2: Grid kh├┤ng responsive

**Γ¥î Vß║Ñn ─æß╗ü:**
```html
<v-col cols="6"> <!-- Γ¥î Lu├┤n 6 cß╗Öt, kh├┤ng responsive -->
```

**Γ£à Giß║úi ph├íp:**
```html
<v-col cols="12" sm="6" md="4" lg="3"> <!-- Γ£à Responsive -->
```

**≡ƒöì Giß║úi th├¡ch:** D├╣ng breakpoints (xs, sm, md, lg, xl) ─æß╗â responsive.

---

### Lß╗ùi 3: Data Table kh├┤ng hiß╗ân thß╗ï

**Γ¥î Vß║Ñn ─æß╗ü:**
```html
<v-data-table :items="products"> <!-- Γ¥î Thiß║┐u headers -->
```

**Γ£à Giß║úi ph├íp:**
```html
<v-data-table :headers="headers" :items="products"> <!-- Γ£à ─Éß║ºy ─æß╗º -->
```

**≡ƒöì Giß║úi th├¡ch:** Data table cß║ºn cß║ú `headers` v├á `items`.

---

## ≡ƒÆí 6. Best Practices

### 6.1. Tß╗ò chß╗⌐c Components
- T├ích component nhß╗Å, t├íi sß╗¡ dß╗Ñng
- D├╣ng slots ─æß╗â customize
- Props validation

### 6.2. Responsive Design
- Mobile-first approach
- Test tr├¬n nhiß╗üu k├¡ch th╞░ß╗¢c m├án h├¼nh
- D├╣ng Vuetify breakpoints

### 6.3. Performance
- Lazy load components
- Virtual scrolling cho danh s├ích d├ái
- Debounce cho search input

---

## ≡ƒÄ» 7. Case Study: Dashboard ho├án chß╗ënh

**`views/admin/DashboardPage.vue`:**

```html
<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  { title: 'Doanh thu', value: '125.000.000', icon: 'mdi-cash', color: 'success' },
  { title: '─É╞ín h├áng', value: '45', icon: 'mdi-cart', color: 'primary' },
  { title: 'Kh├ích h├áng', value: '120', icon: 'mdi-account-group', color: 'info' },
  { title: 'Sß║ún phß║⌐m', value: '89', icon: 'mdi-package-variant', color: 'warning' }
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

## ≡ƒô¥ 8. B├ái tß║¡p thß╗▒c h├ánh

1. Tß║ío Dashboard vß╗¢i 4 stat cards responsive
2. Tß║ío Data Table vß╗¢i pagination, search, sort
3. Tß║ío Form vß╗¢i validation
4. Tß║ío Dialog/Modal component
5. Tß║ío Navigation drawer (sidebar)

---

## ≡ƒº¬ 9. Mini Test

### C├óu 1: Vuetify d├╣ng Grid System bao nhi├¬u cß╗Öt?
<details>
<summary>Xem ─æ├íp ├ín</summary>
12 cß╗Öt
</details>

### C├óu 2: Breakpoints trong Vuetify l├á g├¼?
<details>
<summary>Xem ─æ├íp ├ín</summary>
xs, sm, md, lg, xl - c├íc ─æiß╗âm m├án h├¼nh kh├íc nhau
</details>

### C├óu 3: L├ám sao tß║ío responsive layout?
<details>
<summary>Xem ─æ├íp ├ín</summary>
D├╣ng `cols`, `sm`, `md`, `lg` trong `v-col`
</details>

---

## ≡ƒôî 10. Quick Notes

### Grid System
```html
<v-container>
  <v-row>
    <v-col cols="12" md="6"> <!-- 12 cß╗Öt mobile, 6 cß╗Öt desktop -->
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
