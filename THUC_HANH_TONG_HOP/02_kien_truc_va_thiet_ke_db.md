# 🟦 BÀI 02: KIẾN TRÚC TỔNG THỂ + THIẾT KẾ CSDL

## 🎯 Mục tiêu
- Hiểu kiến trúc 3 tầng: Vue SPA → API → DB.
- Thiết kế bảng dữ liệu và quan hệ.

---

## 1) Kiến trúc hệ thống
```
Vue SPA (Vuetify)
   ⇅ JWT HTTP
ASP.NET Core API
   ⇅ EF Core
SQL Server
```

---

## 2) Thiết kế CSDL
### Bảng `Categories`
- `Id` (PK)
- `Name`
- `Description`

### Bảng `Books`
- `Id` (PK)
- `Title`
- `Author`
- `ISBN`
- `PublishedYear`
- `Price`
- `CategoryId` (FK)
- `IsPublic`
- `CreatedAt`

### Bảng Identity (ASP.NET Core Identity)
- `AspNetUsers`, `AspNetRoles`, `AspNetUserRoles`

---

## 3) Checkpoint
- [ ] Vẽ được sơ đồ quan hệ giữa `Books` và `Categories`.
- [ ] Hiểu ý nghĩa `IsPublic` cho Guest.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: Vẽ sơ đồ quan hệ (ERD đơn giản)
```
Categories (1) ────── (N) Books
```

### Step 2: Viết SQL tạo bảng (tham khảo)
```sql
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500)
);

CREATE TABLE Books (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200) NOT NULL,
    Author NVARCHAR(100),
    ISBN NVARCHAR(20),
    PublishedYear INT,
    Price DECIMAL(18,2),
    CategoryId INT NOT NULL,
    IsPublic BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);
```

### Step 3: Tạo Entity trong C#
`Models/Category.cs`
```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Book> Books { get; set; } = new List<Book>();
}
```

`Models/Book.cs`
```csharp
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Author { get; set; }
    public string? ISBN { get; set; }
    public int? PublishedYear { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public bool IsPublic { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public Category Category { get; set; } = null!;
}
```

### Step 4: DbContext
`Data/ApplicationDbContext.cs`
```csharp
public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Book> Books { get; set; }
    public DbSet<Category> Categories { get; set; }
}
```

### Step 5: Seed dữ liệu mẫu (tuỳ chọn)
```csharp
builder.Entity<Category>().HasData(
    new Category { Id = 1, Name = "Công nghệ thông tin" },
    new Category { Id = 2, Name = "Kinh tế" }
);
```
