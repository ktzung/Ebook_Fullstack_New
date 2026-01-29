# HƯỚNG DẪN NỘP BÀI THỰC HÀNH DEPLOY (DỰ ÁN VỢT THỦ PHỐ NÚI)

Để đảm bảo giảng viên có thể kiểm tra và chấm điểm chính xác kết quả thực hành Deploy của bạn, vui lòng thực hiện nộp bài theo hướng dẫn dưới đây.

> **Lưu ý**: Hướng dẫn này áp dụng cho cả **Bài thực hành cá nhân** và báo cáo **Bài tập lớn (theo nhóm)**.


---

## 1. Yêu cầu chung về Minh chứng (Evidence)

Kết quả thực hành sẽ được đánh giá dựa trên mức độ hoàn thiện và khả năng hoạt động thực tế của sản phẩm. Bạn cần chuẩn bị **3 loại minh chứng** sau:

1.  **Source Code**: Link Repository (GitHub/GitLab) chứa mã nguồn project (cần có file `README.md` mô tả).
2.  **Live Environment**: Đường dẫn truy cập sản phẩm đang chạy online.
3.  **Video Demo**: Quay màn hình thao tác sử dụng sản phẩm trên môi trường Deploy (không phải Localhost).

---

## 2. Chi tiết theo từng Môn học/Học phần

### A. Môn Backend (ASP.NET Core API + SQL)

Bạn cần nộp báo cáo chứa các thông tin sau:

-   **Link Repository**: Chứa Web API Code + Dockerfile (nếu làm phần Docker).
-   **Link Swagger/API**: `https://yourdomain.com/swagger` hoặc `http://IP_VPS/swagger`.
-   **Link Docker Hub** (Nếu chọn A2): Link tới Image đã push công khai.
-   **Video Demo (3-5 phút)**:
    -   Quay màn hình truy cập Swagger (có URL thật trên trình duyệt).
    -   Thực hiện login lấy Token.
    -   Thực hiện gọi 1 API có yêu cầu quyền (Authorize) thành công.
    -   *Nếu làm Docker*: Quay cảnh gõ lệnh `docker ps` trên VPS cho thấy container đang chạy.

### B. Môn Fullstack (Web App Vue.js)

-   **Link Repository**: Chứa cả Frontend và Backend (hoặc 2 repo riêng).
-   **Link Website**: `https://your-vue-app.vercel.app` hoặc `https://yourdomain.com`.
-   **Tài khoản Test**: Cung cấp 1 tài khoản (User/Pass) để giảng viên đăng nhập chấm bài.
-   **Video Demo (3-5 phút)**:
    -   Truy cập vào tên miền Web App.
    -   Đăng nhập -> Vào trang Admin/User -> Thêm/Sửa/Xóa dữ liệu.
    -   F12 (Network tab) để show cho thấy Web đang gọi API thật (không phải localhost).

### C. Môn Mobile (Flutter App)

-   **Link Repository**: Source code Flutter.
-   **File Cài đặt**:
    -   Link tải file `.apk` (Google Drive / Fshare / MediaFire).
    -   Hoặc Link tham gia Test (Firebase App Distribution / TestFlight).
-   **Video Demo (3-5 phút)**:
    -   **Bắt buộc**: Quay video thao tác trên **Điện thoại thật** hoặc Emulator.
    -   Mở App -> Đăng nhập -> Thao tác các chức năng chính.
    -   *Quan trọng*: Chứng minh App đang kết nối API online (ví dụ: tạo dữ liệu trên App, sau đó mở Web Admin hoặc Database check thấy dữ liệu đó).

---

## 3. Quy cách quay Video Demo

Để video đạt yêu cầu và dễ chấm (Bắt buộc):

1.  **Công cụ quay**: Khuyến nghị sử dụng **OBS Studio** (Miễn phí, Open Source).
2.  **Yêu cầu hình ảnh**:
    *   Quay toàn màn hình (Full Screen) hoặc cửa sổ ứng dụng rõ nét (720p trở lên).
    *   **BẮT BUỘC có hình ảnh khuôn mặt sinh viên** (Webcam/Camera) ở một góc màn hình trong suốt quá trình quay để xác thực người thực hiện.
3.  **Âm thanh**: Có thuyết minh giới thiệu: *"Chào thầy, em là [Tên], MSSV [Số]. Sau đây em xin demo..."*.

### Hướng dẫn nhanh sử dụng OBS Studio:
1.  **Tải và Cài đặt**: [obsproject.com](https://obsproject.com/).
2.  **Cấu hình Source (Nguồn quay)**:
    *   Trong mục **Sources**, nhấn dấu `+` -> Chọn **Display Capture** (để quay màn hình).
    *   Nhấn dấu `+` tiếp -> Chọn **Video Capture Device** (để bật Webcam). Kéo khung hình Webcam nhỏ lại và đặt vào góc màn hình.
3.  **Quay Video**:
    *   Nhấn **Start Recording** để bắt đầu quay.
    *   Thực hiện thao tác demo trên sản phẩm.
    *   Nhấn **Stop Recording** để lưu file (thường nằm trong thư mục Videos của máy tính).

### Hướng dẫn Upload lên YouTube:
1.  Truy cập [studio.youtube.com](https://studio.youtube.com/).
2.  Chọn **Create** -> **Upload videos**.
3.  Kéo thả video vừa quay vào.
4.  Ở bước **Visibility**, chọn chế độ **Unlisted** (Không công khai - chỉ ai có link mới xem được) hoặc **Public**. *Tuyệt đối không để Private*.
5.  Copy đường link video để nộp.

---

## 4. Nộp bài qua Microsoft Form

Vui lòng truy cập và điền đầy đủ thông tin vào Form dưới đây để nộp bài:
👉 **Link nộp bài trực tuyến**: [https://forms.office.com/r/HjJX1UwNnr](https://forms.office.com/r/HjJX1UwNnr)

Sinh viên cần chuẩn bị sẵn các thông tin sau để điền vào Form:

**Minh họa các trường dữ liệu cần khai báo:**

1.  **Họ và tên**: (Điền đầy đủ họ tên)
2.  **Mã sinh viên**: (Ví dụ: 123456)
3.  **Lớp/Môn học**: (Chọn lớp học phần tương ứng)
4.  **Link Repository (Source Code)**:
    *   *Yêu cầu*: Link GitHub/GitLab Public. Chứa đầy đủ code và file README hướng dẫn.
5.  **Link Sản phẩm Online (Deploy URL)**:
    *   *Backend*: Link Swagger hoặc API Endpoint.
    *   *Web/Mobile*: Link truy cập Web hoặc Link tải App.
6.  **Link Video Demo**:
    *   *Yêu cầu*: Link YouTube (Unlisted) hoặc Google Drive (đã mở quyền View). Video phải quay thao tác trên môi trường thật ().
7.  **Tài khoản Test (User/Pass)**:
    *   Cung cấp tài khoản để giảng viên đăng nhập chấm chức năng (nếu có yêu cầu đăng nhập).
8.  **Ghi chú thêm**:
    *   Báo cáo các vấn đề đặc biệt (ví dụ: host free hay bị ngủ đông, cần chờ reload...).

---
**Lưu ý quan trọng**:
*   Hãy kiểm tra kỹ quyền truy cập của các đường link (Repo, Video) trước khi nộp.
*   Các bài nộp thiếu Video minh chứng hoặc Link không truy cập được sẽ không được chấm điểm.
