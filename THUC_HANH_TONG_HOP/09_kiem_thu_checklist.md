# 🟦 BÀI 09: KIỂM THỬ + CHECKLIST CUỐI

## 🎯 Mục tiêu
- Kiểm thử end-to-end.
- Xác nhận phân quyền chuẩn.

---

## 1) Test nhanh
- Login Admin: CRUD đầy đủ.
- Login Librarian: thêm/sửa Books, không xóa.
- Login Reader: chỉ xem.
- Guest: bị chặn trang admin.

## 2) Checklist
- [ ] API chạy ổn định (Swagger ok).
- [ ] Vue login OK, token lưu.
- [ ] Router guard hoạt động.
- [ ] UI phân quyền đúng role.
- [ ] CRUD Books/Categories OK.

---

## ✅ Kết quả
Hoàn thành chuỗi bài thực hành và có hệ thống hoạt động đúng phân quyền.

---

## 🧭 Step-by-step chi tiết (kèm ví dụ test)

### Step 1: Test đăng ký / đăng nhập (API)
**POST** `api/Auth/register`
```json
{
  "username": "admin",
  "email": "admin@library.com",
  "password": "Admin123",
  "role": "Admin"
}
```

**POST** `api/Auth/login`
```json
{
  "username": "admin",
  "password": "Admin123"
}
```

### Step 2: Test quyền Categories
- Không token → `GET /api/Categories` OK
- Librarian token → `POST /api/Categories` 403
- Admin token → `POST /api/Categories` OK

### Step 3: Test quyền Books
- Guest → chỉ xem sách công khai
- Librarian → thêm/sửa OK, xóa 403
- Admin → thêm/sửa/xóa OK

### Step 4: Test UI Vue
- Login Admin → thấy nút Thêm/Sửa/Xóa
- Login Librarian → không thấy Xóa
- Guest → bị chuyển về `/login`
