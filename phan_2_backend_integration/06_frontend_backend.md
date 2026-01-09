# 🟩 TUẦN 6: KẾT NỐI FRONTEND - BACKEND

## 🎯 Mục tiêu
- Xử lý lỗi CORS.
- Gọi API từ Vue để hiển thị danh sách sản phẩm.
- Hiển thị Loading State và Error State.

---

## 🚧 1. CORS Policy

### 🎬 Ví dụ dẫn nhập: Vấn đề CORS trong thực tế

Hãy tưởng tượng bạn đang xây dựng website bán hàng:

**Tình huống thực tế:**
- Frontend Vue chạy trên `http://localhost:5173`
- Backend API chạy trên `http://localhost:5000`
- Frontend cần gọi API để lấy danh sách sản phẩm

**Vấn đề:**
```
Frontend (localhost:5173) → Gọi API → Backend (localhost:5000)
❌ Browser chặn: "CORS policy: No 'Access-Control-Allow-Origin' header"
```

**Tại sao bị chặn?**
- Browser có chính sách **Same-Origin Policy**
- Chỉ cho phép gọi API từ cùng domain
- `localhost:5173` ≠ `localhost:5000` → Khác origin → Bị chặn

**Ví dụ thực tế:**
- **Shopee**: Frontend (shopee.vn) gọi API (api.shopee.vn) → Cần CORS
- **Facebook**: Frontend (facebook.com) gọi API (graph.facebook.com) → Cần CORS
- **Banking App**: Frontend (app.bank.com) gọi API (api.bank.com) → Cần CORS

Khi Vue (localhost:5173) gọi API (localhost:5000), trình duyệt sẽ chặn vì khác cổng (Cross-Origin).

### Giải pháp: Cấu hình CORS ở Backend

### 🌐 Liên hệ thực tế

**CORS được dùng ở mọi nơi:**
- **Microservices**: Frontend gọi nhiều API services khác nhau
- **CDN**: Frontend từ CDN gọi API từ server chính
- **Mobile App**: App gọi API từ server
- **Third-party Integration**: Website tích hợp API của bên thứ 3
Trong `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Add Service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Cho phép Vue
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// 2. Use Middleware (Đặt trước MapControllers)
app.UseCors("AllowVueApp");

app.MapControllers();
app.Run();
```

---

## 📡 2. Fetching Data trong Vue

Sử dụng `productService` đã viết ở Tuần 4.

**`views/admin/ProductPage.vue`**:

```html
<script setup>
import { ref, onMounted } from 'vue';
import productService from '@/services/productService';

const products = ref([]);
const loading = ref(false);
const error = ref(null);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Tên', key: 'name' },
  { title: 'Giá', key: 'price' },
];

async function loadProducts() {
  loading.value = true;
  error.value = null;
  try {
    // Gọi API thực tế
    products.value = await productService.getAll();
  } catch (err) {
    error.value = "Không thể tải dữ liệu. Vui lòng thử lại.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <v-container>
    <h1>Quản lý Sản phẩm</h1>
    
    <!-- Thông báo lỗi -->
    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <!-- Bảng dữ liệu -->
    <v-data-table
      :headers="headers"
      :items="products"
      :loading="loading"
    ></v-data-table>
  </v-container>
</template>
```

---

## 🧪 3. Thực hành

1. Bật cả 2 project: Backend (Visual Studio) và Frontend (VS Code).
2. Đảm bảo Backend đã cấu hình CORS.
3. Vào trang Admin/Products trên Vue.
4. Kiểm tra Network Tab (F12) xem request có thành công không (Status 200).
5. Nếu thấy dữ liệu từ SQL hiện lên bảng -> Thành công!

---

## 🎯 3. Case Study: Xây dựng Product Management Page

### Mô tả tình huống

Xây dựng trang quản lý sản phẩm hoàn chỉnh, tương tự như **Shopee Seller Center** hoặc **Tiki Seller**, kết nối Frontend và Backend.

### Yêu cầu

- Hiển thị danh sách sản phẩm từ API
- Loading state khi đang tải
- Error handling khi API lỗi
- Pagination
- Search sản phẩm
- Thêm/Sửa/Xóa sản phẩm

### Implementation

**Backend API (`Controllers/ProductsController.cs`):**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll(
        [FromQuery] string? search = null)
    {
        var query = _context.Products.AsQueryable();
        
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.Contains(search));
        }
        
        var products = await query.ToListAsync();
        return Ok(_mapper.Map<List<ProductDto>>(products));
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), 
            new { id = product.Id }, 
            _mapper.Map<ProductDto>(product));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        
        _mapper.Map(dto, product);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
```

**Frontend Service (`services/productService.js`):**
```javascript
import axios from '@/utils/axios'

export default {
  async getAll(search = '') {
    const params = search ? { search } : {}
    return axios.get('/products', { params })
  },
  
  async getById(id) {
    return axios.get(`/products/${id}`)
  },
  
  async create(data) {
    return axios.post('/products', data)
  },
  
  async update(id, data) {
    return axios.put(`/products/${id}`, data)
  },
  
  async delete(id) {
    return axios.delete(`/products/${id}`)
  }
}
```

**Frontend Component (`views/admin/ProductPage.vue`):**
```vue
<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1>Quản lý Sản phẩm</h1>
      <v-btn color="primary" @click="openCreateDialog">
        <v-icon>mdi-plus</v-icon>
        Thêm sản phẩm
      </v-btn>
    </div>
    
    <!-- Search -->
    <v-text-field
      v-model="search"
      placeholder="Tìm kiếm sản phẩm..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      class="mb-4"
      @input="handleSearch"
    />
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4">Đang tải dữ liệu...</p>
    </div>
    
    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      class="mb-4"
      closable
      @click:close="error = null"
    >
      {{ error }}
      <v-btn @click="loadProducts" class="mt-2">Thử lại</v-btn>
    </v-alert>
    
    <!-- Data Table -->
    <v-data-table
      v-else
      :headers="headers"
      :items="products"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:item.price="{ item }">
        {{ formatPrice(item.price) }} đ
      </template>
      
      <template v-slot:item.stock="{ item }">
        <v-chip :color="item.stock > 0 ? 'success' : 'error'">
          {{ item.stock > 0 ? `Còn ${item.stock}` : 'Hết hàng' }}
        </v-chip>
      </template>
      
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          @click="openEditDialog(item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          color="error"
          @click="confirmDelete(item)"
        />
      </template>
    </v-data-table>
    
    <!-- Create/Edit Dialog -->
    <ProductDialog
      v-model="dialogOpen"
      :product="selectedProduct"
      @save="handleSave"
    />
    
    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialogOpen" max-width="400">
      <v-card>
        <v-card-title>Xác nhận xóa</v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn xóa sản phẩm "{{ productToDelete?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialogOpen = false">Hủy</v-btn>
          <v-btn color="error" @click="handleDelete">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import productService from '@/services/productService'
import ProductDialog from '@/components/ProductDialog.vue'

const products = ref([])
const loading = ref(false)
const error = ref(null)
const search = ref('')
const dialogOpen = ref(false)
const selectedProduct = ref(null)
const deleteDialogOpen = ref(false)
const productToDelete = ref(null)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'name' },
  { title: 'Giá', key: 'price' },
  { title: 'Tồn kho', key: 'stock' },
  { title: 'Hành động', key: 'actions', sortable: false }
]

async function loadProducts() {
  loading.value = true
  error.value = null
  try {
    products.value = await productService.getAll(search.value)
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể tải danh sách sản phẩm'
    console.error('Error loading products:', err)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
}

let searchTimeout = null

function formatPrice(price) {
  return price.toLocaleString('vi-VN')
}

function openCreateDialog() {
  selectedProduct.value = null
  dialogOpen.value = true
}

function openEditDialog(product) {
  selectedProduct.value = { ...product }
  dialogOpen.value = true
}

async function handleSave(productData) {
  try {
    if (productData.id) {
      await productService.update(productData.id, productData)
    } else {
      await productService.create(productData)
    }
    dialogOpen.value = false
    await loadProducts()  // Reload danh sách
  } catch (err) {
    console.error('Error saving product:', err)
    alert('Lỗi khi lưu sản phẩm')
  }
}

function confirmDelete(product) {
  productToDelete.value = product
  deleteDialogOpen.value = true
}

async function handleDelete() {
  try {
    await productService.delete(productToDelete.value.id)
    deleteDialogOpen.value = false
    await loadProducts()  // Reload danh sách
  } catch (err) {
    console.error('Error deleting product:', err)
    alert('Lỗi khi xóa sản phẩm')
  }
}

onMounted(() => {
  loadProducts()
})
</script>
```

**Giải thích:**
- **Loading State**: Hiển thị spinner khi đang tải
- **Error Handling**: Hiển thị lỗi và nút "Thử lại"
- **Search**: Debounce để tránh gọi API quá nhiều
- **CRUD Operations**: Đầy đủ Create, Read, Update, Delete
- **User Feedback**: Thông báo khi thành công/thất bại

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: CORS Error
**❌ Vấn đề:** `Access to XMLHttpRequest blocked by CORS policy`  
**✅ Giải pháp:** Cấu hình CORS trong `Program.cs` với đúng origin của frontend.

### Lỗi 2: Network Error
**❌ Vấn đề:** Request fail, không có response  
**✅ Giải pháp:** Kiểm tra backend có chạy không, URL có đúng không.

### Lỗi 3: Loading state không hiển thị
**❌ Vấn đề:** User không biết đang load  
**✅ Giải pháp:** Luôn hiển thị loading indicator khi gọi API.

---

## 💡 5. Best Practices

- Luôn xử lý loading và error states
- Hiển thị thông báo lỗi user-friendly
- Retry logic cho failed requests
- Debounce cho search input

---

## 📝 6. Bài tập thực hành

1. Tạo loading skeleton cho table
2. Thêm retry button khi lỗi
3. Thêm pagination
4. Thêm search/filter
5. Cache data với Pinia

---

## 🧪 7. Mini Test

### Câu 1: CORS là gì?
<details>
<summary>Xem đáp án</summary>
Cross-Origin Resource Sharing - Cho phép frontend gọi API từ domain khác.
</details>

### Câu 2: Làm sao xử lý lỗi API?
<details>
<summary>Xem đáp án</summary>
Dùng try-catch, hiển thị error message, log để debug.
</details>

---

## 📌 8. Quick Notes

### CORS Setup
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowVueApp", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
app.UseCors("AllowVueApp");
```

### Loading Pattern
```javascript
const loading = ref(false)
const error = ref(null)

async function fetchData() {
  loading.value = true
  try {
    data.value = await service.get()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```