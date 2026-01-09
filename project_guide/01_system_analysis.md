# 🔍 PHÂN TÍCH HỆ THỐNG DNU SHOP

## 🎯 1. Tổng quan dự án

### 1.1. Mục đích

**DNU Shop** là hệ thống thương mại điện tử (E-commerce) được xây dựng để:
- Phục vụ nhu cầu mua sắm trực tuyến của khách hàng
- Quản lý kho hàng và đơn hàng cho admin
- Thống kê doanh thu và bán hàng
- Học tập và thực hành kỹ năng Full-stack Development

### 1.2. Phạm vi dự án

**Trong phạm vi:**
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng và phân quyền
- ✅ Giỏ hàng và checkout
- ✅ Dashboard thống kê
- ✅ Upload ảnh sản phẩm

**Ngoài phạm vi (có thể mở rộng sau):**
- ❌ Thanh toán trực tuyến (Payment Gateway)
- ❌ Gửi email xác nhận
- ❌ Đánh giá sản phẩm
- ❌ Mã giảm giá (Coupon)
- ❌ Quản lý kho hàng nâng cao (Inventory Management)

### 1.3. Đối tượng sử dụng

**1. Khách hàng (Customer/User)**
- Xem danh sách sản phẩm
- Tìm kiếm và lọc sản phẩm
- Xem chi tiết sản phẩm
- Thêm vào giỏ hàng
- Đặt hàng

**2. Quản trị viên (Admin)**
- Đăng nhập vào hệ thống
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý đơn hàng (xem, cập nhật trạng thái)
- Xem dashboard thống kê
- Upload ảnh sản phẩm

---

## 🏗️ 2. Phân tích chức năng (Functional Analysis)

### 2.1. Phân hệ Khách hàng (Storefront)

#### 2.1.1. Xem danh sách sản phẩm

**Mô tả:**
- Hiển thị danh sách sản phẩm dạng lưới (grid)
- Mỗi sản phẩm hiển thị: ảnh, tên, giá
- Phân trang: 10 sản phẩm/trang
- Sắp xếp: Mặc định, Giá tăng dần, Giá giảm dần, Mới nhất

**Input:**
- Trang hiện tại (page)
- Số sản phẩm/trang (pageSize = 10)
- Tiêu chí sắp xếp (sortBy)

**Output:**
- Danh sách sản phẩm
- Tổng số sản phẩm
- Tổng số trang

**Business Rules:**
- Chỉ hiển thị sản phẩm còn hàng (Stock > 0)
- Chỉ hiển thị sản phẩm chưa bị xóa (IsDeleted = false)

#### 2.1.2. Tìm kiếm sản phẩm

**Mô tả:**
- Tìm kiếm theo tên sản phẩm
- Tìm kiếm real-time (khi user gõ)
- Hiển thị kết quả ngay lập tức

**Input:**
- Từ khóa tìm kiếm (keyword)

**Output:**
- Danh sách sản phẩm khớp với từ khóa

**Business Rules:**
- Tìm kiếm không phân biệt hoa thường
- Tìm kiếm trong tên sản phẩm và mô tả
- Nếu không có kết quả, hiển thị "Không tìm thấy sản phẩm"

#### 2.1.3. Lọc sản phẩm

**Mô tả:**
- Lọc theo danh mục (Category)
- Lọc theo khoảng giá (Min Price - Max Price)
- Có thể kết hợp nhiều bộ lọc

**Input:**
- CategoryId (optional)
- MinPrice (optional)
- MaxPrice (optional)

**Output:**
- Danh sách sản phẩm sau khi lọc

**Business Rules:**
- Nếu không chọn bộ lọc nào → Hiển thị tất cả
- MinPrice phải < MaxPrice
- Giá phải >= 0

#### 2.1.4. Xem chi tiết sản phẩm

**Mô tả:**
- Hiển thị ảnh lớn của sản phẩm
- Hiển thị tên, mô tả, giá
- Hiển thị số lượng tồn kho
- Nút "Thêm vào giỏ hàng"

**Input:**
- ProductId

**Output:**
- Thông tin chi tiết sản phẩm

**Business Rules:**
- Nếu sản phẩm không tồn tại → 404 Not Found
- Nếu hết hàng → Disable nút "Thêm vào giỏ"

#### 2.1.5. Giỏ hàng (Shopping Cart)

**Mô tả:**
- Thêm sản phẩm vào giỏ hàng
- Xem danh sách sản phẩm trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ
- Tính tổng tiền tự động

**Input:**
- ProductId
- Quantity

**Output:**
- Danh sách sản phẩm trong giỏ
- Tổng tiền

**Business Rules:**
- Số lượng phải > 0
- Số lượng không được vượt quá tồn kho
- Giỏ hàng lưu trong localStorage (chưa đăng nhập) hoặc database (đã đăng nhập)

#### 2.1.6. Đặt hàng (Checkout)

**Mô tả:**
- Nhập thông tin giao hàng: Tên, SĐT, Địa chỉ
- Xác nhận đơn hàng
- Lưu đơn hàng vào database

**Input:**
- Thông tin giao hàng
- Danh sách sản phẩm trong giỏ

**Output:**
- Mã đơn hàng (OrderId)
- Thông báo đặt hàng thành công

**Business Rules:**
- Tất cả thông tin là bắt buộc
- SĐT phải đúng format (10-11 số)
- Địa chỉ không được để trống
- Sau khi đặt hàng → Xóa giỏ hàng

---

### 2.2. Phân hệ Quản trị (Admin Portal)

#### 2.2.1. Đăng nhập

**Mô tả:**
- Chỉ Admin mới được đăng nhập
- Xác thực bằng Email và Password
- Nhận JWT token sau khi đăng nhập thành công

**Input:**
- Email
- Password

**Output:**
- JWT Token
- Thông tin user (Email, FullName, Role)

**Business Rules:**
- Email phải tồn tại trong hệ thống
- Password phải đúng
- User phải có role "Admin"
- Token có thời hạn 1 giờ

#### 2.2.2. Dashboard

**Mô tả:**
- Hiển thị tổng doanh thu tháng này
- Hiển thị số đơn hàng mới chưa duyệt
- Hiển thị Top 5 sản phẩm bán chạy
- Biểu đồ doanh thu theo tháng

**Input:**
- Tháng hiện tại
- Năm hiện tại

**Output:**
- Tổng doanh thu
- Số đơn hàng mới
- Top 5 sản phẩm
- Dữ liệu biểu đồ

**Business Rules:**
- Chỉ tính đơn hàng đã hoàn thành (Status = Completed)
- Đơn hàng mới = Status = New

#### 2.2.3. Quản lý Sản phẩm

**Mô tả:**
- Xem danh sách sản phẩm dạng bảng
- Thêm sản phẩm mới (có upload ảnh)
- Sửa thông tin sản phẩm
- Xóa sản phẩm (soft delete)

**Input:**
- Thông tin sản phẩm (Name, Price, Description, CategoryId, Stock)
- File ảnh (JPG, PNG, tối đa 5MB)

**Output:**
- Danh sách sản phẩm
- Thông báo thành công/thất bại

**Business Rules:**
- Tên sản phẩm không được trùng
- Giá phải >= 0
- Stock phải >= 0
- Ảnh phải là JPG/PNG, tối đa 5MB
- Xóa mềm (IsDeleted = true), không xóa thật

#### 2.2.4. Quản lý Đơn hàng

**Mô tả:**
- Xem danh sách tất cả đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái: Mới → Đang giao → Hoàn thành / Hủy

**Input:**
- OrderId
- Status mới

**Output:**
- Danh sách đơn hàng
- Thông báo cập nhật thành công

**Business Rules:**
- Chỉ có thể cập nhật trạng thái theo thứ tự:
  - New → Shipping → Completed
  - New → Cancelled
- Không thể quay lại trạng thái cũ
- Đơn hàng đã Completed hoặc Cancelled không thể thay đổi

---

## 🔒 3. Phân tích phi chức năng (Non-Functional Analysis)

### 3.1. Hiệu năng (Performance)

**Yêu cầu:**
- Tải trang dưới 2 giây
- API response time < 500ms
- Hỗ trợ 100 concurrent users

**Giải pháp:**
- Code splitting, lazy loading
- Database indexing
- Caching static assets
- Pagination cho danh sách lớn

### 3.2. Bảo mật (Security)

**Yêu cầu:**
- Password phải được hash (bcrypt)
- API phải có JWT authentication
- Chỉ Admin mới vào được Admin Portal
- XSS và SQL Injection protection

**Giải pháp:**
- ASP.NET Core Identity (password hashing)
- JWT token authentication
- Role-based authorization
- Input validation và sanitization

### 3.3. Khả năng mở rộng (Scalability)

**Yêu cầu:**
- Có thể mở rộng thêm tính năng
- Code dễ maintain

**Giải pháp:**
- Clean Architecture
- Separation of Concerns
- DTO pattern
- Service pattern

### 3.4. Giao diện (UI/UX)

**Yêu cầu:**
- Responsive (hoạt động tốt trên mobile)
- Giao diện đẹp, dễ sử dụng
- Loading states và error handling

**Giải pháp:**
- Vuetify (Material Design)
- Responsive breakpoints
- Loading spinners
- Error messages rõ ràng

---

## 📊 4. Use Cases

### 4.1. Use Case: Khách hàng mua sản phẩm

**Actor:** Khách hàng

**Preconditions:**
- Khách hàng đang ở trang chủ
- Có sản phẩm trong hệ thống

**Main Flow:**
1. Khách hàng xem danh sách sản phẩm
2. Khách hàng tìm kiếm hoặc lọc sản phẩm
3. Khách hàng click vào sản phẩm để xem chi tiết
4. Khách hàng click "Thêm vào giỏ hàng"
5. Khách hàng xem giỏ hàng
6. Khách hàng click "Đặt hàng"
7. Khách hàng nhập thông tin giao hàng
8. Khách hàng xác nhận đặt hàng
9. Hệ thống lưu đơn hàng và hiển thị mã đơn hàng

**Postconditions:**
- Đơn hàng được tạo thành công
- Giỏ hàng được xóa

**Alternative Flows:**
- 4a. Sản phẩm hết hàng → Hiển thị thông báo "Hết hàng"
- 6a. Giỏ hàng trống → Hiển thị thông báo "Giỏ hàng trống"
- 7a. Thông tin không hợp lệ → Hiển thị lỗi validation

### 4.2. Use Case: Admin quản lý sản phẩm

**Actor:** Admin

**Preconditions:**
- Admin đã đăng nhập

**Main Flow:**
1. Admin vào trang "Quản lý Sản phẩm"
2. Admin xem danh sách sản phẩm
3. Admin click "Thêm mới"
4. Admin nhập thông tin sản phẩm và chọn ảnh
5. Admin click "Lưu"
6. Hệ thống validate và lưu sản phẩm
7. Hệ thống hiển thị thông báo thành công

**Postconditions:**
- Sản phẩm mới được thêm vào database
- Ảnh được upload lên server

**Alternative Flows:**
- 4a. Ảnh quá lớn → Hiển thị lỗi "File quá lớn"
- 4b. Ảnh không đúng format → Hiển thị lỗi "Chỉ chấp nhận JPG/PNG"
- 6a. Validation lỗi → Hiển thị lỗi validation

---

## 🎯 5. Kết luận

Dự án **DNU Shop** là một hệ thống E-commerce hoàn chỉnh với đầy đủ các tính năng cơ bản:
- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Phân quyền Admin/User
- ✅ Dashboard thống kê

Hệ thống được thiết kế để:
- Dễ học và thực hành
- Có thể mở rộng thêm tính năng
- Tuân theo best practices
- Sẵn sàng cho production

