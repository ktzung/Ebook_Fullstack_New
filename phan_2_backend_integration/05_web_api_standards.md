# 🟩 TUẦN 5: WEB API NÂNG CAO

## 🎯 Mục tiêu
- Xây dựng API chuẩn RESTful cho Product.
- Sử dụng DTO (Data Transfer Object) để kiểm soát dữ liệu trả về.
- Cấu hình AutoMapper.

---

## 🏗️ 1. RESTful Standards

### 🎬 Ví dụ dẫn nhập: API của các website lớn

Hãy tưởng tượng bạn đang xây dựng API cho website bán hàng như **Shopee** hoặc **Tiki**:

**Tình huống thực tế:**
- Frontend cần lấy danh sách sản phẩm
- Frontend cần tạo sản phẩm mới
- Frontend cần cập nhật thông tin sản phẩm
- Frontend cần xóa sản phẩm

**Vấn đề với API không chuẩn:**
```
❌ GET /api/getAllProducts
❌ POST /api/createNewProduct
❌ PUT /api/updateProductById
❌ DELETE /api/removeProduct
```

**Vấn đề:**
- URL không nhất quán
- Khó nhớ, khó maintain
- Không tuân theo chuẩn công nghiệp

**Giải pháp: RESTful API**

**RESTful API chuẩn:**
```
✅ GET    /api/products        → Lấy danh sách
✅ GET    /api/products/1       → Lấy sản phẩm ID=1
✅ POST   /api/products         → Tạo mới
✅ PUT    /api/products/1       → Cập nhật ID=1
✅ DELETE /api/products/1      → Xóa ID=1
```

**Ưu điểm:**
- URL nhất quán, dễ nhớ
- Tuân theo chuẩn công nghiệp
- Dễ maintain và mở rộng

### 🌐 Liên hệ thực tế

**Các API lớn đều dùng RESTful:**
- **GitHub API**: `GET /repos/{owner}/{repo}`, `POST /repos/{owner}/{repo}/issues`
- **Twitter API**: `GET /2/tweets`, `POST /2/tweets`
- **Shopee API**: `GET /api/v1/products`, `POST /api/v1/products`
- **Facebook Graph API**: `GET /{user-id}`, `POST /{user-id}/feed`

**Tất cả đều tuân theo chuẩn RESTful!**

Chúng ta đã học cơ bản ở môn Backend. Giờ hãy áp dụng chuẩn công nghiệp.

### 1.1. URL Naming
- **Đúng**: `GET /api/products`, `POST /api/products`, `GET /api/products/1`
- **Sai**: `GET /api/getProducts`, `POST /api/createProduct`

### 1.2. Status Codes
- **200 OK**: Thành công.
- **201 Created**: Tạo mới thành công (POST).
- **204 No Content**: Xóa/Sửa thành công nhưng không trả về dữ liệu.
- **400 Bad Request**: Dữ liệu gửi lên sai (Validation).
- **404 Not Found**: Không tìm thấy ID.

---

## 📦 2. DTO & AutoMapper

### 🎬 Ví dụ dẫn nhập: Vấn đề bảo mật thực tế

Hãy tưởng tượng bạn đang xây dựng API cho website bán hàng:

**Tình huống thực tế:**
- Database có bảng `Users` với các trường: `Id`, `Username`, `Email`, `PasswordHash`, `InternalId`, `CreatedDate`
- Frontend cần hiển thị thông tin user đã đăng nhập
- Nếu trả về Entity trực tiếp → **LỖ HỔNG BẢO MẬT NGHIÊM TRỌNG!**

**Vấn đề: Trả về Entity trực tiếp**

```csharp
// ❌ NGUY HIỂM - Trả Entity trực tiếp
[HttpGet("{id}")]
public async Task<ActionResult<User>> GetUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    return Ok(user);  // ❌ Trả về PasswordHash, InternalId!
}
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "passwordHash": "$2a$11$...",  // ❌ LỘ MẬT KHẨU HASH!
  "internalId": "SECRET-123",      // ❌ LỘ THÔNG TIN NỘI BỘ!
  "createdDate": "2024-01-01"
}
```

**Hậu quả:**
- Hacker có thể lấy được password hash
- Có thể lấy được thông tin nội bộ
- Có thể reverse engineer database structure

**Giải pháp: DTO (Data Transfer Object)**

```csharp
// ✅ AN TOÀN - Dùng DTO
[HttpGet("{id}")]
public async Task<ActionResult<UserDto>> GetUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    var userDto = _mapper.Map<UserDto>(user);
    return Ok(userDto);  // ✅ Chỉ trả về dữ liệu cần thiết
}
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com"
  // ✅ Không có passwordHash, internalId
}
```

Không bao giờ trả về trực tiếp Entity của Database ra ngoài!

### 2.1. Tại sao cần DTO?
- **Bảo mật**: Ẩn các trường nhạy cảm (PasswordHash, InternalId).
- **Tối ưu**: Chỉ trả về dữ liệu cần thiết (VD: Danh sách chỉ cần Tên + Giá, không cần Mô tả dài).
- **Decoupling**: Thay đổi DB không làm hỏng Client.

### 🌐 Liên hệ thực tế

**Tất cả API lớn đều dùng DTO:**
- **Facebook Graph API**: Trả về User object không có password
- **GitHub API**: Trả về Repository object không có internal IDs
- **Banking API**: Trả về Account info không có sensitive data
- **E-commerce API**: Trả về Product không có cost price (chỉ có selling price)

### 2.2. Cài đặt AutoMapper
```powershell
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

### 2.3. Cấu hình Mapping
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>();
        CreateMap<CreateProductDto, Product>();
    }
}
```

Trong `Program.cs`:
```csharp
builder.Services.AddAutoMapper(typeof(Program));
```

---

## 💻 3. Viết API Product

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ProductsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(_mapper.Map<List<ProductDto>>(products));
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto request)
    {
        var product = _mapper.Map<Product>(request);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, _mapper.Map<ProductDto>(product));
    }
}
```

---

## 🧪 4. Thực hành

1. Tạo Project Web API mới tên `DNU.Shop.API`.
2. Cài đặt EF Core, SQL Server.
3. Tạo Entity `Product` (Id, Name, Price, Image, Description).
4. Tạo DTOs: `ProductDto`, `CreateProductDto`.
5. Viết Controller hoàn chỉnh CRUD.
6. Test bằng Swagger.

---

## 🎯 4. Case Study: Xây dựng Product API hoàn chỉnh

### Mô tả tình huống

Xây dựng API quản lý sản phẩm cho website bán hàng, tương tự như **Shopee** hoặc **Tiki**, với đầy đủ CRUD operations.

### Yêu cầu

- GET: Lấy danh sách sản phẩm (có pagination)
- GET: Lấy chi tiết sản phẩm
- POST: Tạo sản phẩm mới
- PUT: Cập nhật sản phẩm
- DELETE: Xóa sản phẩm
- Validation đầy đủ
- Dùng DTO để bảo mật

### Implementation

**1. Entity (`Models/Product.cs`):**
```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public decimal CostPrice { get; set; }  // ❌ Không trả ra ngoài
    public string ImageUrl { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public bool IsDeleted { get; set; }  // ❌ Không trả ra ngoài
}
```

**2. DTOs (`DTOs/ProductDto.cs`):**
```csharp
// DTO trả về cho Client
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    // ✅ Không có CostPrice, IsDeleted
}

// DTO tạo mới
public class CreateProductDto
{
    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
    [StringLength(100, ErrorMessage = "Tên không được quá 100 ký tự")]
    public string Name { get; set; }
    
    [StringLength(500)]
    public string Description { get; set; }
    
    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Giá phải >= 0")]
    public decimal Price { get; set; }
    
    public string ImageUrl { get; set; }
    
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
    
    [Required]
    public int CategoryId { get; set; }
}

// DTO cập nhật
public class UpdateProductDto
{
    [StringLength(100)]
    public string? Name { get; set; }
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? Price { get; set; }
    
    public string? ImageUrl { get; set; }
    
    [Range(0, int.MaxValue)]
    public int? Stock { get; set; }
}
```

**3. AutoMapper Configuration (`Mappings/MappingProfile.cs`):**
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Entity → DTO
        CreateMap<Product, ProductDto>();
        
        // DTO → Entity
        CreateMap<CreateProductDto, Product>()
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.CostPrice, opt => opt.Ignore())  // Không map từ DTO
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
        
        CreateMap<UpdateProductDto, Product>()
            .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
```

**4. Controller (`Controllers/ProductsController.cs`):**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ProductsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] int? categoryId = null)
    {
        var query = _context.Products.Where(p => !p.IsDeleted).AsQueryable();
        
        // Search
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.Contains(search));
        }
        
        // Filter by category
        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }
        
        // Pagination
        var total = await query.CountAsync();
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        var productDtos = _mapper.Map<List<ProductDto>>(products);
        
        return Ok(new PagedResult<ProductDto>
        {
            Data = productDtos,
            Page = page,
            PageSize = pageSize,
            Total = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
        
        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID {id}" });
        }
        
        var productDto = _mapper.Map<ProductDto>(product);
        return Ok(productDto);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var product = _mapper.Map<Product>(dto);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        var productDto = _mapper.Map<ProductDto>(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, productDto);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.IsDeleted)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID {id}" });
        }
        
        _mapper.Map(dto, product);
        product.UpdatedDate = DateTime.Now;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.IsDeleted)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID {id}" });
        }
        
        // Soft delete
        product.IsDeleted = true;
        product.UpdatedDate = DateTime.Now;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}

// Helper class cho pagination
public class PagedResult<T>
{
    public List<T> Data { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Total { get; set; }
    public int TotalPages { get; set; }
}
```

**5. Program.cs:**
```csharp
builder.Services.AddAutoMapper(typeof(Program));
```

**Giải thích:**
- **RESTful URLs**: Tuân theo chuẩn (GET, POST, PUT, DELETE)
- **DTO**: Bảo vệ thông tin nhạy cảm (CostPrice, IsDeleted)
- **AutoMapper**: Tự động map giữa Entity và DTO
- **Validation**: Kiểm tra input trước khi xử lý
- **Status Codes**: Trả về đúng status code (200, 201, 204, 400, 404)
- **Pagination**: Hỗ trợ phân trang cho danh sách lớn
- **Soft Delete**: Xóa mềm (không xóa thật khỏi DB)

**Test với Swagger:**
1. Mở Swagger UI: `https://localhost:5001/swagger`
2. Test GET `/api/products` → Xem danh sách
3. Test POST `/api/products` → Tạo mới
4. Test PUT `/api/products/1` → Cập nhật
5. Test DELETE `/api/products/1` → Xóa

---

## ❌ 5. Các lỗi thường gặp

### Lỗi 1: Trả về Entity trực tiếp

**❌ Vấn đề:**
```csharp
[HttpGet]
public async Task<ActionResult<List<Product>>> GetAll()
{
    return Ok(await _context.Products.ToListAsync()); // ❌ Trả Entity
}
```

**✅ Giải pháp:**
```csharp
[HttpGet]
public async Task<ActionResult<List<ProductDto>>> GetAll()
{
    var products = await _context.Products.ToListAsync();
    return Ok(_mapper.Map<List<ProductDto>>(products)); // ✅ Dùng DTO
}
```

**🔍 Giải thích:** Entity có thể chứa thông tin nhạy cảm, cần dùng DTO.

---

### Lỗi 2: Quên validation

**❌ Vấn đề:**
```csharp
[HttpPost]
public async Task<IActionResult> Create(CreateProductDto dto)
{
    var product = _mapper.Map<Product>(dto);
    // ❌ Không kiểm tra validation
}
```

**✅ Giải pháp:**
```csharp
[HttpPost]
public async Task<IActionResult> Create(CreateProductDto dto)
{
    if (!ModelState.IsValid) // ✅ Kiểm tra validation
        return BadRequest(ModelState);
    
    var product = _mapper.Map<Product>(dto);
    // ...
}
```

**🔍 Giải thích:** Cần validate input trước khi xử lý.

---

### Lỗi 3: Status code không đúng

**❌ Vấn đề:**
```csharp
[HttpPost]
public async Task<IActionResult> Create(CreateProductDto dto)
{
    // ...
    return Ok(product); // ❌ Nên dùng 201 Created
}
```

**✅ Giải pháp:**
```csharp
[HttpPost]
public async Task<IActionResult> Create(CreateProductDto dto)
{
    // ...
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, productDto);
}
```

**🔍 Giải thích:** POST nên trả 201 Created với location header.

---

## 💡 6. Best Practices

### 6.1. DTO Naming
- `ProductDto` - DTO trả về
- `CreateProductDto` - DTO tạo mới
- `UpdateProductDto` - DTO cập nhật

### 6.2. Validation
```csharp
public class CreateProductDto
{
    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Range(0, double.MaxValue, ErrorMessage = "Giá phải >= 0")]
    public decimal Price { get; set; }
}
```

### 6.3. Error Handling
```csharp
try
{
    // ...
}
catch (Exception ex)
{
    return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
}
```

---

## 🎯 7. Case Study: CRUD API hoàn chỉnh

**`Controllers/ProductsController.cs`:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ProductsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(_mapper.Map<List<ProductDto>>(products));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        return Ok(_mapper.Map<ProductDto>(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var product = _mapper.Map<Product>(dto);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        var productDto = _mapper.Map<ProductDto>(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, productDto);
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

---

## 📝 8. Bài tập thực hành

1. Tạo CRUD API cho Category
2. Thêm pagination cho GetAll
3. Thêm search/filter
4. Thêm validation cho DTOs
5. Viết unit tests cho controller

---

## 🧪 9. Mini Test

### Câu 1: RESTful API là gì?
<details>
<summary>Xem đáp án</summary>
Chuẩn thiết kế API dùng HTTP methods (GET, POST, PUT, DELETE) và status codes.
</details>

### Câu 2: Tại sao cần DTO?
<details>
<summary>Xem đáp án</summary>
Bảo mật, tối ưu, decoupling - không trả Entity trực tiếp.
</details>

### Câu 3: Status code 201 dùng khi nào?
<details>
<summary>Xem đáp án</summary>
Khi tạo mới thành công (POST).
</details>

---

## 📌 10. Quick Notes

### RESTful Verbs
- GET - Lấy dữ liệu
- POST - Tạo mới
- PUT - Cập nhật toàn bộ
- PATCH - Cập nhật một phần
- DELETE - Xóa

### Status Codes
- 200 OK - Thành công
- 201 Created - Tạo mới thành công
- 204 No Content - Thành công, không trả data
- 400 Bad Request - Lỗi validation
- 404 Not Found - Không tìm thấy
- 500 Internal Server Error - Lỗi server