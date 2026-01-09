# ĐỀ CƯƠNG HỌC PHẦN: DỰ ÁN THIẾT KẾ, LẬP TRÌNH FULL-STACK (PHIÊN BẢN TỐI ƯU)

**Mã học phần:** FIT4104 (Điều chỉnh)
**Số tín chỉ:** 03
**Thời lượng:** 15 Tuần (45 tiết)
**Tech Stack:** Vue.js 3 (Composition API), ASP.NET Core 8 Web API, SQL Server.

---

## 1. MÔ TẢ HỌC PHẦN (CẬP NHẬT)
Học phần chuyên sâu về xây dựng ứng dụng Web hiện đại theo kiến trúc **Single Page Application (SPA)**. Sinh viên sẽ học cách phát triển đồng bộ cả Frontend (sử dụng **Vue.js 3 Ecosystem**) và Backend (sử dụng **ASP.NET Core Web API**). Trọng tâm của môn học là kỹ thuật tích hợp hệ thống, quản lý trạng thái (State Management), bảo mật (JWT Auth) và quy trình triển khai (Deploy) sản phẩm hoàn chỉnh.

## 2. MỤC TIÊU & CHUẨN ĐẦU RA
Sau khi học xong, sinh viên có khả năng:
1.  **Xây dựng** Frontend hiện đại với Vue 3, Pinia (State Management) và thư viện UI (Vuetify/Tailwind).
2.  **Thiết kế** Backend API chuẩn RESTful, bảo mật cao với ASP.NET Core.
3.  **Tích hợp** hai hệ thống thông qua HTTP Client (Axios), xử lý bất đồng bộ và các vấn đề giao tiếp (CORS, Auth Header).
4.  **Triển khai** (Deploy) ứng dụng Full-stack lên môi trường thực tế (Server/Cloud).
5.  **Làm việc nhóm** theo quy trình Agile/Scrum để hoàn thành dự án lớn.

## 3. PHƯƠNG PHÁP ĐÁNH GIÁ (THỰC CHIẾN)
| Bài đánh giá | Trọng số | Hình thức | Nội dung |
| :--- | :--- | :--- | :--- |
| **Chuyên cần** | 10% | Code tại lớp | Hoàn thành các tính năng nhỏ (Ticket) trong giờ thực hành. |
| **Giữa kỳ** | 30% | **Thi thực hành** | Xây dựng 1 module Fullstack (VD: CRUD Danh mục có Upload ảnh). |
| **Cuối kỳ** | 60% | **Bảo vệ Dự án** | Sản phẩm hoàn chỉnh, chạy trên môi trường Production (Demo). |

---

## 4. KẾ HOẠCH GIẢNG DẠY CHI TIẾT (15 TUẦN)

### GIAI ĐOẠN 1: KHỞI ĐỘNG & FRONTEND MODERN (Tuần 1-4)

#### Tuần 1: Tổng quan Full-stack & Vue 3 Setup
* **1.1. Kiến trúc SPA:** Client-side Rendering vs Server-side Rendering.
* **1.2. Môi trường phát triển:** Cài đặt Node.js, Vue CLI/Vite, .NET SDK, SQL Server.
* **1.3. Vue 3 Composition API:** Tư duy mới (`setup`, `ref`, `reactive`) so với Options API cũ.
* *Thực hành:* Khởi tạo dự án Frontend và Backend. Cấu trúc thư mục chuẩn cho dự án lớn.

#### Tuần 2: Quản lý Trạng thái & Routing (Vue Router + Pinia)
* **2.1. Routing:** Nested Routes, Navigation Guards (Chặn trang Admin).
* **2.2. State Management:** Tại sao cần Store? Giới thiệu **Pinia** (thay thế Vuex cũ).
* **2.3. Component Communication:** Props, Emits, Provide/Inject.
* *Thực hành:* Xây dựng Layout Dashboard, Menu động và quản lý trạng thái Sidebar.

#### Tuần 3: UI Framework (Vuetify/Ant Design)
* **3.1. Grid System:** Responsive Layout (Mobile/Desktop).
* **3.2. Data Components:** Data Table (Phân trang, Sắp xếp, Lọc).
* **3.3. Form Components:** Validate dữ liệu phía Frontend (VeeValidate/Vuelidate).
* *Thực hành:* Thiết kế các màn hình Danh sách và Form nhập liệu đẹp mắt.

#### Tuần 4: HTTP Client & API Design Patterns
* **4.1. Axios Setup:** Cấu hình Base URL, Timeouts.
* **4.2. Interceptors:** Kỹ thuật đánh chặn Request/Response (Tự động đính kèm Token).
* **4.3. API Service Pattern:** Tách biệt lớp gọi API ra khỏi Component.
* *Thực hành:* Viết module `apiService.js` dùng chung cho toàn dự án.

---

### GIAI ĐOẠN 2: BACKEND API & TÍCH HỢP (Tuần 5-9)

#### Tuần 5: Web API nâng cao với ASP.NET Core
* **5.1. RESTful Standards:** HTTP Verbs, Status Codes, URL Naming.
* **5.2. DTO (Data Transfer Object):** Tại sao không trả về Entity? AutoMapper.
* **5.3. Content Negotiation:** Trả về JSON chuẩn hóa (CamelCase).
* *Thực hành:* Viết API CRUD cho đối tượng chính (VD: Sản phẩm) trả về dữ liệu chuẩn.

#### Tuần 6: Kết nối Frontend - Backend (Integration 1)
* **6.1. CORS Policy:** Xử lý lỗi Cross-Origin giữa Vue (port 3000) và API (port 5000).
* **6.2. Fetching Data:** Gọi API từ Vue Component, hiển thị Loading State, Error State.
* **6.3. Real-time Feedback:** Sử dụng Toast/Notification khi gọi API thành công/thất bại.
* *Thực hành:* Hiển thị danh sách sản phẩm từ DB lên Vue Data Table.

#### Tuần 7: Xử lý Form & Upload File (Integration 2)
* **7.1. Form Submission:** Gửi dữ liệu JSON từ Vue xuống API.
* **7.2. File Upload:** Xử lý `multipart/form-data`. Lưu ảnh vào thư mục Server hoặc Cloud (Cloudinary).
* **7.3. Serve Static Files:** Cấu hình API để trả về đường dẫn ảnh.
* *Thực hành:* Chức năng "Thêm mới Sản phẩm" có upload ảnh đại diện.

#### Tuần 8: Authentication (JWT) - Phần Backend
* **8.1. Cơ chế Token:** Access Token & Refresh Token.
* **8.2. Identity Core:** Quản lý User, Role trong DB.
* **8.3. Login API:** Kiểm tra user/pass, sinh JWT Token trả về Client.
* *Thực hành:* Viết API Đăng ký, Đăng nhập.

#### Tuần 9: Authentication (JWT) - Phần Frontend
* **9.1. Lưu trữ Token:** LocalStorage vs Cookies (HttpOnly).
* **9.2. Auth Store (Pinia):** Quản lý trạng thái "Đã đăng nhập".
* **9.3. Protect Routes:** Chặn truy cập các trang cần đăng nhập.
* *Thực hành:* Hoàn thiện luồng Đăng nhập -> Lưu Token -> Chuyển hướng vào trang Admin.

---

### GIAI ĐOẠN 3: HOÀN THIỆN & TRIỂN KHAI (Tuần 10-15)

#### Tuần 10: Phân quyền (Authorization)
* **10.1. Role-based Access:** Ẩn hiện menu/nút bấm dựa trên quyền User.
* **10.2. API Protection:** Sử dụng `[Authorize]` attribute trong Controller.
* *Thực hành:* Chỉ Admin mới thấy nút "Xóa", User thường chỉ xem.

#### Tuần 11: Các tính năng nâng cao
* **11.1. Dashboard & Charts:** Vẽ biểu đồ thống kê (Chart.js/ApexCharts).
* **11.2. Reporting:** Xuất dữ liệu ra Excel/PDF.
* *Thực hành:* Trang Dashboard thống kê doanh thu/số lượng user.

#### Tuần 12: Kiểm thử & Tối ưu (Testing & Optimization)
* **12.1. Unit Testing:** Viết test cơ bản cho API.
* **12.2. Performance:** Lazy Loading Routes (Vue), Caching (API).
* *Thực hành:* Review code, sửa lỗi logic và giao diện.

#### Tuần 13: Triển khai (Deployment) - Backend
* **13.1. Publish API:** Build ra file DLL.
* **13.2. Hosting:** Cấu hình IIS hoặc Deploy lên Docker Container.
* **13.3. Database:** Migration dữ liệu lên Server thật.

#### Tuần 14: Triển khai (Deployment) - Frontend
* **14.1. Build Production:** Lệnh `npm run build`.
* **14.2. Hosting Static Files:** Deploy lên Nginx, Vercel hoặc tích hợp vào wwwroot của .NET.
* *Thực hành:* Đưa toàn bộ dự án lên Internet (có domain demo).

#### Tuần 15: Bảo vệ Đồ án
* Sinh viên demo sản phẩm chạy thật.
* Giảng viên chấm điểm dựa trên: Tính năng, Giao diện, Code sạch, và Khả năng trả lời vấn đề.

---

## 5. TÀI LIỆU THAM KHẢO
1.  **Vue.js 3 Docs:** [vuejs.org](https://vuejs.org) (Tài liệu chính chủ, luôn mới nhất).
2.  **ASP.NET Core Docs:** [learn.microsoft.com](https://learn.microsoft.com).
3.  **Sách:** *ASP.NET Core and Vue.js* - Devlin Duldulao (Cần chọn bản mới nhất cập nhật Vue 3).