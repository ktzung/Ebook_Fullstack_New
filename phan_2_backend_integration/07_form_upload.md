# 🟩 TUẦN 7: XỬ LÝ FORM & UPLOAD FILE

## 🎯 Mục tiêu
- Xây dựng Form thêm mới sản phẩm trên Vue.
- Xử lý upload ảnh (Multipart/form-data).
- Lưu ảnh vào thư mục server và trả về đường dẫn.

---

## 📤 1. Backend: Upload File

### 🎬 Ví dụ dẫn nhập: Upload ảnh sản phẩm

Hãy tưởng tượng bạn đang xây dựng tính năng **thêm sản phẩm** cho website bán hàng:

**Tình huống thực tế:**
- Admin muốn thêm sản phẩm mới
- Mỗi sản phẩm cần có ảnh đại diện
- Ảnh có thể là: JPG, PNG, WebP
- Kích thước tối đa: 5MB
- Cần lưu ảnh vào server và trả về URL để hiển thị

**Vấn đề:**
- Form thông thường chỉ gửi được text
- File (ảnh) cần gửi dạng **multipart/form-data**
- Backend cần xử lý file upload khác với JSON

**Giải pháp:**
- Frontend: Dùng `FormData` để gửi file
- Backend: Dùng `IFormFile` để nhận file

### 🌐 Liên hệ thực tế

**File upload được dùng ở mọi nơi:**
- **Facebook**: Upload ảnh đại diện, ảnh bài viết
- **Instagram**: Upload ảnh/video story, post
- **Shopee**: Upload ảnh sản phẩm (nhiều ảnh)
- **Gmail**: Upload file đính kèm
- **Banking App**: Upload ảnh CMND, ảnh chữ ký

**Tất cả đều dùng multipart/form-data để upload file!**

API nhận file phải dùng `IFormFile`.

### 1.1. DTO
```csharp
public class CreateProductWithImageDto
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public IFormFile? ImageFile { get; set; } // File ảnh gửi lên
}
```

### 1.2. Controller
```csharp
[HttpPost]
public async Task<IActionResult> Create([FromForm] CreateProductWithImageDto request)
{
    string imagePath = null;
    
    if (request.ImageFile != null)
    {
        // 1. Tạo tên file unique
        var fileName = Guid.NewGuid() + Path.GetExtension(request.ImageFile.FileName);
        // 2. Đường dẫn lưu (wwwroot/images)
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
        
        // 3. Lưu file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await request.ImageFile.CopyToAsync(stream);
        }
        
        // 4. Lưu đường dẫn vào DB (VD: /images/abc.jpg)
        imagePath = "/images/" + fileName;
    }

    var product = new Product 
    { 
        Name = request.Name, 
        Price = request.Price, 
        ImageUrl = imagePath 
    };
    
    _context.Products.Add(product);
    await _context.SaveChangesAsync();
    
    return Ok(product);
}
```

### 1.3. Cấu hình Static Files
Để client xem được ảnh, phải bật Static Files trong `Program.cs`:
```csharp
app.UseStaticFiles(); // Cho phép truy cập thư mục wwwroot
```

---

## 📝 2. Frontend: Form Data

Khi gửi file, không thể gửi JSON thường (`application/json`). Phải dùng `FormData`.

```javascript
// productService.js
create(data) {
    // data là object { name: 'A', price: 100, image: File }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    if (data.image) {
        formData.append('imageFile', data.image);
    }

    return axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}
```

### 2.1. Vue Component (`v-file-input`)

```html
<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  price: 0,
  image: null
});

async function submit() {
  await productService.create(form.value);
  alert("Thêm thành công!");
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <v-text-field v-model="form.name" label="Tên SP"></v-text-field>
    <v-text-field v-model="form.price" type="number" label="Giá"></v-text-field>
    <v-file-input v-model="form.image" label="Ảnh đại diện"></v-file-input>
    
    <v-btn type="submit" color="primary">Lưu</v-btn>
  </v-form>
</template>
```

---

## 🧪 3. Thực hành

1. Tạo thư mục `wwwroot/images` trong Backend.
2. Viết API Upload.
3. Tạo Dialog "Thêm mới" trong trang ProductPage của Vue.
4. Test upload ảnh -> Kiểm tra ảnh có xuất hiện trong thư mục server không.

---

## 🎯 3. Case Study: Upload ảnh sản phẩm với Preview

### Mô tả tình huống

Xây dựng tính năng **thêm sản phẩm** với upload ảnh, tương tự như **Shopee Seller Center**.

### Yêu cầu

- Upload ảnh sản phẩm (JPG, PNG, tối đa 5MB)
- Preview ảnh trước khi upload
- Hiển thị progress khi upload
- Validate file type và size
- Lưu ảnh vào server
- Trả về URL để hiển thị

### Implementation

**Backend (`Controllers/ProductsController.cs`):**
```csharp
[HttpPost]
public async Task<ActionResult<ProductDto>> CreateWithImage(
    [FromForm] CreateProductWithImageDto dto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    
    string imageUrl = null;
    
    // Validate và upload ảnh
    if (dto.ImageFile != null)
    {
        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(dto.ImageFile.FileName).ToLower();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Chỉ chấp nhận file ảnh (JPG, PNG, WebP)" });
        }
        
        // Validate file size (5MB)
        if (dto.ImageFile.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File không được vượt quá 5MB" });
        }
        
        // Tạo tên file unique
        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadPath = Path.Combine("wwwroot", "images", "products");
        
        // Tạo thư mục nếu chưa có
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }
        
        var filePath = Path.Combine(uploadPath, fileName);
        
        // Lưu file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await dto.ImageFile.CopyToAsync(stream);
        }
        
        imageUrl = $"/images/products/{fileName}";
    }
    
    // Tạo sản phẩm
    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Description = dto.Description,
        ImageUrl = imageUrl,
        Stock = dto.Stock,
        CategoryId = dto.CategoryId
    };
    
    _context.Products.Add(product);
    await _context.SaveChangesAsync();
    
    var productDto = _mapper.Map<ProductDto>(product);
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, productDto);
}
```

**Frontend Component (`components/ProductForm.vue`):**
```vue
<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="form.name"
      label="Tên sản phẩm *"
      :error-messages="errors.name"
      required
    />
    
    <v-textarea
      v-model="form.description"
      label="Mô tả"
      rows="3"
    />
    
    <v-text-field
      v-model.number="form.price"
      label="Giá *"
      type="number"
      prefix="₫"
      :error-messages="errors.price"
      required
    />
    
    <v-text-field
      v-model.number="form.stock"
      label="Số lượng *"
      type="number"
      :error-messages="errors.stock"
      required
    />
    
    <!-- File Upload -->
    <div class="mb-4">
      <label class="text-subtitle-1 mb-2 d-block">Ảnh sản phẩm</label>
      
      <!-- Preview ảnh -->
      <div v-if="imagePreview" class="image-preview mb-2">
        <img :src="imagePreview" alt="Preview" class="preview-image" />
        <v-btn
          icon="mdi-close"
          size="small"
          @click="clearImage"
          class="remove-btn"
        />
      </div>
      
      <!-- File Input -->
      <v-file-input
        v-model="form.imageFile"
        label="Chọn ảnh"
        accept="image/*"
        prepend-icon="mdi-camera"
        :error-messages="errors.image"
        @change="handleFileChange"
      />
      
      <p class="text-caption text-grey">
        Chấp nhận: JPG, PNG, WebP. Tối đa 5MB
      </p>
      
      <!-- Progress Bar -->
      <v-progress-linear
        v-if="uploading"
        :model-value="uploadProgress"
        color="primary"
        class="mt-2"
      />
    </div>
    
    <v-btn
      type="submit"
      color="primary"
      :loading="submitting"
      :disabled="!isFormValid"
    >
      {{ productId ? 'Cập nhật' : 'Tạo mới' }}
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import productService from '@/services/productService'

const props = defineProps({
  productId: Number
})

const emit = defineEmits(['saved', 'cancel'])

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageFile: null
})

const errors = ref({})
const imagePreview = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const submitting = ref(false)

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.price > 0 &&
         form.value.stock >= 0
})

function handleFileChange(file) {
  if (!file) {
    imagePreview.value = null
    return
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.value.image = 'Chỉ chấp nhận file ảnh (JPG, PNG, WebP)'
    form.value.imageFile = null
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.value.image = 'File không được vượt quá 5MB'
    form.value.imageFile = null
    return
  }
  
  errors.value.image = null
  
  // Preview ảnh
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  form.value.imageFile = null
  imagePreview.value = null
}

async function handleSubmit() {
  errors.value = {}
  
  // Validation
  if (!form.value.name) {
    errors.value.name = 'Tên sản phẩm là bắt buộc'
  }
  if (form.value.price <= 0) {
    errors.value.price = 'Giá phải lớn hơn 0'
  }
  if (form.value.stock < 0) {
    errors.value.stock = 'Số lượng không được âm'
  }
  
  if (Object.keys(errors.value).length > 0) {
    return
  }
  
  submitting.value = true
  
  try {
    // Tạo FormData
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description || '')
    formData.append('price', form.value.price.toString())
    formData.append('stock', form.value.stock.toString())
    
    if (form.value.imageFile) {
      formData.append('imageFile', form.value.imageFile)
    }
    
    // Upload với progress
    uploading.value = true
    uploadProgress.value = 0
    
    if (props.productId) {
      await productService.updateWithImage(props.productId, formData, (progress) => {
        uploadProgress.value = progress
      })
    } else {
      await productService.createWithImage(formData, (progress) => {
        uploadProgress.value = progress
      })
    }
    
    uploading.value = false
    emit('saved')
  } catch (error) {
    console.error('Error saving product:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      alert('Lỗi khi lưu sản phẩm: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    submitting.value = false
    uploading.value = false
  }
}

// Load product nếu đang edit
if (props.productId) {
  productService.getById(props.productId).then(product => {
    form.value = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageFile: null
    }
    if (product.imageUrl) {
      imagePreview.value = product.imageUrl
    }
  })
}
</script>

<style scoped>
.image-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
```

**Service với Progress (`services/productService.js`):**
```javascript
createWithImage(formData, onProgress) {
  return axios.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      if (onProgress) {
        onProgress(percentCompleted)
      }
    }
  })
}
```

**Giải thích:**
- **FormData**: Gửi file dạng multipart/form-data
- **FileReader**: Preview ảnh trước khi upload
- **Validation**: Kiểm tra type và size trước khi upload
- **Progress**: Hiển thị tiến trình upload
- **Error Handling**: Xử lý lỗi đầy đủ

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Quên [FromForm]
**❌ Vấn đề:** `[FromBody]` không nhận được file  
**✅ Giải pháp:** Dùng `[FromForm]` cho multipart/form-data.

### Lỗi 2: File quá lớn
**❌ Vấn đề:** Request bị reject  
**✅ Giải pháp:** Tăng `MaxRequestBodySize` trong `Program.cs`.

### Lỗi 3: Không thấy ảnh sau upload
**❌ Vấn đề:** Ảnh không hiển thị  
**✅ Giải pháp:** Kiểm tra `UseStaticFiles()` và đường dẫn đúng.

---

## 💡 5. Best Practices

- Validate file type và size
- Tạo tên file unique (Guid)
- Lưu vào thư mục riêng
- Xóa file cũ khi update/delete
- Compress ảnh nếu cần

---

## 📝 6. Bài tập thực hành

1. Thêm validation file type (chỉ jpg, png)
2. Thêm preview ảnh trước khi upload
3. Thêm progress bar khi upload
4. Xử lý multiple files
5. Upload lên cloud storage (Azure Blob)

---

## 🧪 7. Mini Test

### Câu 1: FormData dùng khi nào?
<details>
<summary>Xem đáp án</summary>
Khi gửi file hoặc multipart/form-data.
</details>

### Câu 2: Làm sao validate file size?
<details>
<summary>Xem đáp án</summary>
Kiểm tra `IFormFile.Length` trước khi lưu.
</details>

---

## 📌 8. Quick Notes

### Backend Upload
```csharp
[HttpPost]
public async Task<IActionResult> Upload([FromForm] IFormFile file)
{
    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
    var path = Path.Combine("wwwroot/images", fileName);
    using var stream = new FileStream(path, FileMode.Create);
    await file.CopyToAsync(stream);
    return Ok(new { url = $"/images/{fileName}" });
}
```

### Frontend Upload
```javascript
const formData = new FormData()
formData.append('file', file)
await axios.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```