# 🟦 BÀI 05: CRUD CATEGORIES + BOOKS (PHÂN QUYỀN)

## 🎯 Mục tiêu
- Xây CRUD cho Categories và Books.
- Áp dụng phân quyền theo role.

---

## 1) CategoriesController
- `GET` public
- `POST/PUT/DELETE` chỉ Admin

## 2) BooksController
- `GET` public (Guest chỉ sách công khai)
- `POST/PUT` Admin hoặc Librarian
- `DELETE` chỉ Admin

---

## ✅ Checkpoint
- [ ] CRUD Categories hoạt động đúng quyền.
- [ ] CRUD Books hoạt động đúng quyền.

---

## 🧭 Step-by-step chi tiết (kèm code)

### Step 1: Tạo DTOs
`DTOs/CategoryDto.cs`
```csharp
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CategoryCreateDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
```

`DTOs/BookDto.cs`
```csharp
public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsPublic { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}

public class BookCreateDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    [Required]
    public int CategoryId { get; set; }
    public bool IsPublic { get; set; } = true;
}
```

### Step 2: AutoMapper
`Helpers/AutoMapperProfile.cs`
```csharp
public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Category, CategoryDto>();
        CreateMap<CategoryCreateDto, Category>();

        CreateMap<Book, BookDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name));
        CreateMap<BookCreateDto, Book>();
    }
}
```

### Step 3: CategoriesController
```csharp
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CategoriesController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.Categories.ToListAsync();
        return Ok(_mapper.Map<List<CategoryDto>>(data));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CategoryCreateDto dto)
    {
        var entity = _mapper.Map<Category>(dto);
        _context.Categories.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(_mapper.Map<CategoryDto>(entity));
    }
}
```

### Step 4: BooksController (phân quyền)
```csharp
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public BooksController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        IQueryable<Book> query = _context.Books.Include(b => b.Category);
        if (!User.Identity!.IsAuthenticated)
            query = query.Where(b => b.IsPublic);
        var data = await query.ToListAsync();
        return Ok(_mapper.Map<List<BookDto>>(data));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<IActionResult> Create(BookCreateDto dto)
    {
        var entity = _mapper.Map<Book>(dto);
        _context.Books.Add(entity);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Books.FindAsync(id);
        if (entity == null) return NotFound();
        _context.Books.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
```

### Step 5: Seed dữ liệu mẫu theo role (tóm tắt)
```csharp
// Admin: admin / Admin123!
// Librarian: librarian1 / Lib123!
// Reader: reader1 / Reader123!
```

### Step 6: Kiểm thử nhanh với Postman
- GET `/api/Categories` → public
- POST `/api/Categories` → chỉ Admin
- POST `/api/Books` → Admin/Librarian
- DELETE `/api/Books/{id}` → chỉ Admin
