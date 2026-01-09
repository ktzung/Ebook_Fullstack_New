# 🟨 TUẦN 12: TESTING & OPTIMIZATION

## 🎯 Mục tiêu
- Viết Unit Test cơ bản cho Backend.
- Tối ưu hiệu năng Frontend (Lazy Loading).

---

## 🧪 1. Backend Unit Testing

### 🎬 Ví dụ dẫn nhập: Tại sao cần Testing?

Hãy tưởng tượng bạn đang xây dựng website bán hàng:

**Tình huống thực tế:**
- Website có 100+ tính năng
- Mỗi tính năng có nhiều edge cases
- Khi sửa 1 tính năng, có thể làm hỏng tính năng khác
- Không thể test thủ công tất cả mỗi lần deploy

**Vấn đề nếu không có test:**
```
❌ Sửa bug → Tạo bug mới
❌ Thêm tính năng → Làm hỏng tính năng cũ
❌ Deploy lên production → Lỗi, phải rollback
→ Mất thời gian, mất tiền, mất uy tín
```

**Giải pháp: Unit Testing**
- Viết test cho mỗi function quan trọng
- Chạy test tự động trước khi deploy
- Đảm bảo code luôn hoạt động đúng

### 🌐 Liên hệ thực tế

**Testing được dùng ở mọi công ty:**
- **Google, Facebook, Microsoft**: Có hàng nghìn unit tests
- **Shopee, Tiki**: Test tự động trước mỗi deploy
- **Banking App**: Test cực kỳ quan trọng (liên quan đến tiền)
- **E-commerce**: Test để đảm bảo tính toán đúng

**Tất cả đều cần Testing!**

Sử dụng **xUnit** (Project Test riêng).

### 1.1. Tạo Project Test
```powershell
dotnet new xunit -n DNU.Shop.Tests
dotnet add reference ../DNU.Shop.API
```

### 1.2. Viết Test Case
Test xem hàm tính tổng tiền có đúng không.

```csharp
[Fact]
public void CalculateTotal_ShouldReturnCorrectSum()
{
    // Arrange
    var order = new Order();
    order.Items.Add(new OrderItem { Price = 10, Quantity = 2 }); // 20
    order.Items.Add(new OrderItem { Price = 5, Quantity = 1 });  // 5

    // Act
    var total = order.CalculateTotal();

    // Assert
    Assert.Equal(25, total);
}
```

---

## ⚡ 2. Frontend Optimization

### 🎬 Ví dụ dẫn nhập: Vấn đề performance

Hãy tưởng tượng bạn đang xây dựng website bán hàng:

**Tình huống thực tế:**
- Website có 20+ trang (Home, Products, Cart, Checkout, Admin Dashboard, Admin Products, Admin Orders...)
- Nếu tải tất cả code ngay từ đầu → File JS rất lớn (5-10MB)
- User phải chờ 10-20 giây để tải → Trải nghiệm tệ
- User có thể không bao giờ vào Admin → Tải code Admin là lãng phí

**Vấn đề:**
```
❌ Tải tất cả code ngay từ đầu
❌ File JS quá lớn (5-10MB)
❌ User phải chờ lâu
❌ Tải code không cần thiết
```

**Giải pháp: Code Splitting & Lazy Loading**
- Chỉ tải code khi cần
- Chia nhỏ code thành nhiều file
- Tải song song nhiều file nhỏ → Nhanh hơn

### 2.1. Lazy Loading Routes
Thay vì tải toàn bộ trang Admin khi người dùng mới vào trang chủ, ta chỉ tải khi họ thực sự bấm vào link Admin.

### 🌐 Liên hệ thực tế

**Optimization được dùng ở mọi website:**
- **Facebook, YouTube**: Lazy load components, code splitting
- **Shopee, Tiki**: Chỉ tải code khi user vào trang đó
- **Banking App**: Tối ưu để load nhanh (quan trọng với mobile)
- **E-commerce**: Tối ưu để giảm bounce rate

**Tất cả đều cần Optimization!**

Trong `router/index.js`:
```javascript
// Thay vì import trực tiếp ở đầu file
// import Dashboard from '@/views/admin/Dashboard.vue'

// Hãy dùng dynamic import
component: () => import('@/views/admin/Dashboard.vue')
```

### 2.2. Phân tích Bundle
Khi chạy `npm run build`, Vite sẽ báo kích thước từng file. Nếu file `index.js` quá lớn (>500KB), cần xem xét tách nhỏ code.

---

## 🧪 3. Thực hành

1. Viết 3 Unit Test cho logic nghiệp vụ (VD: Không được đặt hàng số lượng âm).
2. Kiểm tra lại Router xem đã dùng Lazy Loading chưa.
3. Chạy `npm run build` để xem kết quả tối ưu.

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Test fail không rõ lý do
**❌ Vấn đề:** Test fail nhưng không biết tại sao  
**✅ Giải pháp:** Dùng descriptive assertions, log intermediate values.

### Lỗi 2: Bundle size quá lớn
**❌ Vấn đề:** File JS > 1MB  
**✅ Giải pháp:** Lazy load routes, tree shaking, code splitting.

### Lỗi 3: Test chạy chậm
**❌ Vấn đề:** Test mất nhiều thời gian  
**✅ Giải pháp:** Mock dependencies, dùng in-memory database.

---

## 💡 5. Best Practices

- Write tests cho business logic quan trọng
- Aim for >70% code coverage
- Test edge cases và error scenarios
- Use mocking cho external dependencies
- Optimize bundle với code splitting

---

## 📝 6. Bài tập thực hành

1. Viết tests cho ProductService
2. Test authentication flow
3. Test form validation
4. Analyze bundle với webpack-bundle-analyzer
5. Implement code splitting

---

## 🧪 7. Mini Test

### Câu 1: AAA Pattern là gì?
<details>
<summary>Xem đáp án</summary>
Arrange (setup), Act (execute), Assert (verify).
</details>

### Câu 2: Lazy loading giúp gì?
<details>
<summary>Xem đáp án</summary>
Giảm bundle size ban đầu, tải code khi cần.
</details>

---

## 📌 8. Quick Notes

### Unit Test Pattern
```csharp
[Fact]
public void TestMethod() {
    // Arrange
    var input = 5;
    // Act
    var result = Calculate(input);
    // Assert
    Assert.Equal(10, result);
}
```

### Lazy Loading
```javascript
component: () => import('@/views/AdminPage.vue')
```