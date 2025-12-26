# 🎓 DNU E-BOOK FULLSTACK
# **DỰ ÁN THIẾT KẾ & LẬP TRÌNH FULL-STACK**

![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?logo=vuedotjs&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4?logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927?logo=microsoftsqlserver&logoColor=white)

---

## 📖 Giới thiệu

Đây là tài liệu học tập chính thức cho học phần **FIT4104 - Dự án Thiết kế, Lập trình Full-stack** tại Đại học Đà Nẵng.
Tài liệu được thiết kế theo hướng **Project-based Learning** (Học qua dự án), hướng dẫn sinh viên xây dựng một hệ thống hoàn chỉnh từ con số 0.

### 🎯 Mục tiêu
- Xây dựng Frontend hiện đại với **Vue 3 (Composition API)**.
- Xây dựng Backend mạnh mẽ với **ASP.NET Core Web API**.
- Tích hợp hệ thống, xử lý bảo mật JWT, và triển khai thực tế.

---

## 🛠️ Tech Stack

| Thành phần | Công nghệ | Chi tiết |
|------------|-----------|----------|
| **Frontend** | Vue.js 3 | Composition API, Script Setup |
| **State** | Pinia | Quản lý trạng thái tập trung |
| **Router** | Vue Router 4 | Điều hướng trang SPA |
| **UI Lib** | Vuetify / AntDV | Giao diện Responsive |
| **Backend** | ASP.NET Core 8 | Web API |
| **Database** | SQL Server | Entity Framework Core |
| **Auth** | JWT | JSON Web Token |

---

## 📚 Cấu trúc tài liệu

### 🟦 Giai đoạn 1: Frontend Foundation (Tuần 1-8)
```
phan_1_frontend_foundation/
├── 01_gioi_thieu_vue3.md         ← Giới thiệu Vue 3 và SPA
├── 02_setup_moi_truong.md        ← Setup môi trường, tạo project
├── 03_template_syntax.md         ← Template Syntax ({{ }}, :, @)
├── 04_reactivity_ref.md          ← Reactivity với ref()
├── 05_conditional_rendering.md   ← v-if, v-show
├── 06_list_rendering.md          ← v-for
├── 07_form_handling.md           ← v-model
├── 08_computed_watch.md          ← Computed và Watch
├── 09_components.md              ← Components cơ bản
├── 10_props_emits.md             ← Props và Emits
├── 11_lifecycle_hooks.md         ← Lifecycle Hooks
├── 12_composition_api.md         ← Composition API nâng cao
├── 13_pinia_router.md            ← Pinia và Router
├── 14_ui_vuetify.md              ← UI Framework Vuetify
└── 15_axios_service.md           ← HTTP Client, API Pattern
```

### 🟩 Giai đoạn 2: Backend & Integration (Tuần 5-9)
```
phan_2_backend_integration/
├── 05_web_api_standards.md    ← RESTful API, DTO
├── 06_frontend_backend.md     ← Fetch Data, CORS
├── 07_form_upload.md          ← Form Handling, File Upload
├── 08_auth_backend.md         ← Identity, JWT Generation
└── 09_auth_frontend.md        ← Login UI, Protect Routes
```

### 🟨 Giai đoạn 3: Advanced & Deploy (Tuần 10-15)
```
phan_3_advanced_deploy/
├── 10_authorization.md        ← Phân quyền Role
├── 11_dashboard_charts.md     ← Thống kê, Biểu đồ
├── 12_testing_opt.md          ← Unit Test, Tối ưu
├── 13_deploy_backend.md       ← Deploy IIS/Docker
├── 14_deploy_frontend.md      ← Deploy Static/Nginx
└── 15_final_defense.md        ← Chuẩn bị bảo vệ
```

---

## 🚀 Dự án thực hành: DNU Shop

Xuyên suốt khóa học, chúng ta sẽ xây dựng **DNU Shop** - Hệ thống quản lý bán hàng gồm:
1. **Trang khách hàng (Storefront)**: Xem sản phẩm, giỏ hàng, đặt hàng.
2. **Trang quản trị (Admin Portal)**: Quản lý sản phẩm, đơn hàng, thống kê.

### 📚 Project Guide

Xem hướng dẫn chi tiết về phân tích, thiết kế và implementation:
👉 [Project Guide - DNU Shop](./project_guide/README.md)

**Nội dung bao gồm:**
- 🔍 [Phân tích hệ thống](./project_guide/01_system_analysis.md) - Functional & Non-functional analysis
- 🏗️ [Thiết kế hệ thống](./project_guide/02_system_design.md) - Architecture, Security, Frontend/Backend design
- 📡 [Thiết kế API](./project_guide/03_api_design.md) - RESTful API endpoints, Request/Response
- 📋 [Yêu cầu dự án](./project_guide/dnu_shop_requirements.md) - Chi tiết requirements
- 🗄️ [Database Schema](./project_guide/database_schema.md) - ERD, Tables, Relationships
- 🧪 [Chiến lược Testing](./project_guide/04_testing_strategy.md) - Unit, Integration, E2E tests
- 🚀 [Hướng dẫn Deployment](./project_guide/05_deployment_guide.md) - IIS, Docker, Vercel, Nginx

---

## 💡 Bắt đầu ngay
👉 [Đọc bài giới thiệu chi tiết](./00_gioi_thieu.md)
👉 [Bắt đầu Bài 1: Giới thiệu Vue 3](./phan_1_frontend_foundation/01_gioi_thieu_vue3.md)
