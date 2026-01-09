# 📡 THIẾT KẾ API DNU SHOP

## 🎯 1. Tổng quan

API được thiết kế theo chuẩn **RESTful**, sử dụng JSON để trao đổi dữ liệu giữa Frontend và Backend.

### 1.1. Base URL

```
Development: http://localhost:5000/api
Production:  https://api.dnushop.com/api
```

### 1.2. Authentication

Tất cả API (trừ public endpoints) yêu cầu JWT Token trong header:

```
Authorization: Bearer {token}
```

---

## 📦 2. Products API

### 2.1. GET /api/products

**Mô tả:** Lấy danh sách sản phẩm (có phân trang, tìm kiếm, lọc)

**Quyền truy cập:** Public

**Query Parameters:**
- `page` (int, optional): Số trang (mặc định: 1)
- `pageSize` (int, optional): Số sản phẩm/trang (mặc định: 10)
- `search` (string, optional): Từ khóa tìm kiếm
- `categoryId` (int, optional): Lọc theo danh mục
- `minPrice` (decimal, optional): Giá tối thiểu
- `maxPrice` (decimal, optional): Giá tối đa
- `sortBy` (string, optional): Sắp xếp (name, price, date)

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "iPhone 15",
      "price": 20000000,
      "description": "iPhone mới nhất",
      "imageUrl": "/images/iphone15.jpg",
      "stock": 10,
      "categoryId": 1,
      "categoryName": "Điện thoại"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 2.2. GET /api/products/{id}

**Mô tả:** Lấy chi tiết sản phẩm

**Quyền truy cập:** Public

**Response 200:**
```json
{
  "id": 1,
  "name": "iPhone 15",
  "price": 20000000,
  "description": "iPhone mới nhất với chip A17 Pro",
  "imageUrl": "/images/iphone15.jpg",
  "stock": 10,
  "categoryId": 1,
  "categoryName": "Điện thoại",
  "createdDate": "2024-01-01T00:00:00Z"
}
```

**Response 404:**
```json
{
  "message": "Không tìm thấy sản phẩm với ID 1"
}
```

### 2.3. POST /api/products

**Mô tả:** Tạo sản phẩm mới

**Quyền truy cập:** Admin

**Request Body:**
```json
{
  "name": "iPhone 15",
  "price": 20000000,
  "description": "iPhone mới nhất",
  "categoryId": 1,
  "stock": 10,
  "imageFile": "multipart/form-data"
}
```

**Response 201:**
```json
{
  "id": 1,
  "name": "iPhone 15",
  "price": 20000000,
  "imageUrl": "/images/iphone15.jpg",
  "message": "Tạo sản phẩm thành công"
}
```

**Response 400:**
```json
{
  "message": "Validation failed",
  "errors": {
    "name": ["Tên sản phẩm là bắt buộc"],
    "price": ["Giá phải lớn hơn 0"]
  }
}
```

### 2.4. PUT /api/products/{id}

**Mô tả:** Cập nhật sản phẩm

**Quyền truy cập:** Admin

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "price": 25000000,
  "description": "Cập nhật mô tả",
  "stock": 5
}
```

**Response 204:** No Content

**Response 404:**
```json
{
  "message": "Không tìm thấy sản phẩm với ID 1"
}
```

### 2.5. DELETE /api/products/{id}

**Mô tả:** Xóa sản phẩm (soft delete)

**Quyền truy cập:** Admin

**Response 204:** No Content

---

## 🛒 3. Orders API

### 3.1. GET /api/orders

**Mô tả:** Lấy danh sách đơn hàng

**Quyền truy cập:** Admin

**Query Parameters:**
- `page` (int, optional)
- `pageSize` (int, optional)
- `status` (int, optional): 0=New, 1=Shipping, 2=Completed, 3=Cancelled
- `userId` (string, optional): Lọc theo user

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "orderDate": "2024-01-01T10:00:00Z",
      "totalAmount": 20000000,
      "status": 0,
      "statusText": "Mới",
      "shippingName": "Nguyễn Văn A",
      "shippingPhone": "0123456789",
      "shippingAddress": "123 Đường ABC",
      "items": [
        {
          "productName": "iPhone 15",
          "quantity": 1,
          "unitPrice": 20000000
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 3.2. GET /api/orders/{id}

**Mô tả:** Lấy chi tiết đơn hàng

**Quyền truy cập:** Admin hoặc User (chỉ xem đơn hàng của mình)

**Response 200:**
```json
{
  "id": 1,
  "orderDate": "2024-01-01T10:00:00Z",
  "totalAmount": 20000000,
  "status": 0,
  "statusText": "Mới",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "iPhone 15",
      "quantity": 1,
      "unitPrice": 20000000,
      "subtotal": 20000000
    }
  ]
}
```

### 3.3. POST /api/orders

**Mô tả:** Tạo đơn hàng mới

**Quyền truy cập:** Public (có thể yêu cầu đăng nhập)

**Request Body:**
```json
{
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ, TP. Đà Nẵng",
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 2
    }
  ]
}
```

**Response 201:**
```json
{
  "id": 1,
  "orderNumber": "ORD-2024-0001",
  "message": "Đặt hàng thành công",
  "totalAmount": 20000000
}
```

**Response 400:**
```json
{
  "message": "Validation failed",
  "errors": {
    "shippingName": ["Tên người nhận là bắt buộc"],
    "shippingPhone": ["Số điện thoại không hợp lệ"],
    "items": ["Giỏ hàng không được trống"]
  }
}
```

### 3.4. PUT /api/orders/{id}/status

**Mô tả:** Cập nhật trạng thái đơn hàng

**Quyền truy cập:** Admin

**Request Body:**
```json
{
  "status": 1
}
```

**Response 204:** No Content

**Response 400:**
```json
{
  "message": "Không thể chuyển từ trạng thái 'Hoàn thành' sang 'Đang giao'"
}
```

---

## 🔐 4. Auth API

### 4.1. POST /api/auth/register

**Mô tả:** Đăng ký tài khoản mới

**Quyền truy cập:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "fullName": "Nguyễn Văn A"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "role": "User"
  },
  "expiresAt": "2024-01-01T11:00:00Z"
}
```

### 4.2. POST /api/auth/login

**Mô tả:** Đăng nhập

**Quyền truy cập:** Public

**Request Body:**
```json
{
  "email": "admin@dnu.edu.vn",
  "password": "Admin@123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-id",
    "email": "admin@dnu.edu.vn",
    "fullName": "Administrator",
    "role": "Admin"
  },
  "expiresAt": "2024-01-01T11:00:00Z"
}
```

**Response 401:**
```json
{
  "message": "Email hoặc mật khẩu không đúng"
}
```

### 4.3. POST /api/auth/logout

**Mô tả:** Đăng xuất

**Quyền truy cập:** Authenticated

**Response 200:**
```json
{
  "message": "Đăng xuất thành công"
}
```

### 4.4. GET /api/auth/me

**Mô tả:** Lấy thông tin user hiện tại

**Quyền truy cập:** Authenticated

**Response 200:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "role": "User"
}
```

---

## 📊 5. Statistics API

### 5.1. GET /api/statistics/overview

**Mô tả:** Tổng quan thống kê

**Quyền truy cập:** Admin

**Query Parameters:**
- `startDate` (datetime, optional)
- `endDate` (datetime, optional)

**Response 200:**
```json
{
  "totalRevenue": 100000000,
  "totalOrders": 50,
  "newCustomers": 10,
  "totalProducts": 100,
  "pendingOrders": 5
}
```

### 5.2. GET /api/statistics/revenue-by-month

**Mô tả:** Doanh thu theo tháng

**Quyền truy cập:** Admin

**Query Parameters:**
- `months` (int, optional): Số tháng (mặc định: 6)

**Response 200:**
```json
{
  "data": [
    {
      "year": 2024,
      "month": 1,
      "revenue": 50000000,
      "orderCount": 25
    },
    {
      "year": 2024,
      "month": 2,
      "revenue": 60000000,
      "orderCount": 30
    }
  ]
}
```

### 5.3. GET /api/statistics/top-products

**Mô tả:** Top sản phẩm bán chạy

**Quyền truy cập:** Admin

**Query Parameters:**
- `limit` (int, optional): Số lượng (mặc định: 10)

**Response 200:**
```json
{
  "data": [
    {
      "productId": 1,
      "productName": "iPhone 15",
      "totalSold": 100,
      "totalRevenue": 2000000000
    },
    {
      "productId": 2,
      "productName": "Samsung S24",
      "totalSold": 80,
      "totalRevenue": 1440000000
    }
  ]
}
```

---

## ⚠️ 6. Error Handling

### 6.1. Standard Error Response

```json
{
  "message": "Error message",
  "errors": {
    "field1": ["Error 1", "Error 2"],
    "field2": ["Error 3"]
  },
  "statusCode": 400
}
```

### 6.2. HTTP Status Codes

- **200 OK**: Thành công
- **201 Created**: Tạo mới thành công
- **204 No Content**: Xóa/Sửa thành công
- **400 Bad Request**: Dữ liệu không hợp lệ
- **401 Unauthorized**: Chưa đăng nhập hoặc token hết hạn
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Không tìm thấy resource
- **500 Internal Server Error**: Lỗi server

---

## 📝 7. Best Practices

### 7.1. Naming Conventions

- URLs: lowercase, kebab-case
- Endpoints: plural nouns (`/api/products`, không phải `/api/product`)
- HTTP Methods: GET, POST, PUT, DELETE

### 7.2. Pagination

Luôn sử dụng pagination cho danh sách lớn:
```
GET /api/products?page=1&pageSize=10
```

### 7.3. Filtering & Sorting

Sử dụng query parameters:
```
GET /api/products?categoryId=1&minPrice=1000000&sortBy=price
```

### 7.4. Versioning

Có thể thêm version vào URL:
```
/api/v1/products
/api/v2/products
```

---

## 🎯 8. Kết luận

API được thiết kế:
- ✅ RESTful chuẩn
- ✅ Dễ sử dụng và maintain
- ✅ Bảo mật với JWT
- ✅ Validation đầy đủ
- ✅ Error handling rõ ràng

