# 🟦 BÀI 4: REACTIVITY VỚI ref() - TỪ JAVASCRIPT THUẦN SANG VUE

## 🎯 Mục tiêu
- Hiểu Reactivity là gì và tại sao cần
- So sánh JavaScript thuần vs Vue Reactive
- Sử dụng `ref()` cho primitive values
- Hiểu khi nào cần `.value` và khi nào không
- Thực hành với các ví dụ từ đơn giản đến phức tạp

---

## 🧠 1. Reactivity là gì?

### 🎬 Ví dụ dẫn nhập: Giỏ hàng trên Shopee

Hãy tưởng tượng bạn đang code tính năng **giỏ hàng** cho website bán hàng:

**Tình huống thực tế:**
- User click "Thêm vào giỏ" → Số lượng trong giỏ tăng lên
- User click "Xóa" → Số lượng giảm xuống
- Tổng tiền phải tự động tính lại mỗi khi số lượng thay đổi

**Với JavaScript thuần:**
```html
<!DOCTYPE html>
<html>
<body>
  <p>Số lượng: <span id="quantity">0</span></p>
  <p>Tổng tiền: <span id="total">0</span> đ</p>
  <button onclick="addToCart()">Thêm vào giỏ</button>
  <button onclick="removeFromCart()">Xóa</button>
  
  <script>
    let quantity = 0
    const price = 200000
    
    function addToCart() {
      quantity++  // ✅ Data thay đổi
      // ❌ Phải tự update DOM
      document.getElementById('quantity').textContent = quantity
      document.getElementById('total').textContent = (quantity * price).toLocaleString('vi-VN')
    }
    
    function removeFromCart() {
      if (quantity > 0) {
        quantity--  // ✅ Data thay đổi
        // ❌ Phải tự update DOM lại
        document.getElementById('quantity').textContent = quantity
        document.getElementById('total').textContent = (quantity * price).toLocaleString('vi-VN')
      }
    }
  </script>
</body>
</html>
```

**Vấn đề:**
- Mỗi lần data thay đổi → Phải update **nhiều chỗ** trong DOM
- Dễ quên update → UI không đồng bộ
- Code lặp lại nhiều

**Với Vue Reactivity:**
```vue
<template>
  <div>
    <p>Số lượng: {{ quantity }}</p>
    <p>Tổng tiền: {{ totalPrice.toLocaleString('vi-VN') }} đ</p>
    <button @click="addToCart">Thêm vào giỏ</button>
    <button @click="removeFromCart">Xóa</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const quantity = ref(0)
const price = 200000

const totalPrice = computed(() => quantity.value * price)

function addToCart() {
  quantity.value++  // ✅ Chỉ cần thay đổi data
  // ✅ Vue TỰ ĐỘNG update DOM!
  // ✅ totalPrice TỰ ĐỘNG tính lại!
}

function removeFromCart() {
  if (quantity.value > 0) {
    quantity.value--  // ✅ Chỉ cần thay đổi data
    // ✅ Vue TỰ ĐỘNG update tất cả!
  }
}
</script>
```

**Ưu điểm:**
- Chỉ cần thay đổi data → Vue tự động update DOM
- Không cần select element
- Không lo quên update
- Code ngắn gọn, dễ maintain

### Vấn đề với JavaScript thuần

**Ví dụ JavaScript thuần:**
```html
<!DOCTYPE html>
<html>
<body>
  <p id="count">0</p>
  <button onclick="increment()">Tăng</button>
  
  <script>
    let count = 0
    
    function increment() {
      count++  // ✅ Biến đã thay đổi
      // ❌ Nhưng DOM không tự động cập nhật!
      // Phải tự update DOM
      document.getElementById('count').textContent = count
    }
  </script>
</body>
</html>
```

**Vấn đề:**
- Khi `count` thay đổi, DOM **KHÔNG tự động** cập nhật
- Phải **thủ công** select element và update
- Dễ quên update → UI không đồng bộ với data

### 🌐 Liên hệ thực tế

**Reactivity là nền tảng của các ứng dụng hiện đại:**
- **Facebook**: Like một bài viết → Số like tự động tăng, không cần reload
- **YouTube**: Xem video → Số lượt xem tự động tăng
- **Shopee**: Thêm vào giỏ → Số lượng trong icon giỏ tự động update
- **Gmail**: Email mới đến → Danh sách tự động cập nhật
- **Banking App**: Chuyển tiền → Số dư tự động cập nhật ngay lập tức

**Tất cả đều nhờ Reactivity!**

### Giải pháp: Reactivity trong Vue

**Reactivity** = Tự động cập nhật DOM khi data thay đổi

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">Tăng</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)  // ✅ Tạo reactive variable

function increment() {
  count.value++  // ✅ Chỉ cần thay đổi data
  // ✅ Vue TỰ ĐỘNG cập nhật DOM!
}
</script>
```

**Khác biệt:**
- JavaScript: Thay đổi data → Phải tự update DOM
- Vue: Thay đổi data → Vue tự động update DOM

---

## 🔄 2. ref() là gì?

### Giới thiệu

**`ref()`** là function tạo **reactive reference** (tham chiếu phản ứng) cho một giá trị.

```javascript
import { ref } from 'vue'

const count = ref(0)  // Tạo reactive variable
```

**`ref()` trả về gì?**
- Không phải giá trị trực tiếp
- Mà là một **object wrapper** chứa giá trị trong property `.value`

```javascript
const count = ref(0)

console.log(count)        // RefImpl { value: 0 }
console.log(count.value)  // 0
```

### Tại sao cần wrapper?

Vue cần wrapper để:
1. **Theo dõi** khi nào giá trị thay đổi
2. **Trigger** cập nhật DOM khi cần
3. **Tối ưu** performance (chỉ update phần thay đổi)

---

## 📝 3. Sử dụng ref() - Quy tắc quan trọng

### Quy tắc 1: Dùng `.value` trong `<script>`

**Trong `<script setup>`:**
```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const name = ref('Vue')

// ✅ ĐÚNG - Phải dùng .value
function increment() {
  count.value++  // ✅
}

function updateName() {
  name.value = 'Vue 3'  // ✅
}

// ❌ SAI - Không dùng .value
function wrong() {
  count++  // ❌ Lỗi!
  name = 'Vue 3'  // ❌ Lỗi!
}
</script>
```

### Quy tắc 2: KHÔNG dùng `.value` trong `<template>`

**Trong `<template>`:**
```vue
<template>
  <div>
    <!-- ✅ ĐÚNG - Vue tự động unwrap -->
    <p>{{ count }}</p>
    <p>{{ name }}</p>
    
    <!-- ❌ SAI - Không cần .value -->
    <p>{{ count.value }}</p>
  </div>
</template>
```

**Tại sao?**
- Vue tự động **unwrap** (bỏ wrapper) trong template
- Giúp code gọn gàng hơn

### Tóm tắt

| Nơi | Có dùng .value? | Ví dụ |
|-----|----------------|-------|
| **`<script>`** | ✅ **CÓ** | `count.value++` |
| **`<template>`** | ❌ **KHÔNG** | `{{ count }}` |

---

## 💻 4. Ví dụ thực tế

### Ví dụ 1: Counter đơn giản

```vue
<template>
  <div>
    <h2>Counter: {{ count }}</h2>
    <button @click="increment">Tăng</button>
    <button @click="decrement">Giảm</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}

function reset() {
  count.value = 0
}
</script>
```

**Giải thích:**
- `count` là reactive variable
- Khi `count.value` thay đổi → Vue tự động update `{{ count }}` trong template

### Ví dụ 2: Hiển thị thông tin user

```vue
<template>
  <div>
    <h2>Thông tin User</h2>
    <p>Tên: {{ user.name }}</p>
    <p>Tuổi: {{ user.age }}</p>
    <p>Email: {{ user.email }}</p>
    
    <button @click="updateAge">Tăng tuổi</button>
    <button @click="changeEmail">Đổi email</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({
  name: 'Nguyễn Văn A',
  age: 20,
  email: 'a@example.com'
})

function updateAge() {
  user.value.age++  // ✅ Truy cập property qua .value
}

function changeEmail() {
  user.value.email = 'newemail@example.com'
}
</script>
```

**Lưu ý:**
- `ref()` có thể chứa object
- Truy cập: `user.value.age` (không phải `user.age`)

### Ví dụ 3: Form input

```vue
<template>
  <div>
    <input 
      type="text" 
      :value="message" 
      @input="handleInput"
      placeholder="Nhập text"
    />
    <p>Bạn đã nhập: {{ message }}</p>
    <p>Số ký tự: {{ message.length }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

function handleInput(event) {
  message.value = event.target.value  // ✅ Update reactive variable
}
</script>
```

**Giải thích:**
- Khi user nhập → `handleInput` chạy
- `message.value` thay đổi → Vue tự động update template

---

## 🎯 5. So sánh: JavaScript vs Vue

### Ví dụ: Hiển thị danh sách

**JavaScript thuần:**
```html
<div id="app"></div>

<script>
  let items = ['A', 'B', 'C']
  
  function render() {
    const html = items.map(item => `<li>${item}</li>`).join('')
    document.getElementById('app').innerHTML = `<ul>${html}</ul>`
  }
  
  function addItem() {
    items.push('D')  // ✅ Data thay đổi
    render()        // ❌ Phải tự render lại
  }
  
  render()
</script>
```

**Vue:**
```vue
<template>
  <div>
    <!-- Hiển thị từng item (sẽ học v-for ở Bài 6) -->
    <p>{{ items[0] }}</p>
    <p>{{ items[1] }}</p>
    <p>{{ items[2] }}</p>
    <p>{{ items[3] }}</p>
    <button @click="addItem">Thêm</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])

function addItem() {
  items.value.push('D')  // ✅ Chỉ cần thay đổi data
  // ✅ Vue tự động update DOM!
  // Lưu ý: Để hiển thị danh sách động, sẽ học v-for ở Bài 6
}
</script>
```

**Khác biệt:**
- JavaScript: Phải tự render lại
- Vue: Tự động render khi data thay đổi

---

## 🎯 5. Case Study: Xây dựng Shopping Cart đơn giản

### Mô tả tình huống

Xây dựng tính năng **giỏ hàng** đơn giản cho website bán hàng, tương tự như **Shopee** hoặc **Tiki**.

### Yêu cầu

- Hiển thị thông tin 1 sản phẩm trong giỏ (tên, giá, số lượng)
- Có thể tăng/giảm số lượng
- Tự động tính: Tổng tiền, Giảm giá, Thành tiền
- Hiển thị số lượng sản phẩm trong giỏ

**Lưu ý:** Trong bài này, chúng ta chỉ sử dụng:
- `ref()` để tạo reactive data
- `{{ }}` để hiển thị
- `v-bind` và `v-on` để xử lý events

Các tính năng như `v-for` (render danh sách) và `v-if` (conditional rendering) sẽ được học ở các bài sau.

### Implementation

```vue
<template>
  <div class="shopping-cart">
    <h2>Giỏ hàng ({{ itemCount }} sản phẩm)</h2>
    
    <!-- Thông tin sản phẩm -->
    <div class="cart-item">
      <div class="item-info">
        <h3>{{ productName }}</h3>
        <p class="item-price">{{ formatPrice(unitPrice) }} đ</p>
      </div>
      
      <!-- Điều khiển số lượng -->
      <div class="quantity-controls">
        <button @click="decreaseQuantity">-</button>
        <span>{{ quantity }}</span>
        <button @click="increaseQuantity">+</button>
      </div>
      
      <!-- Thành tiền của sản phẩm -->
      <div class="item-total">
        {{ formatPrice(itemTotal) }} đ
      </div>
    </div>
    
    <!-- Tổng kết -->
    <div class="cart-summary">
      <div class="summary-row">
        <span>Tổng tiền:</span>
        <span>{{ formatPrice(subtotal) }} đ</span>
      </div>
      <div class="summary-row">
        <span>Giảm giá (10%):</span>
        <span class="discount">-{{ formatPrice(discount) }} đ</span>
      </div>
      <div class="summary-row">
        <span>Phí ship:</span>
        <span>{{ formatPrice(shippingFee) }} đ</span>
      </div>
      <div class="summary-row total">
          <span>Thành tiền:</span>
          <span class="final-price">{{ formatPrice(finalTotal) }} đ</span>
        </div>
        
        <button class="checkout-btn" @click="checkout">
          Thanh toán
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cart = ref([
  { 
    id: 1, 
    name: 'iPhone 15', 
    price: 20000000, 
    quantity: 1,
    image: '/iphone15.jpg'
  },
  { 
    id: 2, 
    name: 'Samsung S24', 
    price: 18000000, 
    quantity: 2,
    image: '/samsung24.jpg'
  }
])

const shippingFee = 30000

// Computed properties - Tự động tính toán
const totalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
})

const discount = computed(() => {
  return subtotal.value * 0.1
})

const finalTotal = computed(() => {
  return subtotal.value - discount.value + shippingFee
})

// Methods
function formatPrice(price) {
  return price.toLocaleString('vi-VN')
}

function increaseQuantity(productId) {
  const item = cart.value.find(i => i.id === productId)
  if (item) {
    item.quantity++  // ✅ Chỉ cần thay đổi data
    // ✅ Vue tự động update UI!
  }
}

function decreaseQuantity(productId) {
  const item = cart.value.find(i => i.id === productId)
  if (item && item.quantity > 1) {
    item.quantity--  // ✅ Chỉ cần thay đổi data
    // ✅ Vue tự động update UI!
  }
}

function removeItem(productId) {
  cart.value = cart.value.filter(i => i.id !== productId)
  // ✅ Vue tự động update UI!
}

function checkout() {
  console.log('Thanh toán:', {
    items: cart.value,
    total: finalTotal.value
  })
  // Gọi API thanh toán...
}
</script>

<style scoped>
.shopping-cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.cart-summary {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-row.total {
  border-top: 2px solid #ddd;
  padding-top: 12px;
  margin-top: 12px;
}

.final-price {
  font-size: 1.5em;
  color: #e74c3c;
  font-weight: bold;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 16px;
}
</style>
```

**Giải thích:**
- **ref()**: Tạo reactive data cho cart
- **computed()**: Tự động tính tổng tiền, giảm giá, thành tiền
- **Chỉ cần thay đổi data**: Vue tự động update UI
- **Không cần select DOM**: Vue tự động quản lý

**Kết quả:**
- User tăng số lượng → Tổng tiền tự động update
- User xóa sản phẩm → Danh sách tự động update
- Tất cả tính toán tự động, không cần code thủ công

---

## ⚠️ 6. Các lỗi thường gặp

### Lỗi 1: Quên .value trong script

**❌ Vấn đề:**
```vue
<script setup>
const count = ref(0)

function increment() {
  count++  // ❌ Lỗi: count is not a number
}
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const count = ref(0)

function increment() {
  count.value++  // ✅ Đúng
}
</script>
```

**🔍 Giải thích:** `ref()` trả về object, không phải giá trị. Phải dùng `.value`.

---

### Lỗi 2: Dùng .value trong template

**❌ Vấn đề:**
```vue
<template>
  <p>{{ count.value }}</p>  <!-- ❌ Hiển thị: [object Object] -->
</template>
```

**✅ Giải pháp:**
```vue
<template>
  <p>{{ count }}</p>  <!-- ✅ Đúng -->
</template>
```

**🔍 Giải thích:** Vue tự động unwrap trong template.

---

### Lỗi 3: Quên import ref

**❌ Vấn đề:**
```vue
<script setup>
const count = ref(0)  // ❌ Lỗi: ref is not defined
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
import { ref } from 'vue'  // ✅ Phải import

const count = ref(0)
</script>
```

---

### Lỗi 4: Gán lại ref

**❌ Vấn đề:**
```vue
<script setup>
let count = ref(0)

function reset() {
  count = ref(0)  // ❌ SAI - Tạo ref mới, mất reactivity
}
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const count = ref(0)  // ✅ Dùng const

function reset() {
  count.value = 0  // ✅ Gán giá trị, không gán ref mới
}
</script>
```

**🔍 Giải thích:** Dùng `const` cho ref, chỉ thay đổi `.value`.

---

## 💡 7. Best Practices

### 1. Luôn dùng const cho ref

```vue
<script setup>
// ✅ Tốt
const count = ref(0)

// ❌ Tránh
let count = ref(0)
</script>
```

**Lý do:** Ref object không thay đổi, chỉ `.value` thay đổi.

### 2. Đặt tên rõ ràng

```vue
<script setup>
// ✅ Tốt
const userName = ref('')
const productCount = ref(0)
const isAuthenticated = ref(false)

// ❌ Tránh
const u = ref('')
const c = ref(0)
const flag = ref(false)
</script>
```

### 3. Khởi tạo giá trị mặc định

```vue
<script setup>
// ✅ Tốt - Có giá trị mặc định
const name = ref('')
const count = ref(0)
const items = ref([])

// ❌ Tránh - undefined có thể gây lỗi
const name = ref()
</script>
```

---

## 🧪 8. Thực hành

### Bài tập 1: Counter với nhiều chức năng
Tạo counter có:
- Nút tăng (+1)
- Nút giảm (-1)
- Nút reset về 0
- Nút nhân đôi (x2)
- Hiển thị số chẵn/lẻ

### Bài tập 2: Hiển thị thông tin động
Tạo component hiển thị:
- Tên: "Nguyễn Văn A"
- Tuổi: 20 (có nút tăng tuổi)
- Điểm: 8.5 (có nút tăng điểm)
- Tính điểm trung bình

### Bài tập 3: Input với validation
Tạo input:
- Hiển thị text đã nhập
- Đếm số ký tự
- Hiển thị cảnh báo nếu > 100 ký tự
- Nút "Xóa" để clear input

---

## 🧪 9. Mini Test

### Câu 1: Reactivity là gì?
<details>
<summary>Xem đáp án</summary>
Tự động cập nhật DOM khi data thay đổi, không cần thủ công update DOM.
</details>

### Câu 2: ref() trả về gì?
<details>
<summary>Xem đáp án</summary>
Object wrapper chứa giá trị trong property .value, không phải giá trị trực tiếp.
</details>

### Câu 3: Khi nào cần dùng .value?
<details>
<summary>Xem đáp án</summary>
Trong &lt;script&gt; khi truy cập hoặc thay đổi giá trị của ref.
</details>

### Câu 4: Có cần .value trong template không?
<details>
<summary>Xem đáp án</summary>
Không, Vue tự động unwrap ref trong template.
</details>

### Câu 5: Tại sao nên dùng const cho ref?
<details>
<summary>Xem đáp án</summary>
Vì ref object không thay đổi, chỉ .value thay đổi. Dùng const để tránh gán lại ref mới.
</details>

---

## 📌 10. Quick Notes

### ref() Syntax
```javascript
import { ref } from 'vue'

const count = ref(0)        // Primitive
const name = ref('')        // String
const items = ref([])       // Array
const user = ref({})        // Object
```

### Quy tắc .value
```javascript
// ✅ Trong script
count.value++
user.value.name = 'New'

// ✅ Trong template
{{ count }}
{{ user.name }}
```

### Reactivity Flow
```
Data thay đổi (count.value++)
    ↓
Vue phát hiện thay đổi
    ↓
Tự động update DOM
    ↓
User thấy thay đổi ngay lập tức
```

---

**👉 Bài tiếp theo: [05_event_methods.md](./05_event_methods.md) - Event Handling và Methods**

