# 📘 GIỚI THIỆU HỌC PHẦN

## **DỰ ÁN FULL-STACK (VUE 3 + .NET 8)**

## 0. Toàn cảnh công nghệ web hiện đại

> Mục tiêu: bạn nắm bức tranh lớn để hiểu vì sao khóa học chọn Vue 3 + .NET 8, đồng thời biết các lựa chọn khác trên thị trường hiện nay.

### Frontend (UI/UX trên trình duyệt)

| Nhóm | Công nghệ tiêu biểu | Điểm mạnh | Lưu ý/nhược điểm | Tình huống phù hợp |
| --- | --- | --- | --- | --- |
| Library | React | Hệ sinh thái khổng lồ, tuyển dụng rộng | Quyết định nhiều thứ (state, router) nên dễ phân mảnh | Sản phẩm lớn cần linh hoạt, đội ngũ nhiều kinh nghiệm |
| Framework | Vue 3 | Cú pháp gọn, học nhanh, SFC, Composition API; tài liệu tốt | Cộng đồng nhỏ hơn React nhưng đang tăng nhanh | Startup, SME, team nhỏ cần ra sản phẩm nhanh |
| Framework | Angular | Rất đầy đủ (DI, router, form, CLI), chuẩn hóa mạnh | Curve học cao, bundle dễ nặng nếu không tối ưu | Doanh nghiệp lớn, quy trình chuẩn, nhiều dev |
| Lightweight | Svelte/SvelteKit | Bundle nhỏ, SSR/SSG tốt | Hệ sinh thái nhỏ, tài liệu phân tán | POC, landing, app hiệu năng cao |
| UI Layer | Web Components | Chuẩn W3C, framework-agnostic | Build tool và DX chưa “mượt” như React/Vue | Design system dùng lại đa dự án |

Xu hướng 2025: SSR/SSG mặc định (Next/Nuxt/SvelteKit), island architecture, CSR chỉ cho phần động; TypeScript gần như bắt buộc.

### Backend (API, business logic)

| Stack | Đặc trưng | Ưu điểm | Lưu ý |
| --- | --- | --- | --- |
| .NET 8 (ASP.NET Core) | Hiệu năng cao, bảo mật, tooling Visual Studio/VS Code, C# hiện đại | Phù hợp doanh nghiệp, ngân hàng; long-term support | Dev Windows thuận lợi, nhưng chạy Linux cloud cũng dễ |
| Node.js (Express/NestJS/Fastify) | JS/TS end-to-end, nhiều package | Ra tính năng nhanh, microservice linh hoạt | Cần quản lý dependency, hiệu năng CPU-bound trung bình |
| Java (Spring Boot) | Mature, cực kỳ nhiều doanh nghiệp dùng | Ổn định, ecosystem lớn, cloud-native tốt | Cấu hình ban đầu phức tạp hơn, JVM footprint |
| Python (Django/FastAPI) | Django đầy đủ; FastAPI nhanh, typed | Dev nhanh, cộng đồng ML/DS lớn | Hiệu năng thấp hơn Go/.NET, cần tối ưu khi scale |
| PHP (Laravel) | MVC rõ ràng, nhiều package sẵn | Onboarding nhanh, chi phí thấp | Thị trường vẫn lớn nhưng đang dịch chuyển sang JS/TS |
| Go (Gin/Fiber) | Concurrency tốt, build tĩnh | Hiệu năng, footprint nhỏ, devops dễ | Thiếu built-in ORM chuẩn, viết nhiều code tay |

Xu hướng 2025: API first (OpenAPI), microservice + event-driven có chọn lọc, BFF (Backend for Frontend) để tối ưu cho mobile/web, container/K8s phổ biến, observability (tracing/log/metric) là mặc định.

### Fullstack & kết hợp

- SPA + API: React/Vue/Angular + REST/GraphQL từ Node/.NET/Java.
- SSR/SSG: Next.js/Nuxt/SvelteKit/Remix kết hợp API server (Node hoặc serverless).
- .NET: ASP.NET Razor/Blazor kết hợp API cùng codebase.
- JAMStack: SSG + CDN + serverless (Vercel/Netlify/Azure Static Web Apps).

Khi chọn stack:

- Nhanh ra mắt MVP: Vue 3 + Node/NestJS hoặc Laravel.
- Doanh nghiệp cần bảo mật, quy trình: ASP.NET Core hoặc Spring Boot + frontend framework chuẩn (Vue/React/Angular).
- Hiệu năng/chi phí hạ tầng: Go hoặc .NET tối ưu resource.
- Đội đã biết JS/TS: chọn end-to-end JS (Next/Nuxt + Nest/Fastify).

Lý do khóa học chọn **Vue 3 + .NET 8**: cân bằng giữa tốc độ phát triển, đường cong học tập, hiệu năng, bảo mật, và nhu cầu tuyển dụng tại doanh nghiệp vừa/lớn.

## 1. Tại sao lại là Vue 3 và .NET Core?

Trong thị trường tuyển dụng hiện nay, **Full-stack Developer** là vị trí được săn đón nhiều nhất. Sự kết hợp giữa:

- **Vue.js**: Framework Frontend linh hoạt, dễ học, hiệu năng cao (được dùng nhiều tại Alibaba, Tencent, GitLab).
- **.NET Core**: Framework Backend mạnh mẽ, ổn định, bảo mật của Microsoft (được dùng tại các doanh nghiệp lớn, ngân hàng).

Tạo nên một bộ kỹ năng "hủy diệt" giúp bạn dễ dàng xin việc tại các công ty Outsourcing lẫn Product.

## 2. Phương pháp học "Thực chiến"

Chúng ta sẽ **KHÔNG** học lý thuyết suông.
Mỗi dòng code bạn viết ra đều phục vụ cho dự án **DNU Shop**.

### Quy trình mỗi tuần

1. **Đặt vấn đề**: Ví dụ "Làm sao để người dùng đăng nhập?"
2. **Giải pháp**: Dùng JWT (JSON Web Token).
3. **Thực hành Backend**: Viết API sinh Token.
4. **Thực hành Frontend**: Viết Form đăng nhập và lưu Token.
5. **Kết quả**: Một tính năng hoàn chỉnh chạy được.

## 3. Dự án DNU Shop

Hệ thống chúng ta sẽ xây dựng có các tính năng sau:

### 🛒 Phân hệ Khách hàng (Public)

- Trang chủ: Banner, Sản phẩm nổi bật.
- Tìm kiếm & Lọc sản phẩm.
- Giỏ hàng (lưu LocalStorage).
- Đặt hàng (Checkout).

### 👨‍💼 Phân hệ Quản trị (Private - Cần đăng nhập)

- Dashboard: Biểu đồ doanh thu.
- Quản lý Sản phẩm: Thêm/Sửa/Xóa, Upload ảnh.
- Quản lý Đơn hàng: Duyệt đơn, Hủy đơn.
- Phân quyền: Admin (toàn quyền), Staff (chỉ xem).

## 4. Chuẩn bị môi trường

Trước khi bắt đầu Tuần 1, hãy đảm bảo bạn đã cài đặt:

1. **JetBrains Rider** (thay cho Visual Studio; nhẹ hơn, cross-platform, hỗ trợ ASP.NET Core rất tốt).
2. **Visual Studio Code** (cho Frontend).
3. **Node.js** (bản LTS mới nhất).
4. **SQL Server** (bản Developer hoặc Express).
5. **Postman** (để test API).

---

**Sẵn sàng chưa? Hãy bắt đầu hành trình trở thành Full-stack Developer!**

👉 [Đi tới Tuần 1: Setup Vue 3](./phan_1_frontend_foundation/01_setup_vue3.md)
