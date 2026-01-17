# 🟦 BÀI 03: KHỞI TẠO BACKEND API

## 🎯 Mục tiêu
- Tạo project API và cấu hình cơ bản.
- Kết nối SQL Server, tạo Migration.

---

## 1) Tạo project
```bash
mkdir LibraryManagement
cd LibraryManagement
dotnet new sln -n LibraryManagement
dotnet new webapi -n LibraryManagement.API
dotnet sln add LibraryManagement.API/LibraryManagement.API.csproj
```

## 2) Cài package
```bash
cd LibraryManagement.API
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

## 3) Cấu hình ConnectionStrings
`appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LibraryDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

## 4) Migration
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## ✅ Checkpoint
- [ ] API chạy được.
- [ ] Database tạo thành công.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: Tạo Solution + API
```bash
mkdir LibraryManagement
cd LibraryManagement
dotnet new sln -n LibraryManagement
dotnet new webapi -n LibraryManagement.API
dotnet sln add LibraryManagement.API/LibraryManagement.API.csproj
```

### Step 2: Cài các package bắt buộc
```bash
cd LibraryManagement.API
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

### Step 3: Cấu hình `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LibraryDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### Step 4: Tạo DbContext
`Data/ApplicationDbContext.cs`
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Book> Books { get; set; }
    public DbSet<Category> Categories { get; set; }
}
```

### Step 5: Cấu hình Program.cs (kết nối DB)
`Program.cs`
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
```

### Step 6: Migration & Update DB
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Step 7: Rollback / Reset DB (khi cần làm lại)
```bash
# Xoá migration cuối (chỉ khi chưa update)
dotnet ef migrations remove

# Rollback DB về migration trước
dotnet ef migrations list
dotnet ef database update InitialCreate

# Reset toàn bộ DB
dotnet ef database drop -f
dotnet ef migrations add InitialCreate
dotnet ef database update
```
