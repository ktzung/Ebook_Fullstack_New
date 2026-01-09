# 📋 YÊU CẦU DỰ ÁN DNU SHOP

## 🎯 1. Tổng quan

### 1.1. Mục đích dự án

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

## 2. Phân hệ Khách hàng (Storefront)
- **Xem danh sách sản phẩm**: Hiển thị dạng lưới, có phân trang (10 SP/trang).
- **Tìm kiếm**: Theo tên sản phẩm.
- **Lọc**: Theo danh mục, theo khoảng giá.
- **Chi tiết sản phẩm**: Xem ảnh lớn, mô tả, giá, số lượng tồn kho.
- **Giỏ hàng**: Thêm/Sửa/Xóa sản phẩm, tính tổng tiền tự động.
- **Đặt hàng**: Nhập thông tin giao hàng (Tên, SĐT, Địa chỉ) -> Lưu đơn hàng.

## 3. Phân hệ Quản trị (Admin Portal)
- **Đăng nhập**: Chỉ Admin mới được vào.
- **Dashboard**:
    - Tổng doanh thu tháng này.
    - Số đơn hàng mới chưa duyệt.
    - Top 5 sản phẩm bán chạy.
- **Quản lý Sản phẩm**:
    - Xem danh sách (Table).
    - Thêm mới (Upload ảnh).
    - Sửa thông tin.
    - Xóa (Soft delete - chỉ ẩn đi).
- **Quản lý Đơn hàng**:
    - Xem danh sách đơn hàng.
    - Cập nhật trạng thái: Mới -> Đang giao -> Hoàn thành / Hủy.

## 4. Yêu cầu Phi chức năng
- **Giao diện**: Responsive (dùng tốt trên điện thoại).
- **Bảo mật**: Password phải được mã hóa (Hash). API phải có Token.
- **Hiệu năng**: Tải trang dưới 2 giây.
