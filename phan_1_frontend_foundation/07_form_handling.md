# 🟦 BÀI 7: FORM HANDLING VỚI v-model

## 🎯 Mục tiêu
- Hiểu v-model là gì và cách hoạt động
- Sử dụng v-model với input, textarea, select
- Xử lý checkbox và radio
- Validation form cơ bản
- Submit form và xử lý dữ liệu

---

## 🧠 1. v-model là gì?

### 🎬 Ví dụ dẫn nhập: Form đăng ký tài khoản

Hãy tưởng tượng bạn đang xây dựng form **đăng ký tài khoản** như Facebook, Gmail:

**Tình huống thực tế:**
- User nhập tên → Hiển thị "Xin chào [Tên]" ngay bên dưới
- User nhập email → Kiểm tra format email và hiển thị lỗi nếu sai
- User nhập mật khẩu → Hiển thị độ mạnh mật khẩu (yếu/trung bình/mạnh)
- User thay đổi → Validation tự động chạy lại

**Với JavaScript thuần:**
```html
<form id="registerForm">
  <input type="text" id="name" placeholder="Tên">
  <p id="greeting"></p>
  
  <input type="email" id="email" placeholder="Email">
  <p id="emailError"></p>
  
  <input type="password" id="password" placeholder="Mật khẩu">
  <p id="passwordStrength"></p>
  
  <button type="submit">Đăng ký</button>
</form>

<script>
  const nameInput = document.getElementById('name')
  const emailInput = document.getElementById('email')
  const passwordInput = document.getElementById('password')
  
  // ❌ Phải tự lắng nghe mỗi input
  nameInput.addEventListener('input', function() {
    const name = this.value
    document.getElementById('greeting').textContent = 
      name ? `Xin chào ${name}!` : ''
  })
  
  emailInput.addEventListener('input', function() {
    const email = this.value
    const isValid = email.includes('@') && email.includes('.')
    document.getElementById('emailError').textContent = 
      isValid ? '' : 'Email không hợp lệ'
  })
  
  passwordInput.addEventListener('input', function() {
    const password = this.value
    let strength = 'Yếu'
    if (password.length >= 8) strength = 'Trung bình'
    if (password.length >= 12 && /[A-Z]/.test(password)) strength = 'Mạnh'
    document.getElementById('passwordStrength').textContent = 
      `Độ mạnh: ${strength}`
  })
  
  // ❌ Code dài dòng, lặp lại nhiều
</script>
```

**Vấn đề:**
- Phải select từng element
- Phải lắng nghe event cho mỗi input
- Code dài dòng, khó maintain
- Không tự động sync 2 chiều

**Với Vue v-model:**
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" type="text" placeholder="Tên">
    <p v-if="form.name">Xin chào {{ form.name }}!</p>
    
    <input v-model="form.email" type="email" placeholder="Email">
    <p v-if="!isEmailValid" class="error">Email không hợp lệ</p>
    
    <input v-model="form.password" type="password" placeholder="Mật khẩu">
    <p>Độ mạnh: {{ passwordStrength }}</p>
    
    <button type="submit">Đăng ký</button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const form = ref({
  name: '',
  email: '',
  password: ''
})

const isEmailValid = computed(() => {
  return form.value.email.includes('@') && form.value.email.includes('.')
})

const passwordStrength = computed(() => {
  const pwd = form.value.password
  if (pwd.length < 6) return 'Yếu'
  if (pwd.length < 12) return 'Trung bình'
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 'Mạnh'
  return 'Trung bình'
})

function handleSubmit() {
  console.log('Submit:', form.value)
}
</script>
```

**Ưu điểm:**
- Code ngắn gọn, dễ đọc
- Tự động sync 2 chiều (input ↔ data)
- Validation tự động update
- Dễ maintain

### Vấn đề với JavaScript thuần

**Ví dụ JavaScript thuần:**
```html
<input type="text" id="name">
<button onclick="getValue()">Lấy giá trị</button>

<script>
  function getValue() {
    const value = document.getElementById('name').value
    console.log(value)
  }
</script>
```

**Vấn đề:**
- Phải select element
- Phải lấy value thủ công
- Không tự động sync 2 chiều

### 🌐 Liên hệ thực tế

**v-model được dùng ở mọi form:**
- **Facebook**: Form đăng nhập, form đăng ký, form đăng status
- **Gmail**: Form soạn email, form tìm kiếm
- **Shopee**: Form tìm kiếm sản phẩm, form đánh giá, form checkout
- **Banking App**: Form chuyển tiền, form thanh toán
- **Booking.com**: Form tìm khách sạn, form đặt phòng

**Tất cả đều dùng v-model để xử lý input!**

### Giải pháp: v-model

**v-model** = **Two-way data binding** (Ràng buộc dữ liệu 2 chiều)

```vue
<template>
  <div>
    <input v-model="name" type="text" placeholder="Nhập tên">
    <p>Bạn đã nhập: {{ name }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
</script>
```

**Cách hoạt động:**
- User nhập → `name` tự động update
- Code thay đổi `name` → Input tự động update
- **Sync 2 chiều tự động!**

---

## 📝 2. v-model với các loại input

### Text Input

```vue
<template>
  <div>
    <input v-model="username" type="text" placeholder="Username">
    <p>Username: {{ username }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
</script>
```

### Textarea

```vue
<template>
  <div>
    <textarea v-model="message" placeholder="Nhập tin nhắn"></textarea>
    <p>Số ký tự: {{ message.length }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')
</script>
```

### Number Input

```vue
<template>
  <div>
    <input v-model.number="age" type="number" placeholder="Tuổi">
    <p>Tuổi: {{ age }} (Type: {{ typeof age }})</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const age = ref(0)
</script>
```

**Lưu ý:** Dùng `.number` modifier để tự động convert sang number.

### Checkbox (Single)

```vue
<template>
  <div>
    <input v-model="agree" type="checkbox" id="agree">
    <label for="agree">Tôi đồng ý với điều khoản</label>
    <p>Đồng ý: {{ agree }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const agree = ref(false)
</script>
```

### Checkbox (Multiple)

```vue
<template>
  <div>
    <input v-model="hobbies" type="checkbox" value="reading" id="reading">
    <label for="reading">Đọc sách</label>
    
    <input v-model="hobbies" type="checkbox" value="music" id="music">
    <label for="music">Nghe nhạc</label>
    
    <input v-model="hobbies" type="checkbox" value="sports" id="sports">
    <label for="sports">Thể thao</label>
    
    <p>Sở thích: {{ hobbies }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hobbies = ref([])  // ✅ Phải là array
</script>
```

### Radio

```vue
<template>
  <div>
    <input v-model="gender" type="radio" value="male" id="male">
    <label for="male">Nam</label>
    
    <input v-model="gender" type="radio" value="female" id="female">
    <label for="female">Nữ</label>
    
    <p>Giới tính: {{ gender }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const gender = ref('')
</script>
```

### Select

```vue
<template>
  <div>
    <select v-model="selectedCity">
      <option value="">Chọn thành phố</option>
      <option value="hanoi">Hà Nội</option>
      <option value="danang">Đà Nẵng</option>
      <option value="hcm">Hồ Chí Minh</option>
    </select>
    <p>Thành phố: {{ selectedCity }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedCity = ref('')
</script>
```

### Select Multiple

```vue
<template>
  <div>
    <select v-model="selectedCities" multiple>
      <option value="hanoi">Hà Nội</option>
      <option value="danang">Đà Nẵng</option>
      <option value="hcm">Hồ Chí Minh</option>
    </select>
    <p>Thành phố đã chọn: {{ selectedCities }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedCities = ref([])  // ✅ Phải là array
</script>
```

---

## 🎯 3. v-model Modifiers

### .lazy

Chỉ update khi blur (rời khỏi input):

```vue
<input v-model.lazy="message">
```

**So sánh:**
- Không có `.lazy`: Update mỗi khi gõ
- Có `.lazy`: Chỉ update khi blur

### .number

Tự động convert sang number:

```vue
<input v-model.number="age" type="text">
```

**Ví dụ:**
- Nhập "25" → `age = 25` (number)
- Không có `.number` → `age = "25"` (string)

### .trim

Tự động xóa khoảng trắng đầu/cuối:

```vue
<input v-model.trim="username">
```

**Ví dụ:**
- Nhập "  admin  " → `username = "admin"`

---

## 💻 4. Ví dụ thực tế: Form đăng ký

```vue
<template>
  <div class="register-form">
    <h2>Đăng ký</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- Tên -->
      <div>
        <label>Tên:</label>
        <input 
          v-model.trim="form.name" 
          type="text" 
          placeholder="Nhập tên"
          required
        />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>
      
      <!-- Email -->
      <div>
        <label>Email:</label>
        <input 
          v-model.trim="form.email" 
          type="email" 
          placeholder="email@example.com"
          required
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      
      <!-- Mật khẩu -->
      <div>
        <label>Mật khẩu:</label>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="Tối thiểu 6 ký tự"
          required
        />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>
      
      <!-- Xác nhận mật khẩu -->
      <div>
        <label>Xác nhận mật khẩu:</label>
        <input 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="Nhập lại mật khẩu"
          required
        />
        <span v-if="errors.confirmPassword" class="error">
          {{ errors.confirmPassword }}
        </span>
      </div>
      
      <!-- Giới tính -->
      <div>
        <label>Giới tính:</label>
        <input v-model="form.gender" type="radio" value="male" id="male">
        <label for="male">Nam</label>
        <input v-model="form.gender" type="radio" value="female" id="female">
        <label for="female">Nữ</label>
      </div>
      
      <!-- Sở thích -->
      <div>
        <label>Sở thích:</label>
        <input v-model="form.hobbies" type="checkbox" value="reading" id="reading">
        <label for="reading">Đọc sách</label>
        <input v-model="form.hobbies" type="checkbox" value="music" id="music">
        <label for="music">Nghe nhạc</label>
        <input v-model="form.hobbies" type="checkbox" value="sports" id="sports">
        <label for="sports">Thể thao</label>
      </div>
      
      <!-- Thành phố -->
      <div>
        <label>Thành phố:</label>
        <select v-model="form.city">
          <option value="">Chọn thành phố</option>
          <option value="hanoi">Hà Nội</option>
          <option value="danang">Đà Nẵng</option>
          <option value="hcm">Hồ Chí Minh</option>
        </select>
      </div>
      
      <!-- Đồng ý -->
      <div>
        <input v-model="form.agree" type="checkbox" id="agree">
        <label for="agree">Tôi đồng ý với điều khoản</label>
        <span v-if="errors.agree" class="error">{{ errors.agree }}</span>
      </div>
      
      <!-- Submit -->
      <button type="submit" :disabled="!isFormValid">Đăng ký</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  hobbies: [],
  city: '',
  agree: false
})

const errors = ref({})

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.email &&
         form.value.password &&
         form.value.password === form.value.confirmPassword &&
         form.value.agree
})

function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Tên không được để trống'
  }
  
  if (!form.value.email.includes('@')) {
    errors.value.email = 'Email không hợp lệ'
  }
  
  if (form.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu không khớp'
  }
  
  if (!form.value.agree) {
    errors.value.agree = 'Bạn phải đồng ý với điều khoản'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) {
    console.log('Đăng ký thành công!', form.value)
    // Gọi API đăng ký...
    alert('Đăng ký thành công!')
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
}
</style>
```

---

## 🎯 4. Case Study: Form đăng ký hoàn chỉnh với Validation

### Mô tả tình huống

Xây dựng form **đăng ký tài khoản** cho website, tương tự như **Facebook** hoặc **Gmail**, với validation đầy đủ.

### Yêu cầu

- Form có: Tên, Email, Mật khẩu, Xác nhận mật khẩu, Số điện thoại
- Validation real-time khi user nhập
- Hiển thị lỗi ngay khi phát hiện
- Disable nút submit khi form không hợp lệ
- Hiển thị độ mạnh mật khẩu
- Checkbox đồng ý điều khoản

### Implementation

```vue
<template>
  <div class="register-form">
    <h2>Đăng ký tài khoản</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- Tên -->
      <div class="form-group">
        <label>Tên đầy đủ *</label>
        <input 
          v-model.trim="form.name" 
          type="text" 
          placeholder="Nhập họ và tên"
          :class="{ error: errors.name }"
          @blur="validateName"
        />
        <span v-if="errors.name" class="error-message">
          {{ errors.name }}
        </span>
        <span v-else-if="form.name" class="success-message">
          ✓ Tên hợp lệ
        </span>
      </div>
      
      <!-- Email -->
      <div class="form-group">
        <label>Email *</label>
        <input 
          v-model.trim="form.email" 
          type="email" 
          placeholder="email@example.com"
          :class="{ error: errors.email }"
          @blur="validateEmail"
        />
        <span v-if="errors.email" class="error-message">
          {{ errors.email }}
        </span>
        <span v-else-if="isEmailValid && form.email" class="success-message">
          ✓ Email hợp lệ
        </span>
      </div>
      
      <!-- Số điện thoại -->
      <div class="form-group">
        <label>Số điện thoại</label>
        <input 
          v-model.trim="form.phone" 
          type="tel" 
          placeholder="0123456789"
          :class="{ error: errors.phone }"
          @blur="validatePhone"
        />
        <span v-if="errors.phone" class="error-message">
          {{ errors.phone }}
        </span>
      </div>
      
      <!-- Mật khẩu -->
      <div class="form-group">
        <label>Mật khẩu *</label>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="Tối thiểu 6 ký tự"
          :class="{ error: errors.password }"
          @input="validatePassword"
        />
        <div v-if="form.password" class="password-strength">
          <div class="strength-bar" :class="passwordStrengthClass"></div>
          <p>Độ mạnh: {{ passwordStrengthText }}</p>
        </div>
        <span v-if="errors.password" class="error-message">
          {{ errors.password }}
        </span>
      </div>
      
      <!-- Xác nhận mật khẩu -->
      <div class="form-group">
        <label>Xác nhận mật khẩu *</label>
        <input 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="Nhập lại mật khẩu"
          :class="{ error: errors.confirmPassword }"
          @blur="validateConfirmPassword"
        />
        <span v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword }}
        </span>
        <span v-else-if="isPasswordMatch && form.confirmPassword" class="success-message">
          ✓ Mật khẩu khớp
        </span>
      </div>
      
      <!-- Đồng ý điều khoản -->
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            v-model="form.agree" 
            type="checkbox"
          />
          <span>Tôi đồng ý với <a href="#">Điều khoản sử dụng</a></span>
        </label>
        <span v-if="errors.agree" class="error-message">
          {{ errors.agree }}
        </span>
      </div>
      
      <!-- Submit Button -->
      <button 
        type="submit" 
        class="submit-btn"
        :disabled="!isFormValid || isSubmitting"
      >
        <span v-if="isSubmitting">Đang xử lý...</span>
        <span v-else>Đăng ký</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const errors = ref({})
const isSubmitting = ref(false)

// Computed - Validation
const isEmailValid = computed(() => {
  const email = form.value.email
  return email.includes('@') && 
         email.includes('.') && 
         email.length > 5
})

const isPasswordMatch = computed(() => {
  return form.value.password === form.value.confirmPassword &&
         form.value.password.length > 0
})

const passwordStrength = computed(() => {
  const pwd = form.value.password
  if (pwd.length < 6) return { level: 0, text: 'Yếu' }
  if (pwd.length < 10) return { level: 1, text: 'Trung bình' }
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
    return { level: 2, text: 'Mạnh' }
  }
  return { level: 1, text: 'Trung bình' }
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value.level
  return {
    'strength-weak': strength === 0,
    'strength-medium': strength === 1,
    'strength-strong': strength === 2
  }
})

const passwordStrengthText = computed(() => {
  return passwordStrength.value.text
})

const isFormValid = computed(() => {
  return form.value.name &&
         isEmailValid.value &&
         form.value.password.length >= 6 &&
         isPasswordMatch.value &&
         form.value.agree &&
         Object.keys(errors.value).length === 0
})

// Validation functions
function validateName() {
  if (!form.value.name.trim()) {
    errors.value.name = 'Tên không được để trống'
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Tên phải có ít nhất 2 ký tự'
  } else {
    delete errors.value.name
  }
}

function validateEmail() {
  if (!form.value.email) {
    errors.value.email = 'Email không được để trống'
  } else if (!isEmailValid.value) {
    errors.value.email = 'Email không hợp lệ (ví dụ: user@example.com)'
  } else {
    delete errors.value.email
  }
}

function validatePhone() {
  const phone = form.value.phone
  if (phone && !/^[0-9]{10,11}$/.test(phone)) {
    errors.value.phone = 'Số điện thoại phải có 10-11 chữ số'
  } else {
    delete errors.value.phone
  }
}

function validatePassword() {
  const pwd = form.value.password
  if (!pwd) {
    errors.value.password = 'Mật khẩu không được để trống'
  } else if (pwd.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  } else {
    delete errors.value.password
  }
}

function validateConfirmPassword() {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (!isPasswordMatch.value) {
    errors.value.confirmPassword = 'Mật khẩu không khớp'
  } else {
    delete errors.value.confirmPassword
  }
}

// Submit
async function handleSubmit() {
  // Validate tất cả
  validateName()
  validateEmail()
  validatePhone()
  validatePassword()
  validateConfirmPassword()
  
  if (!form.value.agree) {
    errors.value.agree = 'Bạn phải đồng ý với điều khoản'
  } else {
    delete errors.value.agree
  }
  
  if (!isFormValid.value) {
    return
  }
  
  isSubmitting.value = true
  try {
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Đăng ký thành công!', form.value)
    alert('Đăng ký thành công!')
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agree: false
    }
    errors.value = {}
  } catch (error) {
    console.error('Lỗi đăng ký:', error)
    alert('Đăng ký thất bại. Vui lòng thử lại.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  display: block;
  margin-top: 4px;
}

.success-message {
  color: #27ae60;
  font-size: 14px;
  display: block;
  margin-top: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 4px;
  transition: width 0.3s;
}

.strength-weak {
  width: 33%;
  background: #e74c3c;
}

.strength-medium {
  width: 66%;
  background: #f39c12;
}

.strength-strong {
  width: 100%;
  background: #27ae60;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
}

.submit-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style>
```

**Giải thích:**
- **v-model**: Two-way binding cho tất cả inputs
- **computed**: Validation tự động, độ mạnh mật khẩu
- **Real-time validation**: Validate khi blur hoặc input
- **Visual feedback**: Hiển thị lỗi/success message
- **Disabled state**: Disable nút khi form không hợp lệ

**Kết quả:**
- User nhập → Validation tự động chạy
- Hiển thị lỗi ngay khi phát hiện
- Form chỉ submit khi tất cả hợp lệ

---

## ⚠️ 5. Các lỗi thường gặp

### Lỗi 1: Quên khởi tạo giá trị

**❌ Vấn đề:**
```vue
<script setup>
const name = ref()  // ❌ undefined
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const name = ref('')  // ✅ Khởi tạo giá trị
</script>
```

---

### Lỗi 2: Checkbox multiple không dùng array

**❌ Vấn đề:**
```vue
<script setup>
const hobbies = ref('')  // ❌ SAI
</script>
```

**✅ Giải pháp:**
```vue
<script setup>
const hobbies = ref([])  // ✅ Phải là array
</script>
```

---

### Lỗi 3: Quên .number cho number input

**❌ Vấn đề:**
```vue
<input v-model="age" type="number">
<!-- age là string "25" không phải number 25 -->
```

**✅ Giải pháp:**
```vue
<input v-model.number="age" type="number">
<!-- age là number 25 -->
```

---

### Lỗi 4: Không prevent default khi submit

**❌ Vấn đề:**
```vue
<form @submit="handleSubmit">
  <!-- Form sẽ reload trang -->
</form>
```

**✅ Giải pháp:**
```vue
<form @submit.prevent="handleSubmit">
  <!-- Không reload trang -->
</form>
```

---

## 💡 6. Best Practices

### 1. Luôn validate input

```vue
<script setup>
function validateEmail(email) {
  return email.includes('@') && email.includes('.')
}

function handleSubmit() {
  if (!validateEmail(form.value.email)) {
    errors.value.email = 'Email không hợp lệ'
    return
  }
  // ...
}
</script>
```

### 2. Dùng computed cho validation

```vue
<script setup>
const isFormValid = computed(() => {
  return form.value.name &&
         form.value.email &&
         form.value.password.length >= 6
})
</script>

<template>
  <button :disabled="!isFormValid">Submit</button>
</template>
```

### 3. Reset form sau submit

```vue
<script setup>
function handleSubmit() {
  // Submit...
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    password: ''
  }
  errors.value = {}
}
</script>
```

---

## 🧪 7. Thực hành

### Bài tập 1: Form đăng nhập
Tạo form đăng nhập:
- Username
- Password
- Checkbox "Remember me"
- Validation cơ bản

### Bài tập 2: Form tìm kiếm
Tạo form tìm kiếm:
- Input search
- Select category
- Checkbox filters
- Hiển thị kết quả

### Bài tập 3: Form đánh giá
Tạo form đánh giá sản phẩm:
- Rating (1-5 sao)
- Textarea comment
- Checkbox "Ẩn danh"
- Validation và submit

---

## 🧪 8. Mini Test

### Câu 1: v-model là gì?
<details>
<summary>Xem đáp án</summary>
Two-way data binding - Ràng buộc dữ liệu 2 chiều giữa input và data.
</details>

### Câu 2: Checkbox multiple cần gì?
<details>
<summary>Xem đáp án</summary>
Array để lưu các giá trị đã chọn, không phải string hay boolean.
</details>

### Câu 3: .number modifier làm gì?
<details>
<summary>Xem đáp án</summary>
Tự động convert giá trị input sang number thay vì string.
</details>

### Câu 4: Tại sao cần .prevent khi submit?
<details>
<summary>Xem đáp án</summary>
Để ngăn form reload trang (default behavior của form submit).
</details>

---

## 📌 9. Quick Notes

### v-model Syntax
```vue
<input v-model="variable">
<textarea v-model="variable"></textarea>
<select v-model="variable">
<input type="checkbox" v-model="boolean">
<input type="checkbox" v-model="array" value="x">
<input type="radio" v-model="string" value="x">
```

### Modifiers
- `.lazy` - Update khi blur
- `.number` - Convert sang number
- `.trim` - Xóa khoảng trắng

### Form Submit
```vue
<form @submit.prevent="handleSubmit">
  <!-- .prevent ngăn reload -->
</form>
```

---

**👉 Bài tiếp theo: [08_computed_watch.md](./08_computed_watch.md) - Computed và Watch**

