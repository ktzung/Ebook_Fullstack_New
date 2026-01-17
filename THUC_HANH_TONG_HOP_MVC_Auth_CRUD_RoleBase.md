# 🟦 THỰC HÀNH TỔNG HỢP: HỆ THỐNG QUẢN LÝ THƯ VIỆN VỚI PHÂN QUYỀN THEO VAI TRÒ

## 🎯 MỤC TIÊU BÀI THỰC HÀNH

Xây dựng **hệ thống quản lý thư viện điện tử hoàn chỉnh** với:
- ✅ **Phân quyền rõ ràng** theo vai trò (Role-Based Access Control - RBAC)
- ✅ **Xác thực người dùng** (Authentication) với JWT
- ✅ **Phân quyền truy cập** (Authorization) theo chức năng
- ✅ **CRUD đầy đủ** với giao diện Razor Views
- ✅ **Kiến trúc MVC chuẩn** tách biệt Backend API và Frontend Admin

## 🧒 GIẢI THÍCH DỄ HIỂU (CHO NGƯỜI MỚI BẮT ĐẦU)

> **Hệ thống thư viện** giống như một thư viện thật ngoài đời:
> - **Thủ thư trưởng** (Admin): Quản lý toàn bộ, thêm/xóa sách, quản lý nhân viên
> - **Thủ thư** (Librarian): Quản lý mượn/trả sách, xem thông tin sách
> - **Độc giả** (Reader): Chỉ xem danh sách sách, mượn sách
> - **Khách** (Guest): Chỉ xem danh sách công khai

> **Authentication (Xác thực)**: Kiểm tra "bạn là ai?" - giống như xuất trình thẻ thư viện
> 
> **Authorization (Phân quyền)**: Kiểm tra "bạn được làm gì?" - giống như thẻ thư viện có ghi quyền hạn

---

## 📘 PHẦN A: MÔ TẢ BÀI TOÁN & LÝ THUYẾT

## 📋 PHẦN 1: PHÂN TÍCH YÊU CẦU VÀ THIẾT KẾ HỆ THỐNG

### 1.1. Mô tả bài toán chi tiết

**Bối cảnh**: Thư viện Đại học Đà Nẵng cần một hệ thống quản lý sách điện tử. Hệ thống có nhiều loại người dùng với quyền hạn khác nhau.

**Các chức năng chính**:
1. **Quản lý sách** (Books): Thêm, sửa, xóa, xem danh sách sách
2. **Quản lý thể loại** (Categories): Thêm, sửa, xóa, xem danh sách thể loại
3. **Quản lý người dùng** (Users): Xem danh sách, phân quyền
4. **Đăng nhập/Đăng xuất**: Xác thực người dùng

### 1.2. Định nghĩa các vai trò (Roles) và quyền hạn

> ⚠️ **QUAN TRỌNG**: Đây là phần sinh viên thường bỏ qua! Phải liệt kê đầy đủ vai trò và quyền từ đầu.

#### 📊 Bảng phân quyền chi tiết (Permission Matrix)

| Chức năng | Admin | Librarian | Reader | Guest (Chưa đăng nhập) |
|-----------|-------|-----------|--------|------------------------|
| **QUẢN LÝ SÁCH** |
| Xem danh sách sách | ✅ | ✅ | ✅ | ✅ (Chỉ sách công khai) |
| Xem chi tiết sách | ✅ | ✅ | ✅ | ✅ |
| Thêm sách mới | ✅ | ✅ | ❌ | ❌ |
| Sửa thông tin sách | ✅ | ✅ | ❌ | ❌ |
| Xóa sách | ✅ | ❌ | ❌ | ❌ |
| **QUẢN LÝ THỂ LOẠI** |
| Xem danh sách thể loại | ✅ | ✅ | ✅ | ✅ |
| Thêm thể loại | ✅ | ❌ | ❌ | ❌ |
| Sửa thể loại | ✅ | ❌ | ❌ | ❌ |
| Xóa thể loại | ✅ | ❌ | ❌ | ❌ |
| **QUẢN LÝ NGƯỜI DÙNG** |
| Xem danh sách user | ✅ | ❌ | ❌ | ❌ |
| Thêm user mới | ✅ | ❌ | ❌ | ❌ |
| Phân quyền user | ✅ | ❌ | ❌ | ❌ |
| Xóa user | ✅ | ❌ | ❌ | ❌ |
| **XÁC THỰC** |
| Đăng ký tài khoản | ✅ | ✅ | ✅ | ✅ |
| Đăng nhập | ✅ | ✅ | ✅ | ❌ |
| Đăng xuất | ✅ | ✅ | ✅ | ❌ |

#### 🎭 Mô tả chi tiết từng vai trò

**1. Admin (Quản trị viên)**
- **Vai trò**: Người quản lý toàn bộ hệ thống
- **Quyền hạn**: 
  - Toàn quyền với Books, Categories, Users
  - Có thể phân quyền cho người khác
  - Xem tất cả báo cáo thống kê
- **Ví dụ thực tế**: Giám đốc thư viện

**2. Librarian (Thủ thư)**
- **Vai trò**: Nhân viên quản lý sách
- **Quyền hạn**:
  - Thêm, sửa sách (KHÔNG được xóa)
  - Xem danh sách thể loại (KHÔNG được thêm/sửa/xóa)
  - Không quản lý được user
- **Ví dụ thực tế**: Nhân viên thư viện

**3. Reader (Độc giả)**
- **Vai trò**: Người dùng thông thường
- **Quyền hạn**:
  - Chỉ xem danh sách và chi tiết sách
  - Không được thêm/sửa/xóa bất kỳ thứ gì
- **Ví dụ thực tế**: Sinh viên, giảng viên đọc sách

**4. Guest (Khách)**
- **Vai trò**: Người chưa đăng nhập
- **Quyền hạn**:
  - Chỉ xem trang chủ và danh sách sách công khai
  - Phải đăng nhập để xem chi tiết

### 1.3. Sơ đồ kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
│  - Admin UI (Razor Views)                               │
│  - Login/Logout                                         │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Requests (with JWT Token)
                 ▼
┌─────────────────────────────────────────────────────────┐
│              ASP.NET Core MVC (Frontend)                │
│  - Controllers (CategoriesController, BooksController)  │
│  - Views (Razor .cshtml)                                │
│  - Session Management (Store JWT Token)                 │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP API Calls
                 ▼
┌─────────────────────────────────────────────────────────┐
│              ASP.NET Core API (Backend)                 │
│  - API Controllers (with [Authorize] attributes)        │
│  - JWT Authentication Middleware                        │
│  - Role-based Authorization                             │
└────────────────┬────────────────────────────────────────┘
                 │ Entity Framework Core
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   SQL Server Database                    │
│  - Books, Categories                                    │
│  - AspNetUsers, AspNetRoles (Identity tables)           │
└─────────────────────────────────────────────────────────┘
```

### 1.4. Thiết kế Database

#### Bảng Books
```sql
CREATE TABLE Books (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200) NOT NULL,
    Author NVARCHAR(100),
    ISBN NVARCHAR(20),
    PublishedYear INT,
    Price DECIMAL(18,2),
    CategoryId INT NOT NULL,
    IsPublic BIT DEFAULT 1,  -- Sách công khai hay không
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
)
```

#### Bảng Categories
```sql
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500)
)
```

#### Bảng Identity (Tự động tạo bởi ASP.NET Core Identity)
- `AspNetUsers`: Lưu thông tin user
- `AspNetRoles`: Lưu các role (Admin, Librarian, Reader)
- `AspNetUserRoles`: Liên kết user với role

---

## 📘 PHẦN B: THỰC HÀNH TỪNG BƯỚC

## 🛠️ CHUẨN BỊ (PREREQUISITES)
- Cài **.NET SDK**, **SQL Server**, **SSMS**.
- Biết cách chạy lệnh `dotnet` cơ bản.
- Có quyền tạo database trên SQL Server.

## 🧭 HƯỚNG DẪN TỪNG BƯỚC (STEP-BY-STEP WALKTHROUGH)

### Step 1: Tạo CSDL bằng Migration
**Giải thích:** CSDL là nơi lưu dữ liệu thật, cần tạo trước khi chạy API.  
**Tên file:** **`appsettings.json`**, **`Program.cs`**.  
**Block code:**
```bash
dotnet ef migrations add InitialDb
dotnet ef database update
```
**Lưu ý:** Nếu báo lỗi kết nối SQL, kiểm tra lại **ConnectionStrings**.

### Step 2: Seed dữ liệu giả (Fake Data)
**Giải thích:** Dữ liệu fake giúp demo và test nhanh.  
**Tên file:** **`Data/DbSeeder.cs`**, **`Program.cs`**.  
**Block code:**
```csharp
// Data/DbSeeder.cs
public static class DbSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.Categories.Any() || context.Books.Any()) return;
        // Thêm dữ liệu mẫu cho Category và Book
    }
}
```
```csharp
// Program.cs (sau var app = builder.Build();)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DbSeeder.Seed(context);
}
```
**Lưu ý:** Seed chỉ chạy khi DB chưa có dữ liệu.

## ✅ CHECKPOINT 1
- DB được tạo thành công và có dữ liệu mẫu.

### Step 3: Xây dựng API + Auth + Role
**Giải thích:** API xử lý CRUD và xác thực người dùng.  
**Tên file:** **`Controllers/*`**, **`Program.cs`**.  
**Lưu ý:** Đảm bảo **`[Authorize]`** và Role hoạt động đúng.

## ✅ CHECKPOINT 2
- Đăng ký/Đăng nhập thành công, nhận token JWT.

### Step 4: Xây dựng MVC Admin
**Giải thích:** MVC gọi API và hiển thị giao diện.  
**Tên file:** **`Controllers/*`**, **`Views/*`**.  
**Lưu ý:** Mọi request cần gắn token.

## ✅ CHECKPOINT 3
- Giao diện Admin hiển thị dữ liệu và CRUD chạy được.

---

## 📋 PHẦN 2: XÂY DỰNG BACKEND API VỚI PHÂN QUYỀN

### 2.1. Khởi tạo dự án API

**Bước 1**: Tạo dự án API mới

```bash
# Tạo thư mục dự án
mkdir LibraryManagement
cd LibraryManagement

# Tạo solution
dotnet new sln -n LibraryManagement

# Tạo dự án API
dotnet new webapi -n LibraryManagement.API
dotnet sln add LibraryManagement.API/LibraryManagement.API.csproj
```

**Bước 2**: Cài đặt các package cần thiết

```bash
cd LibraryManagement.API

# Entity Framework Core + SQL Server
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools

# Identity + JWT
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

> 🔎 **Giải thích**:
> - `EntityFrameworkCore`: Làm việc với database
> - `Identity`: Quản lý user/role
> - `JwtBearer`: Xác thực bằng JWT token
> - `AutoMapper`: Chuyển đổi Entity ↔ DTO

### 2.2. Tạo Models (Entities)

**File: `Models/Category.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        // Navigation property
        public ICollection<Book> Books { get; set; } = new List<Book>();
    }
}
```

**File: `Models/Book.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.Models
{
    public class Book
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? Author { get; set; }
        
        [MaxLength(20)]
        public string? ISBN { get; set; }
        
        public int? PublishedYear { get; set; }
        
        public decimal Price { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        public bool IsPublic { get; set; } = true; // Sách công khai
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Navigation property
        public Category Category { get; set; } = null!;
    }
}
```

> 🔎 **Giải thích**:
> - `[Required]`: Trường bắt buộc
> - `[MaxLength]`: Giới hạn độ dài
> - `IsPublic`: Quyết định Guest có xem được không
> - `Navigation property`: Liên kết giữa các bảng

### 2.3. Tạo ApplicationDbContext

**File: `Data/ApplicationDbContext.cs`**
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Data
{
    // Kế thừa IdentityDbContext để có sẵn bảng Users/Roles
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            // Seed dữ liệu mẫu cho Roles
            SeedRoles(builder);
            
            // Seed dữ liệu mẫu cho Categories
            SeedCategories(builder);
        }
        
        private void SeedRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole 
                { 
                    Id = "1", 
                    Name = "Admin", 
                    NormalizedName = "ADMIN" 
                },
                new IdentityRole 
                { 
                    Id = "2", 
                    Name = "Librarian", 
                    NormalizedName = "LIBRARIAN" 
                },
                new IdentityRole 
                { 
                    Id = "3", 
                    Name = "Reader", 
                    NormalizedName = "READER" 
                }
            );
        }
        
        private void SeedCategories(ModelBuilder builder)
        {
            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Công nghệ thông tin", Description = "Sách về lập trình, AI, Database" },
                new Category { Id = 2, Name = "Kinh tế", Description = "Sách về kinh tế, quản trị" },
                new Category { Id = 3, Name = "Văn học", Description = "Tiểu thuyết, thơ ca" }
            );
        }
    }
}
```

> 🔎 **Giải thích**:
> - `IdentityDbContext<IdentityUser>`: Tự động tạo bảng Users/Roles
> - `SeedRoles`: Tạo sẵn 3 role khi chạy migration
> - `SeedCategories`: Tạo sẵn dữ liệu mẫu

### 2.4. Tạo DTOs (Data Transfer Objects)

> ⚠️ **TẠI SAO CẦN DTO?**
> - **Bảo mật**: Không trả trực tiếp Entity (có thể chứa dữ liệu nhạy cảm)
> - **Linh hoạt**: Dữ liệu GET khác với POST/PUT
> - **Tránh lỗi**: Tránh circular reference khi serialize JSON

**File: `DTOs/CategoryDto.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs
{
    // DTO để trả về (GET)
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
    
    // DTO để nhận vào (POST/PUT)
    public class CategoryCreateDto
    {
        [Required(ErrorMessage = "Tên thể loại là bắt buộc")]
        [MaxLength(100, ErrorMessage = "Tên không được quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
```

**File: `DTOs/BookDto.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs
{
    // DTO để trả về (GET)
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Author { get; set; }
        public string? ISBN { get; set; }
        public int? PublishedYear { get; set; }
        public decimal Price { get; set; }
        public bool IsPublic { get; set; }
        public string CategoryName { get; set; } = string.Empty; // Chỉ lấy tên
        public DateTime CreatedAt { get; set; }
    }
    
    // DTO để nhận vào (POST/PUT)
    public class BookCreateDto
    {
        [Required(ErrorMessage = "Tên sách là bắt buộc")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? Author { get; set; }
        
        [MaxLength(20)]
        public string? ISBN { get; set; }
        
        [Range(1000, 2100, ErrorMessage = "Năm xuất bản không hợp lệ")]
        public int? PublishedYear { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải >= 0")]
        public decimal Price { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        public bool IsPublic { get; set; } = true;
    }
}
```

**File: `DTOs/AuthDto.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(6, ErrorMessage = "Mật khẩu phải ít nhất 6 ký tự")]
        public string Password { get; set; } = string.Empty;
        
        // Role mặc định khi đăng ký là Reader
        public string Role { get; set; } = "Reader";
    }
    
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
    
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }
}
```

### 2.5. Cấu hình AutoMapper

**File: `Helpers/AutoMapperProfile.cs`**
```csharp
using AutoMapper;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryCreateDto, Category>();
            
            // Book mappings
            CreateMap<Book, BookDto>()
                .ForMember(dest => dest.CategoryName, 
                          opt => opt.MapFrom(src => src.Category.Name));
            
            CreateMap<BookCreateDto, Book>();
        }
    }
}
```

> 🔎 **Giải thích**:
> - `CreateMap<Source, Destination>()`: Định nghĩa cách chuyển đổi
> - `ForMember`: Map trường không trùng tên (CategoryName)

### 2.6. Cấu hình appsettings.json

**File: `appsettings.json`**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LibraryDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "This_Is_My_Super_Secret_Key_For_JWT_Token_Min_32_Characters!",
    "Issuer": "https://localhost:5000",
    "Audience": "https://localhost:5000",
    "ExpirationHours": 3
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

> ⚠️ **LƯU Ý**: 
> - Đổi `Server=localhost` thành tên SQL Server của bạn
> - `Jwt:Key` phải >= 32 ký tự

### 2.7. Cấu hình Program.cs

**File: `Program.cs`**
```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using LibraryManagement.API.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Cấu hình Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Cấu hình password (cho dễ test, thực tế nên nghiêm ngặt hơn)
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 3. Cấu hình JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Dev only
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
    };
});

// 4. Cấu hình Authorization
builder.Services.AddAuthorization();

// 5. Cấu hình AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// 6. Cấu hình CORS (cho phép MVC Admin gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAdmin", policy =>
    {
        policy.WithOrigins("http://localhost:7000", "https://localhost:7001") // Port của Admin
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 7. Cấu hình Controllers
builder.Services.AddControllers();

// 8. Cấu hình Swagger (thêm JWT support)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Library API", Version = "v1" });
    
    // Thêm JWT vào Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 9. Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAdmin"); // Bật CORS

app.UseAuthentication(); // Đọc token
app.UseAuthorization();  // Kiểm tra quyền

app.MapControllers();

app.Run();
```

> 🔎 **Giải thích từng bước**:
> 1. Kết nối database
> 2. Bật Identity quản lý user/role
> 3. Cấu hình JWT để xác thực
> 4. Bật phân quyền
> 5. Đăng ký AutoMapper
> 6. Cho phép CORS (Admin gọi API)
> 7. Đăng ký Controllers
> 8. Cấu hình Swagger có JWT
> 9. Middleware: Authentication → Authorization

### 2.8. Tạo Migration và Update Database

```bash
# Tạo migration
dotnet ef migrations add InitialCreate

# Cập nhật database
dotnet ef database update
```

> ✅ **Kiểm tra**: Mở SQL Server, xem database `LibraryDB` đã có các bảng chưa

---

## 📋 PHẦN 3: XÂY DỰNG API CONTROLLERS VỚI PHÂN QUYỀN

### 3.1. AuthController - Đăng ký và Đăng nhập

**File: `Controllers/AuthController.cs`**
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryManagement.API.DTOs;

namespace LibraryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // 1. Kiểm tra user đã tồn tại chưa
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return BadRequest(new { Message = "User đã tồn tại!" });

            // 2. Tạo user mới
            IdentityUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(new { Message = "Tạo user thất bại!", Errors = result.Errors });

            // 3. Gán role cho user (mặc định là Reader)
            var role = model.Role ?? "Reader";
            if (!await _roleManager.RoleExistsAsync(role))
                return BadRequest(new { Message = $"Role '{role}' không tồn tại!" });

            await _userManager.AddToRoleAsync(user, role);

            return Ok(new { Message = "Đăng ký thành công!", Username = user.UserName, Role = role });
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // 1. Tìm user
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
                return Unauthorized(new { Message = "Tài khoản hoặc mật khẩu không đúng!" });

            // 2. Kiểm tra password
            if (!await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { Message = "Tài khoản hoặc mật khẩu không đúng!" });

            // 3. Lấy roles của user
            var userRoles = await _userManager.GetRolesAsync(user);

            // 4. Tạo claims (thông tin nhúng vào token)
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // Thêm role vào claims
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            // 5. Tạo JWT token
            var token = CreateToken(authClaims);
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new LoginResponseDto
            {
                Token = tokenString,
                Expiration = token.ValidTo,
                Username = user.UserName!,
                Roles = userRoles.ToList()
            });
        }

        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(
                    Convert.ToDouble(_configuration["Jwt:ExpirationHours"])),
                claims: authClaims,
                signingCredentials: new SigningCredentials(
                    authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }
    }
}
```

> 🔎 **Giải thích luồng đăng nhập**:
> 1. Kiểm tra username/password
> 2. Lấy danh sách roles của user
> 3. Tạo claims (thông tin user + roles)
> 4. Ký JWT token với secret key
> 5. Trả token cho client

### 3.2. CategoriesController - Quản lý thể loại

**File: `Controllers/CategoriesController.cs`**
```csharp
using AutoMapper;
using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories
        // Ai cũng xem được (không cần đăng nhập)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(_mapper.Map<List<CategoryDto>>(categories));
        }

        // GET: api/Categories/5
        // Ai cũng xem được
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { Message = "Không tìm thấy thể loại!" });

            return Ok(_mapper.Map<CategoryDto>(category));
        }

        // POST: api/Categories
        // CHỈ Admin được thêm
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDto>> PostCategory(CategoryCreateDto categoryDto)
        {
            var category = _mapper.Map<Category>(categoryDto);
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<CategoryDto>(category);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, result);
        }

        // PUT: api/Categories/5
        // CHỈ Admin được sửa
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutCategory(int id, CategoryCreateDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { Message = "Không tìm thấy thể loại!" });

            // Cập nhật
            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Categories/5
        // CHỈ Admin được xóa
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { Message = "Không tìm thấy thể loại!" });

            // Kiểm tra có sách nào đang dùng category này không
            var hasBooks = await _context.Books.AnyAsync(b => b.CategoryId == id);
            if (hasBooks)
                return BadRequest(new { Message = "Không thể xóa thể loại đang có sách!" });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
```

> 🔎 **Giải thích phân quyền**:
> - `[AllowAnonymous]`: Ai cũng truy cập được (kể cả chưa đăng nhập)
> - `[Authorize(Roles = "Admin")]`: CHỈ Admin mới được gọi
> - Nếu không có attribute → Phải đăng nhập (bất kỳ role nào)

### 3.3. BooksController - Quản lý sách (PHÂN QUYỀN PHỨC TẠP)

**File: `Controllers/BooksController.cs`**
```csharp
using AutoMapper;
using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LibraryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BooksController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Books
        // Guest: Chỉ xem sách công khai (IsPublic = true)
        // User đã login: Xem tất cả
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            IQueryable<Book> query = _context.Books.Include(b => b.Category);

            // Nếu chưa đăng nhập → chỉ lấy sách công khai
            if (!User.Identity!.IsAuthenticated)
            {
                query = query.Where(b => b.IsPublic);
            }

            var books = await query.ToListAsync();
            return Ok(_mapper.Map<List<BookDto>>(books));
        }

        // GET: api/Books/5
        // Ai cũng xem được (nhưng Guest chỉ xem được sách công khai)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound(new { Message = "Không tìm thấy sách!" });

            // Nếu sách không công khai và user chưa đăng nhập → Forbidden
            if (!book.IsPublic && !User.Identity!.IsAuthenticated)
                return Forbid();

            return Ok(_mapper.Map<BookDto>(book));
        }

        // POST: api/Books
        // Admin hoặc Librarian được thêm
        [HttpPost]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<ActionResult<BookDto>> PostBook(BookCreateDto bookDto)
        {
            // Kiểm tra CategoryId có tồn tại không
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == bookDto.CategoryId);
            if (!categoryExists)
                return BadRequest(new { Message = "Thể loại không tồn tại!" });

            var book = _mapper.Map<Book>(bookDto);
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Load lại Category để trả về
            await _context.Entry(book).Reference(b => b.Category).LoadAsync();

            var result = _mapper.Map<BookDto>(book);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, result);
        }

        // PUT: api/Books/5
        // Admin hoặc Librarian được sửa
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> PutBook(int id, BookCreateDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { Message = "Không tìm thấy sách!" });

            // Kiểm tra CategoryId
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == bookDto.CategoryId);
            if (!categoryExists)
                return BadRequest(new { Message = "Thể loại không tồn tại!" });

            // Cập nhật
            book.Title = bookDto.Title;
            book.Author = bookDto.Author;
            book.ISBN = bookDto.ISBN;
            book.PublishedYear = bookDto.PublishedYear;
            book.Price = bookDto.Price;
            book.CategoryId = bookDto.CategoryId;
            book.IsPublic = bookDto.IsPublic;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Books/5
        // CHỈ Admin được xóa (Librarian KHÔNG được xóa)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { Message = "Không tìm thấy sách!" });

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
```

> 🔎 **Giải thích phân quyền phức tạp**:
> - `[Authorize(Roles = "Admin,Librarian")]`: Admin HOẶC Librarian đều được
> - `User.Identity.IsAuthenticated`: Kiểm tra đã đăng nhập chưa
> - Logic phân quyền động: Guest chỉ xem sách công khai

---

## 📋 PHẦN 4: TEST API VỚI POSTMAN/SWAGGER

### 4.1. Chạy API

```bash
cd LibraryManagement.API
dotnet run
```

Mở trình duyệt: `https://localhost:5001/swagger`

### 4.2. Test Authentication

**Bước 1**: Đăng ký tài khoản Admin

```http
POST /api/Auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@library.com",
  "password": "Admin123",
  "role": "Admin"
}
```

**Bước 2**: Đăng ký tài khoản Librarian

```http
POST /api/Auth/register
Content-Type: application/json

{
  "username": "librarian1",
  "email": "librarian@library.com",
  "password": "Lib123",
  "role": "Librarian"
}
```

**Bước 3**: Đăng nhập

```http
POST /api/Auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2026-01-17T10:00:00Z",
  "username": "admin",
  "roles": ["Admin"]
}
```

> ✅ **Copy token** để dùng cho các request sau!

### 4.3. Test Authorization

**Test 1**: Xem danh sách Categories (không cần token)
```http
GET /api/Categories
```
✅ Kết quả: Thành công (200 OK)

**Test 2**: Thêm Category (cần token Admin)
```http
POST /api/Categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Khoa học",
  "description": "Sách khoa học tự nhiên"
}
```
- ✅ Nếu dùng token Admin: Thành công (201 Created)
- ❌ Nếu dùng token Librarian: Lỗi 403 Forbidden
- ❌ Nếu không có token: Lỗi 401 Unauthorized

**Test 3**: Thêm Book (Admin hoặc Librarian)
```http
POST /api/Books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lập trình C# nâng cao",
  "author": "Nguyễn Văn A",
  "isbn": "978-1234567890",
  "publishedYear": 2024,
  "price": 250000,
  "categoryId": 1,
  "isPublic": true
}
```
- ✅ Admin: Thành công
- ✅ Librarian: Thành công
- ❌ Reader: Lỗi 403 Forbidden

**Test 4**: Xóa Book (chỉ Admin)
```http
DELETE /api/Books/1
Authorization: Bearer <token>
```
- ✅ Admin: Thành công (204 No Content)
- ❌ Librarian: Lỗi 403 Forbidden

> ✅ **CHECKPOINT**: API phân quyền hoạt động đúng!

---

**(Tiếp tục PHẦN 5, 6, 7 trong phần 2 do giới hạn độ dài...)**

## 📋 TÓM TẮT PHẦN 1-4

✅ **Đã hoàn thành**:
1. Phân tích yêu cầu và thiết kế hệ thống
2. Định nghĩa rõ ràng 4 vai trò và bảng phân quyền
3. Xây dựng Backend API với JWT + Role-based Authorization
4. Test API với Postman/Swagger

🔜 **Phần tiếp theo** (PHẦN 5-7):
- Xây dựng MVC Admin với Razor Views
- Tích hợp Authentication vào MVC
- CRUD đầy đủ với phân quyền UI
- Deployment và Testing

---

**🎓 BÀI TẬP VỀ NHÀ (PHẦN 1-4)**:
1. Thêm role "Guest" và test phân quyền
2. Thêm endpoint GET /api/Books/public (chỉ lấy sách công khai)
3. Thêm validation: ISBN phải unique
4. Thêm endpoint GET /api/Auth/me (lấy thông tin user hiện tại)

---

## 📋 PHẦN 5: XÂY DỰNG MVC ADMIN PANEL

### 5.1. Khởi tạo dự án MVC

**Bước 1**: Tạo dự án MVC trong cùng Solution

```bash
# Quay về thư mục gốc Solution
cd ..

# Tạo dự án MVC
dotnet new mvc -n LibraryManagement.Admin

# Thêm vào Solution
dotnet sln add LibraryManagement.Admin/LibraryManagement.Admin.csproj
```

**Bước 2**: Cài đặt packages cần thiết

```bash
cd LibraryManagement.Admin

# Không cần cài thêm gì, MVC đã có sẵn HttpClient
```

### 5.2. Cấu hình appsettings.json (Admin)

**File: `appsettings.json`**
```json
{
  "ApiSettings": {
    "BaseUrl": "https://localhost:5001/"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

> 🔎 **Lưu ý**: Port 5001 phải khớp với port API của bạn

### 5.3. Cấu hình Program.cs (Admin)

**File: `Program.cs`**
```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Đọc API Base URL từ config
var apiBaseUrl = builder.Configuration["ApiSettings:BaseUrl"];

// 2. Đăng ký HttpClient
builder.Services.AddHttpClient("LibraryApi", client =>
{
    client.BaseAddress = new Uri(apiBaseUrl!);
    client.Timeout = TimeSpan.FromSeconds(30);
});

// 3. Cấu hình Session (để lưu JWT Token)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// 4. Đăng ký MVC
builder.Services.AddControllersWithViews();

var app = builder.Build();

// 5. Middleware Pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession(); // Bật Session (PHẢI đặt trước Authorization)

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

> 🔎 **Giải thích**:
> - `AddHttpClient`: Đăng ký HttpClient để gọi API
> - `AddSession`: Lưu JWT token vào session
> - `UseSession()`: Phải đặt TRƯỚC `MapControllerRoute`

### 5.4. Tạo Models/DTOs cho Admin

> ⚠️ **LƯU Ý**: Admin cần có DTO riêng (không share với API)

**File: `Models/CategoryViewModel.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Admin.Models
{
    public class CategoryViewModel
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên thể loại là bắt buộc")]
        [Display(Name = "Tên thể loại")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Display(Name = "Mô tả")]
        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
```

**File: `Models/BookViewModel.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Admin.Models
{
    public class BookViewModel
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên sách là bắt buộc")]
        [Display(Name = "Tên sách")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Display(Name = "Tác giả")]
        [MaxLength(100)]
        public string? Author { get; set; }
        
        [Display(Name = "ISBN")]
        [MaxLength(20)]
        public string? ISBN { get; set; }
        
        [Display(Name = "Năm xuất bản")]
        [Range(1000, 2100)]
        public int? PublishedYear { get; set; }
        
        [Display(Name = "Giá")]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Required]
        [Display(Name = "Thể loại")]
        public int CategoryId { get; set; }
        
        [Display(Name = "Công khai")]
        public bool IsPublic { get; set; } = true;
        
        // Chỉ dùng để hiển thị
        public string? CategoryName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

**File: `Models/LoginViewModel.cs`**
```csharp
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Admin.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [Display(Name = "Tên đăng nhập")]
        public string Username { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [Display(Name = "Mật khẩu")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
    
    public class LoginResponseViewModel
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }
}
```

### 5.5. Tạo Base Controller (Xử lý Token)

> ✅ **MẸO HAY**: Tạo BaseController để tránh lặp code gắn token

**File: `Controllers/BaseController.cs`**
```csharp
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace LibraryManagement.Admin.Controllers
{
    public class BaseController : Controller
    {
        protected readonly IHttpClientFactory _httpClientFactory;

        public BaseController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        /// <summary>
        /// Tạo HttpClient và tự động gắn JWT token từ Session
        /// </summary>
        protected HttpClient CreateAuthorizedClient()
        {
            var client = _httpClientFactory.CreateClient("LibraryApi");
            
            // Lấy token từ Session
            var token = HttpContext.Session.GetString("JWToken");
            
            // Gắn token vào header nếu có
            if (!string.IsNullOrEmpty(token))
            {
                client.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Bearer", token);
            }
            
            return client;
        }

        /// <summary>
        /// Kiểm tra user đã đăng nhập chưa
        /// </summary>
        protected bool IsAuthenticated()
        {
            var token = HttpContext.Session.GetString("JWToken");
            return !string.IsNullOrEmpty(token);
        }

        /// <summary>
        /// Lấy username từ Session
        /// </summary>
        protected string? GetCurrentUsername()
        {
            return HttpContext.Session.GetString("Username");
        }

        /// <summary>
        /// Lấy roles từ Session
        /// </summary>
        protected List<string> GetCurrentUserRoles()
        {
            var rolesJson = HttpContext.Session.GetString("UserRoles");
            if (string.IsNullOrEmpty(rolesJson))
                return new List<string>();
            
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(rolesJson) 
                   ?? new List<string>();
        }

        /// <summary>
        /// Kiểm tra user có role cụ thể không
        /// </summary>
        protected bool HasRole(string role)
        {
            var roles = GetCurrentUserRoles();
            return roles.Contains(role);
        }
    }
}
```

> 🔎 **Giải thích**:
> - `CreateAuthorizedClient()`: Tự động gắn token vào mọi request
> - `IsAuthenticated()`: Kiểm tra đã login chưa
> - `HasRole()`: Kiểm tra quyền

---

## 📋 PHẦN 6: XÂY DỰNG CHỨC NĂNG ĐĂNG NHẬP

### 6.1. AccountController

**File: `Controllers/AccountController.cs`**
```csharp
using LibraryManagement.Admin.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace LibraryManagement.Admin.Controllers
{
    public class AccountController : BaseController
    {
        public AccountController(IHttpClientFactory httpClientFactory) 
            : base(httpClientFactory)
        {
        }

        // GET: /Account/Login
        public IActionResult Login()
        {
            // Nếu đã đăng nhập rồi → redirect về Home
            if (IsAuthenticated())
                return RedirectToAction("Index", "Home");
            
            return View();
        }

        // POST: /Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            try
            {
                var client = _httpClientFactory.CreateClient("LibraryApi");
                
                // Gọi API Login
                var response = await client.PostAsJsonAsync("/api/Auth/login", model);

                if (response.IsSuccessStatusCode)
                {
                    // Đọc response
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var loginResponse = JsonSerializer.Deserialize<LoginResponseViewModel>(
                        jsonString, 
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (loginResponse != null && !string.IsNullOrEmpty(loginResponse.Token))
                    {
                        // Lưu thông tin vào Session
                        HttpContext.Session.SetString("JWToken", loginResponse.Token);
                        HttpContext.Session.SetString("Username", loginResponse.Username);
                        HttpContext.Session.SetString("UserRoles", 
                            JsonSerializer.Serialize(loginResponse.Roles));

                        TempData["SuccessMessage"] = $"Chào mừng {loginResponse.Username}!";
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    ModelState.AddModelError("", "Đăng nhập thất bại! Kiểm tra lại tài khoản.");
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Lỗi kết nối API: {ex.Message}");
            }

            return View(model);
        }

        // GET: /Account/Logout
        public IActionResult Logout()
        {
            // Xóa toàn bộ Session
            HttpContext.Session.Clear();
            
            TempData["InfoMessage"] = "Đã đăng xuất thành công!";
            return RedirectToAction("Login");
        }

        // GET: /Account/AccessDenied
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
```

### 6.2. Login View

**File: `Views/Account/Login.cshtml`**
```html
@model LibraryManagement.Admin.Models.LoginViewModel

@{
    ViewData["Title"] = "Đăng nhập";
    Layout = null; // Không dùng layout chung
}

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - Hệ thống Thư viện</title>
    <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center mt-5">
            <div class="col-md-5">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white text-center">
                        <h3><i class="bi bi-book"></i> HỆ THỐNG THƯ VIỆN</h3>
                        <p class="mb-0">Đăng nhập để tiếp tục</p>
                    </div>
                    <div class="card-body p-4">
                        @if (ViewData.ModelState.ErrorCount > 0)
                        {
                            <div class="alert alert-danger" role="alert">
                                <div asp-validation-summary="All" class="text-danger"></div>
                            </div>
                        }

                        <form asp-action="Login" method="post">
                            <div class="mb-3">
                                <label asp-for="Username" class="form-label"></label>
                                <input asp-for="Username" class="form-control form-control-lg" 
                                       placeholder="Nhập tên đăng nhập" autofocus />
                                <span asp-validation-for="Username" class="text-danger"></span>
                            </div>

                            <div class="mb-3">
                                <label asp-for="Password" class="form-label"></label>
                                <input asp-for="Password" class="form-control form-control-lg" 
                                       placeholder="Nhập mật khẩu" />
                                <span asp-validation-for="Password" class="text-danger"></span>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer text-center text-muted">
                        <small>
                            <strong>Tài khoản test:</strong><br/>
                            Admin: admin / Admin123<br/>
                            Librarian: librarian1 / Lib123
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="~/lib/jquery-validation/dist/jquery.validate.min.js"></script>
    <script src="~/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js"></script>
</body>
</html>
```

### 6.3. Access Denied View

**File: `Views/Account/AccessDenied.cshtml`**
```html
@{
    ViewData["Title"] = "Truy cập bị từ chối";
}

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6 text-center">
            <div class="alert alert-danger" role="alert">
                <h1 class="display-1">🚫</h1>
                <h2>Truy cập bị từ chối</h2>
                <p class="lead">Bạn không có quyền truy cập trang này.</p>
                <hr>
                <p>Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.</p>
                <a asp-controller="Home" asp-action="Index" class="btn btn-primary">
                    <i class="bi bi-house"></i> Về trang chủ
                </a>
            </div>
        </div>
    </div>
</div>
```

---

## 📋 PHẦN 7: XÂY DỰNG CRUD VỚI PHÂN QUYỀN UI

### 7.1. CategoriesController (Admin MVC)

**File: `Controllers/CategoriesController.cs`**
```csharp
using LibraryManagement.Admin.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace LibraryManagement.Admin.Controllers
{
    public class CategoriesController : BaseController
    {
        public CategoriesController(IHttpClientFactory httpClientFactory) 
            : base(httpClientFactory)
        {
        }

        // GET: Categories
        public async Task<IActionResult> Index()
        {
            try
            {
                var client = CreateAuthorizedClient();
                var response = await client.GetAsync("/api/Categories");

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var categories = JsonSerializer.Deserialize<List<CategoryViewModel>>(
                        jsonString, 
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    // Truyền thông tin role để View biết hiển thị nút gì
                    ViewBag.IsAdmin = HasRole("Admin");
                    
                    return View(categories ?? new List<CategoryViewModel>());
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return RedirectToAction("Login", "Account");
                }
                
                ViewBag.ErrorMessage = "Không thể tải dữ liệu từ API";
                return View(new List<CategoryViewModel>());
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = $"Lỗi: {ex.Message}";
                return View(new List<CategoryViewModel>());
            }
        }

        // GET: Categories/Create
        public IActionResult Create()
        {
            // Kiểm tra quyền
            if (!HasRole("Admin"))
                return RedirectToAction("AccessDenied", "Account");
            
            return View();
        }

        // POST: Categories/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryViewModel model)
        {
            if (!HasRole("Admin"))
                return RedirectToAction("AccessDenied", "Account");

            if (!ModelState.IsValid)
                return View(model);

            try
            {
                var client = CreateAuthorizedClient();
                var response = await client.PostAsJsonAsync("/api/Categories", model);

                if (response.IsSuccessStatusCode)
                {
                    TempData["SuccessMessage"] = "Thêm thể loại thành công!";
                    return RedirectToAction(nameof(Index));
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return RedirectToAction("Login", "Account");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    return RedirectToAction("AccessDenied", "Account");
                }
                
                var errorContent = await response.Content.ReadAsStringAsync();
                ModelState.AddModelError("", $"Lỗi: {errorContent}");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Lỗi: {ex.Message}");
            }

            return View(model);
        }

        // GET: Categories/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            if (!HasRole("Admin"))
                return RedirectToAction("AccessDenied", "Account");

            try
            {
                var client = CreateAuthorizedClient();
                var response = await client.GetAsync($"/api/Categories/{id}");

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var category = JsonSerializer.Deserialize<CategoryViewModel>(
                        jsonString, 
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    return View(category);
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy thể loại!";
                    return RedirectToAction(nameof(Index));
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Lỗi: {ex.Message}";
                return RedirectToAction(nameof(Index));
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Categories/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryViewModel model)
        {
            if (!HasRole("Admin"))
                return RedirectToAction("AccessDenied", "Account");

            if (id != model.Id)
                return NotFound();

            if (!ModelState.IsValid)
                return View(model);

            try
            {
                var client = CreateAuthorizedClient();
                var response = await client.PutAsJsonAsync($"/api/Categories/{id}", model);

                if (response.IsSuccessStatusCode)
                {
                    TempData["SuccessMessage"] = "Cập nhật thể loại thành công!";
                    return RedirectToAction(nameof(Index));
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    return RedirectToAction("AccessDenied", "Account");
                }
                
                var errorContent = await response.Content.ReadAsStringAsync();
                ModelState.AddModelError("", $"Lỗi: {errorContent}");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Lỗi: {ex.Message}");
            }

            return View(model);
        }

        // GET: Categories/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            if (!HasRole("Admin"))
                return RedirectToAction("AccessDenied", "Account");

            try
            {
                var client = CreateAuthorizedClient();
                var response = await client.DeleteAsync($"/api/Categories/{id}");

                if (response.IsSuccessStatusCode)
                {
                    TempData["SuccessMessage"] = "Xóa thể loại thành công!";
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    TempData["ErrorMessage"] = "Không thể xóa thể loại đang có sách!";
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    return RedirectToAction("AccessDenied", "Account");
                }
                else
                {
                    TempData["ErrorMessage"] = "Xóa thất bại!";
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Lỗi: {ex.Message}";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
```

### 7.2. Categories Views

**File: `Views/Categories/Index.cshtml`**
```html
@model IEnumerable<LibraryManagement.Admin.Models.CategoryViewModel>

@{
    ViewData["Title"] = "Quản lý thể loại";
}

<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2><i class="bi bi-folder"></i> Danh sách thể loại</h2>
        
        @if (ViewBag.IsAdmin == true)
        {
            <a asp-action="Create" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Thêm mới
            </a>
        }
    </div>

    @if (TempData["SuccessMessage"] != null)
    {
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle"></i> @TempData["SuccessMessage"]
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    }

    @if (TempData["ErrorMessage"] != null)
    {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle"></i> @TempData["ErrorMessage"]
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    }

    @if (ViewBag.ErrorMessage != null)
    {
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> @ViewBag.ErrorMessage
        </div>
    }

    <div class="card shadow-sm">
        <div class="card-body">
            <table class="table table-hover table-striped">
                <thead class="table-dark">
                    <tr>
                        <th style="width: 10%">ID</th>
                        <th style="width: 30%">Tên thể loại</th>
                        <th style="width: 40%">Mô tả</th>
                        @if (ViewBag.IsAdmin == true)
                        {
                            <th style="width: 20%" class="text-center">Thao tác</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    @if (Model != null && Model.Any())
                    {
                        foreach (var item in Model)
                        {
                            <tr>
                                <td>@item.Id</td>
                                <td><strong>@item.Name</strong></td>
                                <td>@(item.Description ?? "Chưa có mô tả")</td>
                                @if (ViewBag.IsAdmin == true)
                                {
                                    <td class="text-center">
                                        <a asp-action="Edit" asp-route-id="@item.Id" 
                                           class="btn btn-sm btn-warning">
                                            <i class="bi bi-pencil"></i> Sửa
                                        </a>
                                        <a asp-action="Delete" asp-route-id="@item.Id" 
                                           class="btn btn-sm btn-danger"
                                           onclick="return confirm('Bạn có chắc muốn xóa thể loại này?');">
                                            <i class="bi bi-trash"></i> Xóa
                                        </a>
                                    </td>
                                }
                            </tr>
                        }
                    }
                    else
                    {
                        <tr>
                            <td colspan="@(ViewBag.IsAdmin == true ? 4 : 3)" class="text-center text-muted">
                                <i class="bi bi-inbox"></i> Chưa có dữ liệu
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    </div>
</div>
```

**File: `Views/Categories/Create.cshtml`**
```html
@model LibraryManagement.Admin.Models.CategoryViewModel

@{
    ViewData["Title"] = "Thêm thể loại mới";
}

<div class="container mt-4">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h4><i class="bi bi-plus-circle"></i> Thêm thể loại mới</h4>
                </div>
                <div class="card-body">
                    <form asp-action="Create" method="post">
                        <div asp-validation-summary="ModelOnly" class="alert alert-danger"></div>

                        <div class="mb-3">
                            <label asp-for="Name" class="form-label"></label>
                            <input asp-for="Name" class="form-control" placeholder="Nhập tên thể loại" />
                            <span asp-validation-for="Name" class="text-danger"></span>
                        </div>

                        <div class="mb-3">
                            <label asp-for="Description" class="form-label"></label>
                            <textarea asp-for="Description" class="form-control" rows="3" 
                                      placeholder="Nhập mô tả (không bắt buộc)"></textarea>
                            <span asp-validation-for="Description" class="text-danger"></span>
                        </div>

                        <div class="d-flex justify-content-between">
                            <a asp-action="Index" class="btn btn-secondary">
                                <i class="bi bi-arrow-left"></i> Quay lại
                            </a>
                            <button type="submit" class="btn btn-success">
                                <i class="bi bi-save"></i> Lưu lại
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@section Scripts {
    @{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
```

**File: `Views/Categories/Edit.cshtml`**
```html
@model LibraryManagement.Admin.Models.CategoryViewModel

@{
    ViewData["Title"] = "Cập nhật thể loại";
}

<div class="container mt-4">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card shadow">
                <div class="card-header bg-warning text-dark">
                    <h4><i class="bi bi-pencil"></i> Cập nhật thể loại</h4>
                </div>
                <div class="card-body">
                    <form asp-action="Edit" method="post">
                        <input type="hidden" asp-for="Id" />
                        <div asp-validation-summary="ModelOnly" class="alert alert-danger"></div>

                        <div class="mb-3">
                            <label asp-for="Name" class="form-label"></label>
                            <input asp-for="Name" class="form-control" />
                            <span asp-validation-for="Name" class="text-danger"></span>
                        </div>

                        <div class="mb-3">
                            <label asp-for="Description" class="form-label"></label>
                            <textarea asp-for="Description" class="form-control" rows="3"></textarea>
                            <span asp-validation-for="Description" class="text-danger"></span>
                        </div>

                        <div class="d-flex justify-content-between">
                            <a asp-action="Index" class="btn btn-secondary">
                                <i class="bi bi-arrow-left"></i> Quay lại
                            </a>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-save"></i> Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@section Scripts {
    @{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
```

### 7.3. Cập nhật Layout với thông tin User

**File: `Views/Shared/_Layout.cshtml`**
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - Hệ thống Thư viện</title>
    <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark border-bottom box-shadow mb-3">
            <div class="container-fluid">
                <a class="navbar-brand" asp-area="" asp-controller="Home" asp-action="Index">
                    <i class="bi bi-book"></i> Thư viện DNU
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul class="navbar-nav flex-grow-1">
                        <li class="nav-item">
                            <a class="nav-link" asp-controller="Home" asp-action="Index">
                                <i class="bi bi-house"></i> Trang chủ
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" asp-controller="Categories" asp-action="Index">
                                <i class="bi bi-folder"></i> Thể loại
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" asp-controller="Books" asp-action="Index">
                                <i class="bi bi-book"></i> Sách
                            </a>
                        </li>
                    </ul>
                    
                    @* Hiển thị thông tin user *@
                    <ul class="navbar-nav">
                        @{
                            var username = Context.Session.GetString("Username");
                            var rolesJson = Context.Session.GetString("UserRoles");
                            var roles = !string.IsNullOrEmpty(rolesJson) 
                                ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(rolesJson) 
                                : new List<string>();
                        }
                        
                        @if (!string.IsNullOrEmpty(username))
                        {
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" 
                                   role="button" data-bs-toggle="dropdown">
                                    <i class="bi bi-person-circle"></i> @username
                                    @if (roles.Any())
                                    {
                                        <span class="badge bg-info">@string.Join(", ", roles)</span>
                                    }
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#"><i class="bi bi-person"></i> Thông tin</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li>
                                        <a class="dropdown-item" asp-controller="Account" asp-action="Logout">
                                            <i class="bi bi-box-arrow-right"></i> Đăng xuất
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        }
                        else
                        {
                            <li class="nav-item">
                                <a class="nav-link" asp-controller="Account" asp-action="Login">
                                    <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
                                </a>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    
    <div class="container">
        <main role="main" class="pb-3">
            @RenderBody()
        </main>
    </div>

    <footer class="border-top footer text-muted">
        <div class="container text-center">
            &copy; 2026 - Hệ thống Thư viện Đại học Đà Nẵng
        </div>
    </footer>
    
    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="~/js/site.js" asp-append-version="true"></script>
    @await RenderSectionAsync("Scripts", required: false)
</body>
</html>
```

---

## 📋 PHẦN 8: CHẠY VÀ KIỂM THỬ TOÀN BỘ HỆ THỐNG

### 8.1. Cấu hình Multiple Startup Projects

**Visual Studio**:
1. Right-click Solution → Properties
2. Chọn "Multiple startup projects"
3. Set Action = "Start" cho cả API và Admin
4. OK

**VS Code / Rider**:
- Mở 2 terminal riêng biệt
- Terminal 1: `cd LibraryManagement.API && dotnet run`
- Terminal 2: `cd LibraryManagement.Admin && dotnet run`

### 8.2. Kịch bản kiểm thử đầy đủ

#### Test Case 1: Đăng nhập với Admin
1. Mở `https://localhost:7001` (Admin)
2. Click "Đăng nhập"
3. Nhập: `admin` / `Admin123`
4. ✅ Kết quả: Chuyển về trang chủ, hiển thị "Chào mừng admin" + badge "Admin"

#### Test Case 2: Quản lý Categories (Admin)
1. Click menu "Thể loại"
2. ✅ Thấy nút "Thêm mới", "Sửa", "Xóa"
3. Click "Thêm mới"
4. Nhập: Tên = "Triết học", Mô tả = "Sách triết học"
5. Click "Lưu lại"
6. ✅ Kết quả: Thấy thông báo "Thêm thành công", danh sách có "Triết học"
7. Click "Sửa" → Đổi tên → "Cập nhật"
8. ✅ Kết quả: Tên đã thay đổi
9. Click "Xóa" → Confirm
10. ✅ Kết quả: Đã xóa khỏi danh sách

#### Test Case 3: Đăng nhập với Librarian
1. Đăng xuất (Admin)
2. Đăng nhập: `librarian1` / `Lib123`
3. Click menu "Thể loại"
4. ✅ Kết quả: KHÔNG thấy nút "Thêm mới", "Sửa", "Xóa"
5. Thử truy cập trực tiếp: `https://localhost:7001/Categories/Create`
6. ✅ Kết quả: Redirect về "Access Denied"

#### Test Case 4: Quản lý Books (Librarian)
1. Click menu "Sách"
2. ✅ Thấy nút "Thêm mới", "Sửa" (KHÔNG có "Xóa")
3. Click "Thêm mới"
4. Nhập thông tin sách
5. ✅ Kết quả: Thêm thành công
6. Click "Sửa"
7. ✅ Kết quả: Sửa thành công
8. Thử truy cập: `https://localhost:7001/Books/Delete/1`
9. ✅ Kết quả: Access Denied (vì chỉ Admin mới xóa được)

### 8.3. Checklist hoàn chỉnh

- [ ] API chạy được và Swagger hoạt động
- [ ] Admin MVC chạy được
- [ ] Đăng nhập thành công với Admin
- [ ] Đăng nhập thành công với Librarian
- [ ] Admin thấy đầy đủ nút CRUD
- [ ] Librarian KHÔNG thấy nút xóa Categories
- [ ] Librarian thấy nút thêm/sửa Books
- [ ] Librarian KHÔNG xóa được Books
- [ ] Đăng xuất hoạt động đúng
- [ ] Session timeout sau 30 phút

---

## 📋 PHẦN 9: TÓM TẮT VÀ BÀI TẬP

### 9.1. Tóm tắt kiến thức đã học

✅ **Phân quyền (Authorization)**:
- Định nghĩa rõ ràng Roles và Permissions
- Sử dụng `[Authorize(Roles = "...")]`
- Kiểm tra quyền trong Controller và View

✅ **Xác thực (Authentication)**:
- JWT Token để xác thực API
- Session để lưu token trong MVC
- BaseController để tái sử dụng code

✅ **MVC Pattern**:
- Model: ViewModel cho UI
- View: Razor với phân quyền động
- Controller: Gọi API và xử lý logic

✅ **Best Practices**:
- DTO để bảo mật
- AutoMapper để chuyển đổi
- CORS để kết nối API-MVC
- Validation ở cả API và MVC

### 9.2. Bài tập về nhà

**Bài 1: Hoàn thiện BooksController (MVC)**
- Tạo đầy đủ CRUD cho Books
- Dropdown chọn Category khi thêm/sửa
- Hiển thị/ẩn nút xóa theo role

**Bài 2: Thêm chức năng tìm kiếm**
- Tìm sách theo tên
- Lọc theo thể loại
- Sắp xếp theo giá

**Bài 3: Thêm chức năng quản lý Users (chỉ Admin)**
- Xem danh sách users
- Phân quyền cho user
- Khóa/mở khóa user

**Bài 4: Thêm Dashboard**
- Thống kê số lượng sách
- Thống kê theo thể loại
- Biểu đồ (Chart.js)

### 9.3. Câu hỏi ôn tập

1. Phân biệt Authentication và Authorization?
2. Vì sao cần DTO thay vì trả trực tiếp Entity?
3. JWT Token lưu ở đâu trong MVC?
4. Làm sao để ẩn nút "Xóa" với Librarian?
5. Nếu muốn thêm role "Manager", cần làm gì?
6. Session timeout là gì? Cấu hình ở đâu?
7. CORS là gì? Tại sao cần cấu hình?
8. BaseController có lợi ích gì?

### 9.4. Lỗi thường gặp và cách xử lý

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|------------|
| 401 Unauthorized | Chưa đăng nhập hoặc token hết hạn | Redirect về Login |
| 403 Forbidden | Không đủ quyền | Hiển thị Access Denied |
| CORS error | API chưa cấu hình CORS | Thêm `UseCors()` |
| Session null | Chưa bật `UseSession()` | Kiểm tra Program.cs |
| Deserialize null | JSON không khớp DTO | Thêm `PropertyNameCaseInsensitive` |

---

## 🎯 KẾT LUẬN

Bài thực hành này đã hướng dẫn chi tiết cách xây dựng một hệ thống hoàn chỉnh với:

1. ✅ **Phân quyền rõ ràng** từ đầu (Permission Matrix)
2. ✅ **Backend API** với JWT + Role-based Authorization
3. ✅ **Frontend MVC** với Razor Views và Session
4. ✅ **CRUD đầy đủ** với phân quyền động theo Role
5. ✅ **Best practices** trong thiết kế và code

**Điểm mạnh của bài thực hành**:
- Mô tả bài toán chi tiết, rõ ràng
- Liệt kê đầy đủ roles và permissions
- Giải thích từng bước với ví dụ thực tế
- Code đầy đủ, có thể chạy ngay
- Có test cases cụ thể

**Kỹ năng đạt được**:
- Phân tích yêu cầu và thiết kế phân quyền
- Xây dựng API với ASP.NET Core
- Tích hợp JWT Authentication
- Xây dựng MVC với Razor
- Xử lý Session và CORS
- Testing và debugging

---

**📚 TÀI LIỆU THAM KHẢO**:
- [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [JWT Authentication](https://jwt.io/)
- [ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/overview)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

**🎓 CHÚC CÁC BẠN HỌC TỐT!**
