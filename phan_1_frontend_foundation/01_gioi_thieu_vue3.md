# 🟦 BÀI 1: GIỚI THIỆU VUE 3

## 🎯 Mục tiêu
- Hiểu Vue.js là gì và tại sao cần học
- Hiểu kiến trúc SPA (Single Page Application)
- So sánh Vue với các framework khác
- Chuẩn bị tâm thế học tập

---

## 🧠 1. Vue.js là gì?

### 🎬 Ví dụ dẫn nhập: Website bạn dùng hàng ngày

Hãy nghĩ về các website bạn dùng hàng ngày:
- **Facebook**: Like một bài viết → Số like tự động tăng, không cần reload trang
- **YouTube**: Xem video → Danh sách video đề xuất tự động cập nhật
- **Shopee**: Thêm vào giỏ → Số lượng trong icon giỏ tự động tăng
- **Gmail**: Email mới đến → Danh sách tự động cập nhật

**Tất cả đều là SPA (Single Page Application) và dùng framework như Vue!**

**Vấn đề với website truyền thống:**
```
User click "Sản phẩm" 
→ Trang reload (mất 1-2 giây)
→ Phải chờ server trả HTML mới
→ Mất thời gian, trải nghiệm kém
```

**Giải pháp với Vue.js:**
```
User click "Sản phẩm"
→ JavaScript cập nhật nội dung (0.1 giây)
→ Không reload trang
→ Trải nghiệm mượt mà như app mobile
```

### Giới thiệu

**Vue.js** (phát âm là "view") là một framework JavaScript mã nguồn mở dùng để xây dựng giao diện người dùng (UI) và Single Page Applications (SPA).

**Vue được tạo bởi:** Evan You (cựu nhân viên Google) vào năm 2014.

**Câu chuyện thú vị:**
- Evan You làm việc tại Google, dùng Angular để build prototype
- Thấy Angular quá phức tạp cho dự án nhỏ
- Quyết định tạo framework nhẹ, dễ học hơn → Vue.js ra đời
- Hiện tại Vue.js là một trong 3 framework phổ biến nhất (cùng React, Angular)

### Tại sao chọn Vue?

**Ưu điểm của Vue.js:**
- ✅ **Dễ học**: Syntax gần với HTML/CSS/JS thuần, dễ hiểu cho người mới
- ✅ **Nhẹ**: Bundle size nhỏ (~34KB gzipped)
- ✅ **Linh hoạt**: Có thể tích hợp từng phần hoặc dùng toàn bộ framework
- ✅ **Hiệu năng cao**: Virtual DOM, reactive system tối ưu
- ✅ **Cộng đồng lớn**: Nhiều tài liệu, thư viện hỗ trợ
- ✅ **TypeScript support**: Hỗ trợ tốt cho dự án lớn

**So sánh với các framework khác:**

| Framework | Độ khó | Bundle Size | Performance | Cộng đồng |
|-----------|-------|-------------|-------------|-----------|
| **Vue 3** | ⭐⭐ Dễ | ~34KB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| React | ⭐⭐⭐ Trung bình | ~42KB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Angular | ⭐⭐⭐⭐ Khó | ~135KB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Khi nào dùng Vue?**
- Xây dựng SPA (Single Page Application)
- Cần framework nhẹ, dễ học
- Team nhỏ, cần phát triển nhanh
- Tích hợp vào dự án hiện có

---

## 📖 2. Kiến trúc SPA là gì?

### 🧠 Giải thích chi tiết

**SPA (Single Page Application)** là ứng dụng web chỉ tải trang HTML một lần duy nhất. Sau đó, JavaScript sẽ đóng vai trò cập nhật nội dung mà không cần reload trang.

### So sánh SPA vs Traditional Web

| Đặc điểm | Traditional Web | SPA |
|----------|----------------|-----|
| **Số lần tải trang** | Mỗi lần click = 1 lần tải mới | Chỉ tải 1 lần ban đầu |
| **Tốc độ** | Chậm (phải load HTML mới) | Nhanh (chỉ update DOM) |
| **Trải nghiệm** | Giật lag khi chuyển trang | Mượt mà như app mobile |
| **Backend** | Trả về HTML | Chỉ trả về JSON/Data |
| **SEO** | Tốt (có HTML sẵn) | Cần SSR để SEO tốt |

**Ví dụ minh họa:**

**Traditional Web:**
```
User click "Sản phẩm" 
→ Browser gửi request đến server
→ Server trả về HTML mới
→ Browser render lại toàn bộ trang
→ Mất 1-2 giây
```

**SPA:**
```
User click "Sản phẩm"
→ JavaScript gọi API lấy data
→ JavaScript update DOM
→ Không reload trang
→ Mất 0.1-0.3 giây
```

**Ưu điểm của SPA:**
- ✅ Trải nghiệm mượt mà như App Mobile
- ✅ Tách biệt Frontend và Backend (Backend chỉ trả JSON)
- ✅ Giảm tải cho server (server không cần render HTML)
- ✅ Dễ phát triển và bảo trì (Frontend và Backend độc lập)
- ✅ Có thể cache data tốt hơn

**Nhược điểm:**
- ❌ SEO khó hơn (cần SSR hoặc pre-rendering)
- ❌ Tải ban đầu có thể chậm hơn (phải tải toàn bộ JS)
- ❌ Phụ thuộc vào JavaScript (nếu JS bị tắt thì không hoạt động)

**Ví dụ thực tế:**
- **SPA**: Gmail, Facebook, Twitter, YouTube, Netflix
- **Traditional**: Các website tin tức cũ, blog đơn giản

---

## 🎓 3. Hành trình học tập

### Lộ trình học Vue 3

**Giai đoạn 1: Cơ bản (Bài 1-8)**
1. Giới thiệu Vue 3 và SPA
2. Setup môi trường
3. Template Syntax
4. Reactivity cơ bản
5. Event Handling
6. Conditional & List Rendering
7. Form Handling
8. Computed và Watch

**Giai đoạn 2: Components (Bài 9-13)**
9. Components cơ bản
10. Props và Emits
11. Composition API
12. Lifecycle Hooks
13. Advanced Patterns

**Giai đoạn 3: Thực tế (Bài 14+)**
14. Pinia (State Management)
15. Vue Router
16. UI Framework (Vuetify)
17. HTTP Client (Axios)

### Kiến thức cần có trước

**Bắt buộc:**
- ✅ HTML/CSS cơ bản
- ✅ JavaScript cơ bản (ES6+)
  - Variables, Functions
  - Objects, Arrays
  - Arrow Functions
  - Destructuring
  - Async/Await

**Khuyến nghị:**
- DOM manipulation cơ bản
- ES6 Modules (import/export)

---

## 💡 4. Cách học hiệu quả

### Nguyên tắc học

1. **Học bằng cách làm**: Code ngay sau mỗi bài học
2. **Thực hành nhiều**: Làm lại ví dụ, tự tạo ví dụ mới
3. **Đọc tài liệu chính thức**: [vuejs.org](https://vuejs.org)
4. **Tham gia cộng đồng**: Discord, Reddit, Stack Overflow
5. **Xây dựng project**: Áp dụng kiến thức vào dự án thực tế

### Tài nguyên học tập

- **Tài liệu chính thức**: [vuejs.org](https://vuejs.org)
- **Vue School**: Khóa học trả phí chất lượng
- **YouTube**: Traversy Media, The Net Ninja
- **GitHub**: Vue Awesome (danh sách thư viện)

---

## 🧪 5. Mini Test

### Câu 1: Vue.js là gì?
<details>
<summary>Xem đáp án</summary>
Vue.js là framework JavaScript mã nguồn mở dùng để xây dựng giao diện người dùng và SPA.
</details>

### Câu 2: SPA khác Traditional Web như thế nào?
<details>
<summary>Xem đáp án</summary>
SPA chỉ tải trang 1 lần, sau đó JS cập nhật DOM. Traditional Web mỗi lần click = 1 lần tải HTML mới.
</details>

### Câu 3: Ưu điểm của Vue.js?
<details>
<summary>Xem đáp án</summary>
Dễ học, nhẹ, linh hoạt, hiệu năng cao, cộng đồng lớn.
</details>

### Câu 4: Khi nào nên dùng SPA?
<details>
<summary>Xem đáp án</summary>
Khi cần trải nghiệm mượt mà, tách biệt frontend/backend, xây dựng ứng dụng phức tạp.
</details>

### Câu 5: Kiến thức cần có trước khi học Vue?
<details>
<summary>Xem đáp án</summary>
HTML/CSS, JavaScript cơ bản (ES6+), hiểu về DOM.
</details>

---

## 📌 6. Quick Notes

### Vue.js là gì?
- Framework JavaScript cho UI
- Tạo bởi Evan You (2014)
- Nhẹ, dễ học, hiệu năng cao

### SPA là gì?
- Single Page Application
- Chỉ tải HTML 1 lần
- JS cập nhật DOM động

### So sánh
- Traditional: Mỗi click = reload
- SPA: Mỗi click = update DOM

---

**👉 Bài tiếp theo: [02_setup_moi_truong.md](./02_setup_moi_truong.md) - Setup môi trường và tạo project đầu tiên**

