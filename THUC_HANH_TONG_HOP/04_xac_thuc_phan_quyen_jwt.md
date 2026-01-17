# 🟦 BÀI 04: XÁC THỰC JWT + PHÂN QUYỀN

## 🎯 Mục tiêu
- Cấu hình JWT Authentication.
- Tạo roles và phân quyền API.

---

## 1) Cấu hình JWT
Trong `Program.cs`:
- AddIdentity
- AddAuthentication(JwtBearer)
- AddAuthorization

## 2) Tạo Roles
Seed các role: `Admin`, `Librarian`, `Reader`.

## 3) Tạo AuthController
Endpoint:
- `POST /api/Auth/register`
- `POST /api/Auth/login`

---

## ✅ Checkpoint
- [ ] Đăng ký user thành công.
- [ ] Đăng nhập trả về JWT.
- [ ] Role được gán đúng.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: Cấu hình JWT trong `appsettings.json`
```json
{
  "Jwt": {
    "Key": "This_Is_My_Super_Secret_Key_For_JWT_Token_Min_32_Characters!",
    "Issuer": "https://localhost:5001",
    "Audience": "https://localhost:5001",
    "ExpirationHours": 3
  }
}
```

### Step 2: Cấu hình Identity + JWT trong `Program.cs`
```csharp
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();
```

### Step 3: Seed Roles
```csharp
private void SeedRoles(ModelBuilder builder)
{
    builder.Entity<IdentityRole>().HasData(
        new IdentityRole { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
        new IdentityRole { Id = "2", Name = "Librarian", NormalizedName = "LIBRARIAN" },
        new IdentityRole { Id = "3", Name = "Reader", NormalizedName = "READER" }
    );
}
```

### Step 4: AuthController (Register/Login)
```csharp
[HttpPost("register")]
public async Task<IActionResult> Register(RegisterDto model)
{
    var userExists = await _userManager.FindByNameAsync(model.Username);
    if (userExists != null) return BadRequest("User đã tồn tại");

    IdentityUser user = new() { UserName = model.Username, Email = model.Email };
    var result = await _userManager.CreateAsync(user, model.Password);
    if (!result.Succeeded) return BadRequest(result.Errors);

    await _userManager.AddToRoleAsync(user, model.Role ?? "Reader");
    return Ok("Đăng ký thành công");
}

[HttpPost("login")]
public async Task<IActionResult> Login(LoginDto model)
{
    var user = await _userManager.FindByNameAsync(model.Username);
    if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
        return Unauthorized("Sai tài khoản hoặc mật khẩu");

    var roles = await _userManager.GetRolesAsync(user);
    var token = CreateToken(user, roles);
    return Ok(new { token, username = user.UserName, roles });
}
```

### Step 5: Cấu hình password rules (dễ seed cho demo)
```csharp
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();
```
