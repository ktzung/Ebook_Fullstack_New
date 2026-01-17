# 🧭 LỘ TRÌNH THỰC HÀNH TỔNG HỢP (CHIA NHỎ THEO BÀI)

Mục tiêu: tách bài thực hành tổng hợp thành chuỗi bài con, mỗi bài đi sâu 1 phần.

## 📚 Danh sách bài
1. `01_yeu_cau_vai_tro_quyen_han.md` - Phân tích yêu cầu + ma trận phân quyền
2. `02_kien_truc_va_thiet_ke_db.md` - Kiến trúc tổng thể + thiết kế CSDL
3. `03_khoi_tao_backend_api.md` - Khởi tạo API + cấu hình nền
4. `04_xac_thuc_phan_quyen_jwt.md` - Auth JWT + Roles
5. `05_crud_categories_books.md` - CRUD Books/Categories + phân quyền
6. `06_frontend_vue_khoi_tao.md` - Khởi tạo Vue + Vuetify + cấu trúc
7. `07_frontend_auth_guard.md` - Đăng nhập + Pinia + Router Guard
8. `08_frontend_crud_ui.md` - UI CRUD + ẩn/hiện theo role
9. `09_kiem_thu_checklist.md` - Kịch bản test + checklist cuối

## ✅ Cách học
- Học tuần tự từ 01 → 09.
- Mỗi bài có mục tiêu, bước làm, checkpoint.
- Hoàn thành checkpoint mới chuyển bài tiếp theo.

---

> Tài liệu này đi kèm với:
> - `THUC_HANH_TONG_HOP_MVC_Auth_CRUD_RoleBase.md` (bản Razor gốc)
> - `THUC_HANH_TONG_HOP_MVC_Auth_CRUD_RoleBase_Vue.md` (bản Vue)

## 🧩 Cách dùng tài liệu (step-by-step)
1. Mở `01_yeu_cau_vai_tro_quyen_han.md` và hoàn thành bảng phân quyền.
2. Sang `02_kien_truc_va_thiet_ke_db.md` để thiết kế DB và hiểu quan hệ.
3. `03_khoi_tao_backend_api.md` → tạo API + DB.
4. `04_xac_thuc_phan_quyen_jwt.md` → cài JWT + Roles.
5. `05_crud_categories_books.md` → hoàn thiện API CRUD.
6. `06_frontend_vue_khoi_tao.md` → dựng Vue + Vuetify.
7. `07_frontend_auth_guard.md` → login + token + guard.
8. `08_frontend_crud_ui.md` → UI CRUD theo role.
9. `09_kiem_thu_checklist.md` → test toàn hệ thống.

## 📁 Quy ước cấu trúc thư mục đề xuất
```
LibraryManagement/
  LibraryManagement.API/     # ASP.NET Core API
  LibraryManagement.Admin/   # Vue SPA (Vuetify)
  Database/                  # Tài liệu, mô tả DB (tuỳ chọn)
```
