# 🟦 BÀI 01: PHÂN TÍCH YÊU CẦU + VAI TRÒ & QUYỀN HẠN

## 🎯 Mục tiêu
- Hiểu bài toán quản lý thư viện.
- Xác định vai trò và quyền chi tiết.
- Lập bảng phân quyền (Permission Matrix).

---

## 1) Mô tả bài toán
Hệ thống thư viện có nhiều nhóm người dùng:
- Admin: quản trị toàn bộ
- Librarian: quản lý sách nhưng không xóa
- Reader: chỉ xem
- Guest: chưa đăng nhập, chỉ xem công khai

---

## 2) Bảng phân quyền

| Chức năng | Admin | Librarian | Reader | Guest |
|-----------|-------|-----------|--------|-------|
| Xem danh sách sách | ✅ | ✅ | ✅ | ✅ (chỉ công khai) |
| Thêm/Sửa sách | ✅ | ✅ | ❌ | ❌ |
| Xóa sách | ✅ | ❌ | ❌ | ❌ |
| CRUD thể loại | ✅ | ❌ | ❌ | ❌ |
| Quản lý user | ✅ | ❌ | ❌ | ❌ |
| Đăng nhập/Đăng xuất | ✅ | ✅ | ✅ | ❌ |

---

## 3) Checkpoint
- [ ] Vẽ được bảng phân quyền.
- [ ] Liệt kê 4 vai trò và quyền tương ứng.

---

## ✅ Kết quả mong đợi
Bạn có bản mô tả rõ ràng để làm nền tảng phân quyền cho backend và UI.

---

## 🧭 Step-by-step chi tiết (kèm minh hoạ code)

### Step 1: Liệt kê chức năng
Tạo danh sách các chức năng chính trước:
- Books: List, Detail, Create, Update, Delete
- Categories: List, Create, Update, Delete
- Users: List, Assign Role
- Auth: Register, Login, Logout

### Step 2: Gán quyền theo vai trò
Viết bảng phân quyền như sau (giữ nhất quán cho backend + frontend).

### Step 3: Đặt tên role thống nhất trong code
**C# (Backend)**
```csharp
public static class RoleConstants
{
    public const string Admin = "Admin";
    public const string Librarian = "Librarian";
    public const string Reader = "Reader";
}
```

**Vue (Frontend)**
```javascript
export const ROLES = {
  ADMIN: 'Admin',
  LIBRARIAN: 'Librarian',
  READER: 'Reader',
}
```

### Step 4: Kiểm tra quyền trong UI (ví dụ)
```javascript
const canDeleteBook = isAdmin // chỉ Admin được xóa
const canEditBook = isAdmin || isLibrarian
```

### Step 5: Ghi lại thành “quy ước chung”
Tài liệu này sẽ được dùng xuyên suốt các bài sau để:
- `[Authorize(Roles = "...")]` trong API
- Ẩn/hiện nút trong Vue
