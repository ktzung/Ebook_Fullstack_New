# 🏗️ THIẾT KẾ HỆ THỐNG DNU SHOP

## 🎯 1. Kiến trúc tổng quan (System Architecture)

### 1.1. Kiến trúc 3 tầng (3-Tier Architecture)

```
┌─────────────────────────────────────────────────┐
│           PRESENTATION LAYER                    │
│  (Frontend - Vue.js 3 + Vuetify)                │
│  - User Interface                               │
│  - Client-side Routing                          │
│  - State Management (Pinia)                     │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/REST API
                   │ (JSON)
┌──────────────────▼──────────────────────────────┐
│           BUSINESS LOGIC LAYER                  │
│  (Backend - ASP.NET Core Web API)               │
│  - Controllers                                  │
│  - Services                                     │
│  - Authentication & Authorization              │
│  - Validation                                   │
└──────────────────┬──────────────────────────────┘
                   │ Entity Framework Core
                   │ (ORM)
┌──────────────────▼──────────────────────────────┐
│           DATA LAYER                            │
│  (SQL Server Database)                          │
│  - Tables                                       │
│  - Relationships                                │
│  - Stored Procedures                            │
└─────────────────────────────────────────────────┘
```

### 1.2. Luồng xử lý yêu cầu (Request Flow)

```
User Action (Frontend)
    ↓
Vue Component
    ↓
Service Layer (Axios)
    ↓
HTTP Request (REST API)
    ↓
ASP.NET Core Controller
    ↓
Service/Repository Layer
    ↓
Entity Framework Core
    ↓
SQL Server Database
    ↓
Response (JSON)
    ↓
Frontend Update UI
```

### 1.3. Kiến trúc Frontend

```
┌─────────────────────────────────────────┐
│         Vue Application                 │
├─────────────────────────────────────────┤
│  Views/Pages                            │
│  - HomePage.vue                         │
│  - ProductPage.vue                      │
│  - CartPage.vue                         │
│  - AdminDashboard.vue                   │
├─────────────────────────────────────────┤
│  Components                             │
│  - ProductCard.vue                      │
│  - ProductForm.vue                      │
│  - CartItem.vue                         │
├─────────────────────────────────────────┤
│  Stores (Pinia)                         │
│  - authStore                             │
│  - cartStore                             │
│  - productStore                          │
├─────────────────────────────────────────┤
│  Services                                │
│  - productService.js                     │
│  - orderService.js                       │
│  - authService.js                        │
├─────────────────────────────────────────┤
│  Router (Vue Router)                     │
│  - Public Routes                         │
│  - Protected Routes                      │
└─────────────────────────────────────────┘
```

### 1.4. Kiến trúc Backend

```
┌─────────────────────────────────────────┐
│      ASP.NET Core Web API                │
├─────────────────────────────────────────┤
│  Controllers                            │
│  - ProductsController                   │
│  - OrdersController                     │
│  - AuthController                       │
│  - StatisticsController                 │
├─────────────────────────────────────────┤
│  Services                               │
│  - ProductService                       │
│  - OrderService                         │
│  - AuthService                          │
├─────────────────────────────────────────┤
│  Repositories                           │
│  - IProductRepository                   │
│  - IOrderRepository                     │
├─────────────────────────────────────────┤
│  Models & DTOs                          │
│  - Product, ProductDto                 │
│  - Order, OrderDto                     │
├─────────────────────────────────────────┤
│  Data Access                            │
│  - ApplicationDbContext                │
│  - Entity Framework Core               │
└─────────────────────────────────────────┘
```

---

## 🔐 2. Thiết kế bảo mật (Security Design)

### 2.1. Authentication Flow

```
1. User nhập Email/Password
   ↓
2. Frontend gửi POST /api/auth/login
   ↓
3. Backend validate credentials
   ↓
4. Backend tạo JWT Token
   ↓
5. Backend trả về Token + User Info
   ↓
6. Frontend lưu Token vào localStorage
   ↓
7. Frontend thêm Token vào Header mỗi request
   ↓
8. Backend validate Token mỗi request
```

### 2.2. Authorization Flow

```
Request với JWT Token
   ↓
Backend decode Token
   ↓
Extract Role từ Claims
   ↓
Check [Authorize(Roles = "Admin")]
   ↓
Allow hoặc Deny (403 Forbidden)
```

### 2.3. Password Security

- **Hashing**: ASP.NET Core Identity sử dụng bcrypt
- **Salt**: Tự động thêm salt vào mỗi password
- **Strength Requirements**:
  - Tối thiểu 6 ký tự
  - Có chữ số
  - Có chữ hoa (optional)

---

## 📡 3. API Design

### 3.1. RESTful API Endpoints

#### Products API

```
GET    /api/products              → Lấy danh sách sản phẩm
GET    /api/products/{id}         → Lấy chi tiết sản phẩm
POST   /api/products              → Tạo sản phẩm mới (Admin)
PUT    /api/products/{id}         → Cập nhật sản phẩm (Admin)
DELETE /api/products/{id}         → Xóa sản phẩm (Admin)
GET    /api/products/search?q=    → Tìm kiếm sản phẩm
GET    /api/products?category=   → Lọc theo danh mục
```

#### Orders API

```
GET    /api/orders                → Lấy danh sách đơn hàng (Admin)
GET    /api/orders/{id}           → Lấy chi tiết đơn hàng
POST   /api/orders                → Tạo đơn hàng mới
PUT    /api/orders/{id}/status    → Cập nhật trạng thái (Admin)
```

#### Auth API

```
POST   /api/auth/register         → Đăng ký
POST   /api/auth/login            → Đăng nhập
POST   /api/auth/logout           → Đăng xuất
GET    /api/auth/me               → Lấy thông tin user hiện tại
```

#### Statistics API

```
GET    /api/statistics/overview   → Tổng quan (Admin)
GET    /api/statistics/revenue    → Doanh thu theo tháng (Admin)
GET    /api/statistics/top-products → Top sản phẩm bán chạy (Admin)
```

### 3.2. Request/Response Format

**Request Example:**
```json
POST /api/products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "iPhone 15",
  "price": 20000000,
  "description": "iPhone mới nhất",
  "categoryId": 1,
  "stock": 10
}
```

**Response Example:**
```json
{
  "id": 1,
  "name": "iPhone 15",
  "price": 20000000,
  "description": "iPhone mới nhất",
  "imageUrl": "/images/iphone15.jpg",
  "categoryId": 1,
  "stock": 10,
  "createdDate": "2024-01-01T00:00:00Z"
}
```

**Error Response:**
```json
{
  "message": "Validation failed",
  "errors": {
    "name": ["Tên sản phẩm là bắt buộc"],
    "price": ["Giá phải lớn hơn 0"]
  }
}
```

### 3.3. HTTP Status Codes

- **200 OK**: Thành công
- **201 Created**: Tạo mới thành công
- **204 No Content**: Xóa/Sửa thành công (không trả về data)
- **400 Bad Request**: Dữ liệu không hợp lệ
- **401 Unauthorized**: Chưa đăng nhập
- **403 Forbidden**: Không có quyền
- **404 Not Found**: Không tìm thấy resource
- **500 Internal Server Error**: Lỗi server

---

## 🗄️ 4. Database Design

### 4.1. Entity Relationship Diagram (ERD)

```
┌──────────────┐         ┌──────────────┐
│   Users      │         │  Categories  │
│  (Identity)  │         │              │
├──────────────┤         ├──────────────┤
│ Id (PK)      │         │ Id (PK)      │
│ Email        │         │ Name         │
│ PasswordHash │         │ Description  │
│ FullName     │         └──────┬───────┘
│ Role         │                │
└──────┬───────┘                │
       │                        │
       │ 1:N                    │ 1:N
       │                        │
┌──────▼───────┐         ┌──────▼───────┐
│   Orders     │         │  Products    │
├──────────────┤         ├──────────────┤
│ Id (PK)      │         │ Id (PK)      │
│ UserId (FK)  │         │ Name         │
│ OrderDate    │         │ Price        │
│ TotalAmount  │         │ Description  │
│ Status       │         │ ImageUrl     │
│ ShippingInfo │         │ Stock        │
└──────┬───────┘         │ CategoryId   │
       │                │ IsDeleted    │
       │ 1:N            └──────┬───────┘
       │                       │
┌──────▼───────┐               │ 1:N
│ OrderItems   │               │
├──────────────┤               │
│ Id (PK)      │               │
│ OrderId (FK) │               │
│ ProductId    │               │
│ Quantity     │               │
│ UnitPrice    │               │
└──────────────┘               │
                               │
                    ┌──────────┘
                    │
                    │
            ┌───────▼────────┐
            │ OrderItems     │
            │ (N:M)          │
            └────────────────┘
```

### 4.2. Bảng chi tiết

#### AspNetUsers (Identity)
- `Id` (string, PK)
- `UserName` (string)
- `Email` (string, unique)
- `PasswordHash` (string)
- `FullName` (string)
- `CreatedDate` (datetime)
- `IsActive` (bool)

#### Categories
- `Id` (int, PK, Identity)
- `Name` (string, required)
- `Description` (string, nullable)
- `CreatedDate` (datetime)

#### Products
- `Id` (int, PK, Identity)
- `Name` (string, required, max 100)
- `Description` (string, nullable, max 500)
- `Price` (decimal(18,2), required)
- `ImageUrl` (string, nullable)
- `Stock` (int, default 0)
- `CategoryId` (int, FK → Categories)
- `CreatedDate` (datetime)
- `UpdatedDate` (datetime, nullable)
- `IsDeleted` (bool, default false)

#### Orders
- `Id` (int, PK, Identity)
- `UserId` (string, FK → AspNetUsers)
- `OrderDate` (datetime)
- `TotalAmount` (decimal(18,2))
- `Status` (int) // 0: New, 1: Shipping, 2: Completed, 3: Cancelled
- `ShippingName` (string)
- `ShippingPhone` (string)
- `ShippingAddress` (string)
- `CreatedDate` (datetime)
- `UpdatedDate` (datetime, nullable)

#### OrderItems
- `Id` (int, PK, Identity)
- `OrderId` (int, FK → Orders)
- `ProductId` (int, FK → Products)
- `ProductName` (string) // Snapshot tại thời điểm mua
- `Quantity` (int)
- `UnitPrice` (decimal(18,2)) // Snapshot tại thời điểm mua

### 4.3. Indexes

```sql
-- Index cho tìm kiếm nhanh
CREATE INDEX IX_Products_Name ON Products(Name);
CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Orders_UserId ON Orders(UserId);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
```

---

## 🎨 5. Frontend Design

### 5.1. Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── LoadingSpinner.vue
│   ├── products/
│   │   ├── ProductCard.vue
│   │   ├── ProductList.vue
│   │   └── ProductForm.vue
│   └── cart/
│       ├── CartItem.vue
│       └── CartSummary.vue
├── views/
│   ├── public/
│   │   ├── HomePage.vue
│   │   ├── ProductDetailPage.vue
│   │   └── CartPage.vue
│   └── admin/
│       ├── DashboardPage.vue
│       ├── ProductManagementPage.vue
│       └── OrderManagementPage.vue
├── stores/
│   ├── auth.js
│   ├── cart.js
│   └── product.js
├── services/
│   ├── productService.js
│   ├── orderService.js
│   └── authService.js
└── router/
    └── index.js
```

### 5.2. Routing Structure

```javascript
{
  path: '/',
  component: HomePage,
  meta: { public: true }
},
{
  path: '/products/:id',
  component: ProductDetailPage,
  meta: { public: true }
},
{
  path: '/cart',
  component: CartPage,
  meta: { public: true }
},
{
  path: '/admin',
  component: AdminLayout,
  meta: { requiresAuth: true, roles: ['Admin'] },
  children: [
    { path: 'dashboard', component: DashboardPage },
    { path: 'products', component: ProductManagementPage },
    { path: 'orders', component: OrderManagementPage }
  ]
}
```

### 5.3. State Management (Pinia)

```javascript
// authStore
{
  token: string | null,
  user: User | null,
  isAuthenticated: boolean,
  isAdmin: boolean
}

// cartStore
{
  items: CartItem[],
  totalPrice: number,
  itemCount: number
}
```

---

## 🚀 6. Deployment Architecture

### 6.1. Development Environment

```
┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │
│  Vue Dev    │────────▶│  .NET API   │
│  :5173      │  HTTP   │  :5000      │
└─────────────┘         └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ SQL Server │
                        │  LocalDB   │
                        └────────────┘
```

### 6.2. Production Environment

```
┌─────────────────────────────────────┐
│         CDN / Static Hosting        │
│  (Vercel / Netlify / Nginx)         │
│  Frontend (Vue Build)               │
└──────────────┬──────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼──────────────────────┐
│      Load Balancer (Optional)        │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│   Backend   │  │   Backend   │
│  Server 1   │  │  Server 2   │
│  (IIS/Docker)│  │ (IIS/Docker)│
└──────┬──────┘  └──────┬──────┘
       │                │
       └───────┬────────┘
               │
       ┌───────▼───────┐
       │ SQL Server    │
       │ (Primary DB)  │
       └───────────────┘
```

---

## 📝 7. Kết luận

Thiết kế hệ thống **DNU Shop** tuân theo:
- ✅ **Separation of Concerns**: Tách biệt Frontend, Backend, Database
- ✅ **RESTful API**: Chuẩn công nghiệp
- ✅ **Security First**: Authentication, Authorization, Input Validation
- ✅ **Scalable**: Có thể mở rộng thêm tính năng
- ✅ **Maintainable**: Code dễ đọc, dễ maintain

Hệ thống sẵn sàng cho:
- Development và Testing
- Production Deployment
- Mở rộng tính năng trong tương lai

