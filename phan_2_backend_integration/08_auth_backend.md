# 🟩 TUẦN 8: AUTHENTICATION (BACKEND)

## 🎯 Mục tiêu
- Cài đặt ASP.NET Core Identity.
- Viết API Login sinh JWT Token.
- Viết API Register tạo User mới.

---

## 🔐 1. Identity Setup

### 🎬 Ví dụ dẫn nhập: Hệ thống đăng nhập

Hãy tưởng tượng bạn đang xây dựng website bán hàng như **Shopee**:

**Tình huống thực tế:**
- User cần đăng ký tài khoản để mua hàng
- User cần đăng nhập để xem đơn hàng, cập nhật thông tin
- Admin cần đăng nhập để quản lý sản phẩm
- Cần phân quyền: User thường vs Admin

**Vấn đề nếu tự code:**
- Phải tự hash password (bcrypt, argon2)
- Phải tự quản lý session/token
- Phải tự xử lý forgot password, email confirmation
- Dễ có lỗ hổng bảo mật

**Giải pháp: ASP.NET Core Identity**
- Microsoft đã code sẵn tất cả
- Đã được test kỹ, an toàn
- Hỗ trợ đầy đủ: Login, Register, Forgot Password, Email Confirmation, 2FA

**ASP.NET Core Identity** là thư viện quản lý User, Role, Login, Password Hashing chuẩn của Microsoft.

### 🌐 Liên hệ thực tế

**Identity được dùng ở mọi website:**
- **Facebook, Gmail, Twitter**: Tất cả đều có hệ thống đăng nhập/đăng ký
- **Shopee, Tiki**: User đăng ký để mua hàng
- **Banking App**: Đăng nhập với OTP, 2FA
- **Admin Panel**: Phân quyền Admin/User

**Tất cả đều cần Identity Management!**

### 1.1. Cài đặt Package
```powershell
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

### 1.2. Kế thừa IdentityDbContext
Sửa `ApplicationDbContext`:
```csharp
public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions options) : base(options) { }
    
    public DbSet<Product> Products { get; set; }
}
```

### 1.3. Đăng ký Service (`Program.cs`)
```csharp
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
```

---

## 🔑 2. JWT Generation

Xem lại kiến thức ở Ebook Backend (Chương 10). Ở đây ta áp dụng vào dự án.

### 2.1. AuthController
```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto model)
{
    // 1. Tìm user
    var user = await _userManager.FindByNameAsync(model.Username);
    
    // 2. Check password
    if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
    {
        // 3. Sinh Token
        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }
    
    return Unauthorized();
}

private string GenerateJwtToken(IdentityUser user)
{
    // ... Code sinh token (Header, Payload, Signature)
    // Payload chứa: Sub (Id), Jti, Iat, ClaimTypes.Name
}
```

---

## 🧪 3. Thực hành

1. Chạy Migration để tạo các bảng Identity (`AspNetUsers`, `AspNetRoles`...).
2. Viết API `POST /api/auth/register` để tạo user mẫu.
3. Viết API `POST /api/auth/login`.
4. Test bằng Postman: Gửi user/pass -> Nhận về chuỗi Token `eyJ...`.

---

## 🎯 3. Case Study: Xây dựng Authentication System hoàn chỉnh

### Mô tả tình huống

Xây dựng hệ thống đăng nhập/đăng ký hoàn chỉnh, tương tự như **Shopee** hoặc **Facebook**.

### Yêu cầu

- Đăng ký tài khoản mới
- Đăng nhập và nhận JWT token
- Refresh token để gia hạn session
- Đăng xuất
- Lấy thông tin user hiện tại
- Validation đầy đủ

### Implementation

**1. Models (`Models/User.cs`):**
```csharp
public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsActive { get; set; }
}
```

**2. DTOs (`DTOs/AuthDto.cs`):**
```csharp
public class RegisterDto
{
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
    public string Password { get; set; }
    
    [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
    [Compare("Password", ErrorMessage = "Mật khẩu không khớp")]
    public string ConfirmPassword { get; set; }
    
    [Required(ErrorMessage = "Họ tên là bắt buộc")]
    public string FullName { get; set; }
}

public class LoginDto
{
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    public string Password { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public UserDto User { get; set; }
}

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
}
```

**3. Controller (`Controllers/AuthController.cs`):**
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        IMapper mapper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _mapper = mapper;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Kiểm tra email đã tồn tại
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Email đã được sử dụng" });
        }

        // Tạo user mới
        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            CreatedDate = DateTime.Now,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { 
                message = "Đăng ký thất bại",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        // Gán role mặc định
        await _userManager.AddToRoleAsync(user, "User");

        // Tạo token và đăng nhập luôn
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        
        // Lưu refresh token vào database (có thể tạo bảng RefreshTokens)
        
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

        return Ok(new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.Now.AddHours(1),
            User = userDto
        });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Tìm user
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
        }

        // Kiểm tra password
        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
        }

        // Kiểm tra user có active không
        if (!user.IsActive)
        {
            return Unauthorized(new { message = "Tài khoản đã bị khóa" });
        }

        // Tạo token
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

        return Ok(new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.Now.AddHours(1),
            User = userDto
        });
    }

    // GET: api/auth/me
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            return NotFound();
        }

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
        
        return Ok(userDto);
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        // Với JWT, logout chủ yếu ở client (xóa token)
        // Có thể thêm blacklist token nếu cần
        return Ok(new { message = "Đăng xuất thành công" });
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("fullName", user.FullName)
        };

        // Thêm roles vào claims
        var roles = _userManager.GetRolesAsync(user).Result;
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }
}
```

**4. Program.cs Configuration:**
```csharp
// JWT Configuration
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
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Identity Configuration
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();
```

**5. appsettings.json:**
```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "https://localhost:5001",
    "Audience": "https://localhost:5001"
  }
}
```

**Giải thích:**
- **Identity**: Quản lý user, password hashing tự động
- **JWT**: Token-based authentication, không cần session
- **Validation**: Kiểm tra input đầy đủ
- **Security**: Password requirements, email uniqueness
- **Roles**: Hỗ trợ phân quyền

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Quên hash password
**❌ Vấn đề:** Lưu password plain text  
**✅ Giải pháp:** Dùng `UserManager.CreateAsync()` tự động hash.

### Lỗi 2: Token không hợp lệ
**❌ Vấn đề:** Token bị reject  
**✅ Giải pháp:** Kiểm tra secret key, expiration, issuer.

### Lỗi 3: Migration lỗi
**❌ Vấn đề:** Identity tables không tạo  
**✅ Giải pháp:** Chạy `dotnet ef migrations add Identity` và `update-database`.

---

## 💡 5. Best Practices

- Luôn hash password (Identity tự động)
- Set token expiration hợp lý
- Refresh token cho long sessions
- Validate input trước khi tạo user
- Rate limiting cho login

---

## 📝 6. Bài tập thực hành

1. Thêm email confirmation
2. Thêm password reset
3. Thêm refresh token
4. Thêm lockout sau nhiều lần sai
5. Log security events

---

## 🧪 7. Mini Test

### Câu 1: JWT gồm những phần nào?
<details>
<summary>Xem đáp án</summary>
Header, Payload, Signature.
</details>

### Câu 2: Tại sao cần hash password?
<details>
<summary>Xem đáp án</summary>
Bảo mật - không lưu plain text.
</details>

---

## 📌 8. Quick Notes

### Identity Setup
```csharp
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
```

### JWT Config
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            // ...
        };
    });
```