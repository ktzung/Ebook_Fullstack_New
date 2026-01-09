# 🟨 TUẦN 10: PHÂN QUYỀN (AUTHORIZATION)

## 🎯 Mục tiêu
- Hiểu Role-based Authorization.
- Bảo vệ API chỉ cho phép Admin.
- Ẩn/Hiện menu trên Frontend dựa theo quyền.

---

## 👮 1. Backend: Role-based Access

### 🎬 Ví dụ dẫn nhập: Phân quyền trong thực tế

Hãy tưởng tượng bạn đang xây dựng website bán hàng như **Shopee**:

**Tình huống thực tế:**
- **User thường**: Chỉ có thể xem sản phẩm, mua hàng, xem đơn hàng của mình
- **Admin**: Có thể quản lý sản phẩm, xem tất cả đơn hàng, xóa sản phẩm, quản lý user
- **Seller**: Có thể quản lý sản phẩm của mình, xem đơn hàng của sản phẩm mình

**Vấn đề nếu không phân quyền:**
```
❌ User thường có thể xóa sản phẩm
❌ User thường có thể xem thông tin user khác
❌ User thường có thể thay đổi giá sản phẩm
→ LỖ HỔNG BẢO MẬT NGHIÊM TRỌNG!
```

**Giải pháp: Role-based Authorization**
- Phân quyền dựa trên Role (Admin, User, Seller)
- Backend kiểm tra role trước khi cho phép thực hiện action
- Frontend ẩn/hiện UI dựa trên role

### 🌐 Liên hệ thực tế

**Authorization được dùng ở mọi nơi:**
- **Facebook**: Admin có thể xóa bài viết, User chỉ có thể xóa bài của mình
- **Shopee**: Seller quản lý sản phẩm của mình, Admin quản lý tất cả
- **Banking App**: User chỉ xem tài khoản của mình, Admin xem tất cả
- **GitHub**: Owner có thể delete repo, Contributor chỉ có thể push code

**Tất cả đều cần Authorization!**

### 1.1. Tạo Role mặc định
Trong `Program.cs` hoặc một Seeder Service, ta cần tạo sẵn Role "Admin" và "User".

```csharp
await roleManager.CreateAsync(new IdentityRole("Admin"));
await roleManager.CreateAsync(new IdentityRole("User"));
```

### 1.2. Bảo vệ Controller
Sử dụng thuộc tính `Roles` trong `[Authorize]`.

```csharp
[Authorize(Roles = "Admin")] // Chỉ Admin mới vào được
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    // Code xóa sản phẩm
}
```

Nếu User thường cố tình gọi API này -> Nhận lỗi **403 Forbidden**.

---

## 👁️ 2. Frontend: UI Permission

Ẩn nút "Xóa" nếu không phải Admin.

### 2.1. Lấy Role từ Token
Token JWT chứa thông tin Role (Claim). Ta cần giải mã nó.
Cài thư viện: `npm install jwt-decode`

```javascript
// stores/auth.js
import jwt_decode from "jwt-decode";

// Trong action login:
const decoded = jwt_decode(response.token);
this.user = {
    username: decoded.unique_name,
    role: decoded.role // "Admin" hoặc "User"
};
```

### 2.2. Sử dụng v-if
```html
<template>
  <v-btn v-if="authStore.user?.role === 'Admin'" color="red" @click="deleteItem">
    Xóa
  </v-btn>
</template>
```

---

## 🧪 3. Thực hành

1. Tạo 2 user: `admin@dnu.edu.vn` (Role Admin) và `student@dnu.edu.vn` (Role User).
2. Đăng nhập bằng Student -> Vào trang Product -> Không thấy nút Xóa.
3. Cố tình dùng Postman gọi API Delete với Token của Student -> Bị chặn 403.
4. Đăng nhập bằng Admin -> Thấy nút Xóa và xóa được.

---

## 🎯 3. Case Study: Xây dựng hệ thống phân quyền hoàn chỉnh

### Mô tả tình huống

Xây dựng hệ thống phân quyền cho website bán hàng, tương tự như **Shopee Seller Center**, với 3 roles: Admin, Seller, User.

### Yêu cầu

- **Admin**: Quản lý tất cả sản phẩm, xem tất cả đơn hàng, quản lý user
- **Seller**: Quản lý sản phẩm của mình, xem đơn hàng của sản phẩm mình
- **User**: Chỉ xem sản phẩm, mua hàng, xem đơn hàng của mình

### Implementation

**1. Backend - Seeder Roles (`Data/SeedData.cs`):**
```csharp
public static class SeedData
{
    public static async Task SeedRoles(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        
        var roles = new[] { "Admin", "Seller", "User" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
    
    public static async Task SeedAdminUser(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        
        var adminEmail = "admin@dnu.edu.vn";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "Administrator",
                IsActive = true
            };
            
            var result = await userManager.CreateAsync(adminUser, "Admin@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
}
```

**2. Backend - Protected Controller (`Controllers/ProductsController.cs`):**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // GET: api/products - Public, ai cũng xem được
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ProductDto>>> GetAll()
    {
        var products = await _context.Products
            .Where(p => !p.IsDeleted)
            .ToListAsync();
        return Ok(_mapper.Map<List<ProductDto>>(products));
    }
    
    // POST: api/products - Chỉ Admin và Seller
    [HttpPost]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userManager.FindByIdAsync(userId);
        var userRoles = await _userManager.GetRolesAsync(user);
        
        var product = _mapper.Map<Product>(dto);
        
        // Seller chỉ có thể tạo sản phẩm cho mình
        if (userRoles.Contains("Seller") && !userRoles.Contains("Admin"))
        {
            product.SellerId = userId;
        }
        
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetById), 
            new { id = product.Id }, 
            _mapper.Map<ProductDto>(product));
    }
    
    // PUT: api/products/5 - Chỉ Admin và Seller (sản phẩm của mình)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<IActionResult> Update(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userManager.FindByIdAsync(userId);
        var userRoles = await _userManager.GetRolesAsync(user);
        
        // Seller chỉ có thể sửa sản phẩm của mình
        if (userRoles.Contains("Seller") && !userRoles.Contains("Admin"))
        {
            if (product.SellerId != userId)
            {
                return Forbid("Bạn không có quyền sửa sản phẩm này");
            }
        }
        
        _mapper.Map(dto, product);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    // DELETE: api/products/5 - Chỉ Admin
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        
        product.IsDeleted = true;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
```

**3. Backend - Policy-based Authorization (`Program.cs`):**
```csharp
builder.Services.AddAuthorization(options =>
{
    // Policy: Chỉ Admin
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole("Admin"));
    
    // Policy: Admin hoặc Seller
    options.AddPolicy("AdminOrSeller", policy => 
        policy.RequireRole("Admin", "Seller"));
    
    // Policy: Có thể quản lý sản phẩm của mình
    options.AddPolicy("ManageOwnProduct", policy =>
        policy.Requirements.Add(new ManageOwnProductRequirement()));
});

// Sử dụng Policy
[HttpPut("{id}")]
[Authorize(Policy = "AdminOrSeller")]
public async Task<IActionResult> Update(int id, UpdateProductDto dto)
{
    // ...
}
```

**4. Frontend - Auth Store với Role (`stores/auth.js`):**
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jwt_decode from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)
  
  const isAuthenticated = computed(() => !!token.value)
  
  const userRole = computed(() => {
    if (!token.value) return null
    try {
      const decoded = jwt_decode(token.value)
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User'
    } catch {
      return null
    }
  })
  
  const isAdmin = computed(() => userRole.value === 'Admin')
  const isSeller = computed(() => userRole.value === 'Seller' || userRole.value === 'Admin')
  const isUser = computed(() => userRole.value === 'User')
  
  return {
    token,
    user,
    isAuthenticated,
    userRole,
    isAdmin,
    isSeller,
    isUser
  }
})
```

**5. Frontend - Protected Component (`views/admin/ProductPage.vue`):**
```vue
<template>
  <v-container>
    <h1>Quản lý Sản phẩm</h1>
    
    <!-- Chỉ Admin và Seller thấy nút "Thêm mới" -->
    <v-btn
      v-if="authStore.isSeller"
      color="primary"
      @click="openCreateDialog"
      class="mb-4"
    >
      Thêm sản phẩm
    </v-btn>
    
    <v-data-table :items="products" :headers="headers">
      <template v-slot:item.actions="{ item }">
        <!-- Chỉ Admin và Seller thấy nút "Sửa" -->
        <v-btn
          v-if="authStore.isSeller"
          icon="mdi-pencil"
          size="small"
          @click="editProduct(item)"
        />
        
        <!-- Chỉ Admin thấy nút "Xóa" -->
        <v-btn
          v-if="authStore.isAdmin"
          icon="mdi-delete"
          size="small"
          color="error"
          @click="deleteProduct(item)"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
```

**6. Frontend - Router Guards (`router/guards.js`):**
```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Public routes
  if (to.meta.public) {
    next()
    return
  }
  
  // Check authentication
  if (!authStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role
  if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
    next({ path: '/forbidden' })
    return
  }
  
  next()
})
```

**7. Router Config (`router/index.js`):**
```javascript
{
  path: '/admin/products',
  component: () => import('@/views/admin/ProductPage.vue'),
  meta: {
    requiresAuth: true,
    roles: ['Admin', 'Seller']  // Chỉ Admin và Seller vào được
  }
},
{
  path: '/admin/users',
  component: () => import('@/views/admin/UserPage.vue'),
  meta: {
    requiresAuth: true,
    roles: ['Admin']  // Chỉ Admin vào được
  }
}
```

**Giải thích:**
- **Backend**: Kiểm tra role trước khi cho phép action
- **Frontend**: Ẩn/hiện UI dựa trên role
- **Router Guards**: Chặn truy cập routes không đủ quyền
- **Policy-based**: Linh hoạt hơn role-based

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Role không được decode
**❌ Vấn đề:** `user.role` là undefined  
**✅ Giải pháp:** Đảm bảo backend thêm role vào JWT claims.

### Lỗi 2: 403 nhưng vẫn thấy UI
**❌ Vấn đề:** User thấy nút nhưng click lỗi  
**✅ Giải pháp:** Ẩn UI dựa trên role, không chỉ dựa vào API.

### Lỗi 3: Role check không nhất quán
**❌ Vấn đề:** Frontend và Backend check khác nhau  
**✅ Giải pháp:** Dùng cùng logic, backend là source of truth.

---

## 💡 5. Best Practices

- Backend là source of truth cho authorization
- Frontend chỉ ẩn/hiện UI, không bảo vệ thực sự
- Dùng policy-based authorization cho phức tạp
- Log mọi attempt truy cập trái phép
- Regular audit roles và permissions

---

## 📝 6. Bài tập thực hành

1. Tạo policy "CanDeleteProduct"
2. Thêm permission-based authorization
3. Tạo admin panel quản lý roles
4. Thêm audit log cho actions
5. Implement resource-based authorization

---

## 🧪 7. Mini Test

### Câu 1: Authorization vs Authentication?
<details>
<summary>Xem đáp án</summary>
Auth: Xác định ai. Authorization: Xác định được làm gì.
</details>

### Câu 2: Tại sao cần check ở cả frontend và backend?
<details>
<summary>Xem đáp án</summary>
Frontend UX, Backend security thực sự.
</details>

---

## 📌 8. Quick Notes

### Backend Authorization
```csharp
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id) { }
```

### Frontend Check
```javascript
const isAdmin = computed(() => authStore.user?.role === 'Admin')
```

### Decode JWT
```javascript
import jwt_decode from 'jwt-decode'
const decoded = jwt_decode(token)
const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
```