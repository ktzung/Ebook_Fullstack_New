# 🧪 CHIẾN LƯỢC TESTING DNU SHOP

## 🎯 1. Tổng quan

Testing đảm bảo chất lượng code và giảm thiểu bugs trong production.

### 1.1. Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  ← Ít nhất, chậm nhất
        │  (Cypress)  │
        └─────────────┘
       ┌───────────────┐
       │ Integration   │  ← Vừa phải
       │     Tests     │
       └───────────────┘
      ┌─────────────────┐
      │   Unit Tests    │  ← Nhiều nhất, nhanh nhất
      │  (xUnit/Vitest) │
      └─────────────────┘
```

---

## 🔬 2. Backend Testing

### 2.1. Unit Tests

**Mục đích:** Test từng function/method riêng lẻ

**Công cụ:** xUnit (C#)

**Ví dụ: Test ProductService**

```csharp
public class ProductServiceTests
{
    [Fact]
    public void CalculateTotalPrice_ShouldReturnCorrectTotal()
    {
        // Arrange
        var items = new List<OrderItem>
        {
            new OrderItem { Quantity = 2, UnitPrice = 100000 },
            new OrderItem { Quantity = 1, UnitPrice = 200000 }
        };
        
        // Act
        var total = ProductService.CalculateTotal(items);
        
        // Assert
        Assert.Equal(400000, total);
    }
    
    [Fact]
    public void ValidateProduct_ShouldReturnFalse_WhenPriceIsNegative()
    {
        // Arrange
        var product = new Product { Name = "Test", Price = -1000 };
        
        // Act
        var isValid = ProductService.Validate(product);
        
        // Assert
        Assert.False(isValid);
    }
}
```

**Coverage:**
- ✅ Business logic
- ✅ Validation
- ✅ Calculations
- ✅ Data transformations

### 2.2. Integration Tests

**Mục đích:** Test tương tác giữa các components (Controller + Service + Database)

**Công cụ:** xUnit + Test Database

**Ví dụ: Test ProductsController**

```csharp
public class ProductsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly ApplicationDbContext _context;
    
    public ProductsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
        _context = factory.Services.GetRequiredService<ApplicationDbContext>();
    }
    
    [Fact]
    public async Task GetProducts_ShouldReturnList()
    {
        // Arrange
        var product = new Product 
        { 
            Name = "Test Product", 
            Price = 100000,
            CategoryId = 1
        };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        // Act
        var response = await _client.GetAsync("/api/products");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>();
        Assert.NotEmpty(products);
    }
}
```

**Coverage:**
- ✅ API endpoints
- ✅ Database operations
- ✅ Authentication/Authorization
- ✅ Error handling

---

## 🎨 3. Frontend Testing

### 3.1. Unit Tests

**Mục đích:** Test components và functions

**Công cụ:** Vitest + Vue Test Utils

**Ví dụ: Test ProductCard Component**

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'

describe('ProductCard', () => {
  it('should display product name', () => {
    const product = {
      id: 1,
      name: 'iPhone 15',
      price: 20000000
    }
    
    const wrapper = mount(ProductCard, {
      props: { product }
    })
    
    expect(wrapper.text()).toContain('iPhone 15')
  })
  
  it('should emit buy event when button clicked', async () => {
    const product = { id: 1, name: 'iPhone 15', price: 20000000 }
    const wrapper = mount(ProductCard, {
      props: { product }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('buy')).toBeTruthy()
    expect(wrapper.emitted('buy')[0]).toEqual([product])
  })
})
```

**Coverage:**
- ✅ Component rendering
- ✅ Props và Emits
- ✅ User interactions
- ✅ Computed properties

### 3.2. Integration Tests

**Mục đích:** Test tương tác giữa components và services

**Ví dụ: Test ProductPage với API**

```javascript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductPage from '@/views/ProductPage.vue'
import productService from '@/services/productService'

vi.mock('@/services/productService')

describe('ProductPage Integration', () => {
  it('should load products on mount', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 100000 },
      { id: 2, name: 'Product 2', price: 200000 }
    ]
    
    productService.getAll.mockResolvedValue(mockProducts)
    
    const wrapper = mount(ProductPage)
    
    await wrapper.vm.$nextTick()
    
    expect(productService.getAll).toHaveBeenCalled()
    expect(wrapper.vm.products).toEqual(mockProducts)
  })
})
```

### 3.3. E2E Tests

**Mục đích:** Test toàn bộ flow từ đầu đến cuối

**Công cụ:** Cypress hoặc Playwright

**Ví dụ: Test mua hàng**

```javascript
describe('E2E: Purchase Flow', () => {
  it('should complete purchase flow', () => {
    // 1. Vào trang chủ
    cy.visit('/')
    
    // 2. Tìm kiếm sản phẩm
    cy.get('[data-cy=search-input]').type('iPhone')
    cy.get('[data-cy=search-button]').click()
    
    // 3. Click vào sản phẩm
    cy.get('[data-cy=product-card]').first().click()
    
    // 4. Thêm vào giỏ hàng
    cy.get('[data-cy=add-to-cart]').click()
    
    // 5. Vào giỏ hàng
    cy.get('[data-cy=cart-icon]').click()
    
    // 6. Điền thông tin
    cy.get('[data-cy=shipping-name]').type('Nguyễn Văn A')
    cy.get('[data-cy=shipping-phone]').type('0123456789')
    cy.get('[data-cy=shipping-address]').type('123 Đường ABC')
    
    // 7. Đặt hàng
    cy.get('[data-cy=checkout-button]').click()
    
    // 8. Kiểm tra thông báo thành công
    cy.contains('Đặt hàng thành công').should('be.visible')
  })
})
```

---

## 📋 4. Test Cases

### 4.1. Products API

#### Test Case 1: GET /api/products
- ✅ Trả về danh sách sản phẩm
- ✅ Phân trang đúng
- ✅ Lọc theo category
- ✅ Tìm kiếm theo tên
- ✅ Sắp xếp theo giá

#### Test Case 2: POST /api/products
- ✅ Tạo sản phẩm thành công
- ✅ Validation: Tên trống → 400
- ✅ Validation: Giá < 0 → 400
- ✅ Chỉ Admin mới tạo được → 403
- ✅ Upload ảnh thành công

#### Test Case 3: PUT /api/products/{id}
- ✅ Cập nhật thành công
- ✅ Không tìm thấy → 404
- ✅ Chỉ Admin mới sửa được → 403

#### Test Case 4: DELETE /api/products/{id}
- ✅ Soft delete thành công
- ✅ Chỉ Admin mới xóa được → 403

### 4.2. Orders API

#### Test Case 1: POST /api/orders
- ✅ Tạo đơn hàng thành công
- ✅ Validation: Thông tin giao hàng trống → 400
- ✅ Validation: Giỏ hàng trống → 400
- ✅ Tính tổng tiền đúng
- ✅ Giảm stock sau khi đặt hàng

#### Test Case 2: PUT /api/orders/{id}/status
- ✅ Cập nhật trạng thái thành công
- ✅ Chỉ Admin mới cập nhật được → 403
- ✅ Không thể quay lại trạng thái cũ → 400

### 4.3. Auth API

#### Test Case 1: POST /api/auth/register
- ✅ Đăng ký thành công
- ✅ Email đã tồn tại → 400
- ✅ Password không khớp → 400
- ✅ Validation: Email không hợp lệ → 400

#### Test Case 2: POST /api/auth/login
- ✅ Đăng nhập thành công
- ✅ Email sai → 401
- ✅ Password sai → 401
- ✅ Trả về JWT token

---

## 🚀 5. Test Automation

### 5.1. CI/CD Integration

**GitHub Actions:**

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0'
      - name: Run tests
        run: dotnet test
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

### 5.2. Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test && npm run lint"
    }
  }
}
```

---

## 📊 6. Test Coverage

### 6.1. Coverage Goals

- **Backend:** >= 80%
- **Frontend:** >= 70%
- **Critical Paths:** 100%

### 6.2. Coverage Reports

```bash
# Backend
dotnet test --collect:"XPlat Code Coverage"

# Frontend
npm test -- --coverage
```

---

## 🎯 7. Best Practices

### 7.1. Test Naming

```csharp
// ✅ Good
[Fact]
public void CalculateTotal_ShouldReturn400000_WhenTwoItems()

// ❌ Bad
[Fact]
public void Test1()
```

### 7.2. AAA Pattern

```csharp
[Fact]
public void Example()
{
    // Arrange - Setup
    var product = new Product { Price = 100000 };
    
    // Act - Execute
    var result = productService.CalculateDiscount(product);
    
    // Assert - Verify
    Assert.Equal(10000, result);
}
```

### 7.3. Test Isolation

- Mỗi test độc lập
- Không phụ thuộc vào test khác
- Cleanup sau mỗi test

---

## 📝 8. Kết luận

Chiến lược testing:
- ✅ Unit Tests cho business logic
- ✅ Integration Tests cho API
- ✅ E2E Tests cho critical flows
- ✅ Automated trong CI/CD
- ✅ Coverage >= 70-80%

