# Hướng dẫn chi tiết chuẩn bị môi trường

Tài liệu này hướng dẫn cài đặt và kiểm tra các công cụ ở mục 4 của 00_gioi_thieu.md. Hệ điều hành: Windows 10/11.

## Yêu cầu chung

- Quyền cài đặt ứng dụng (Run as Administrator khi cần).
- Dung lượng trống: tối thiểu 15 GB.
- Kết nối internet ổn định; tạm tắt VPN/proxy nếu quá trình tải bị chậm.

## 0) .NET SDK 8 (bắt buộc)

1. Tải bộ cài chính thức: [dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).
2. Chọn **.NET 8 SDK** (không chỉ Runtime) bản **x64** cho Windows, chạy installer và để tùy chọn PATH mặc định.
3. Sau khi cài, mở terminal mới và kiểm tra:

   ```bash
   dotnet --info
   ```

   Đảm bảo `Version: 8.x` và `RID: win-x64` hiện đúng.
4. Nếu dùng nhiều phiên bản, ưu tiên SDK 8 trong PATH hoặc gỡ bản cũ gây xung đột.

## 1) JetBrains Rider

1. Tải bản mới nhất: [jetbrains.com/rider](https://www.jetbrains.com/rider/)
2. Chạy installer, chọn **.NET Core cross-platform development** (nếu có) để tự động kéo SDK cần thiết.
3. Đăng nhập tài khoản JetBrains (student/edu hoặc trial).
4. Mở Rider lần đầu và xác nhận có .NET SDK 8.0: `File > Settings > .NET` hoặc chạy trong Terminal Rider:

   ```bash
   dotnet --info
   ```

5. Bật **Enable solution-wide analysis** để Rider gợi ý lỗi sớm.

## 2) Visual Studio Code

1. Tải: [code.visualstudio.com](https://code.visualstudio.com/)
2. Cài đặt và chọn **Add to PATH**.
3. Khuyến nghị extension:
   - C# Dev Kit (cho backend .NET).
   - ESLint, Prettier, Volar (Vue 3), TypeScript Vue Plugin.
   - GitHub Copilot/Copilot Chat nếu có quyền truy cập.
4. Kiểm tra cài đặt: mở terminal VS Code và chạy `code --version` (sẽ in phiên bản).

## 3) Node.js (bản LTS mới nhất)

1. Tải từ trang chủ LTS: [nodejs.org](https://nodejs.org/en/)
2. Cài đặt, giữ mặc định **Add to PATH**.
3. Kiểm tra:

   ```bash
   node -v
   npm -v
   ```

4. Bật corepack (để dùng pnpm/yarn nếu cần):

   ```bash
   corepack enable
   ```

## 4) SQL Server (Developer hoặc Express)

1. Tải:
   - Developer (đầy đủ tính năng, dùng cho học tập): [aka.ms/ssmsfullsetup](https://aka.ms/ssmsfullsetup)
   - Express (nhẹ hơn): [microsoft.com/sql-server-downloads](https://www.microsoft.com/sql-server/sql-server-downloads)
2. Chạy installer, chọn **Basic** (nhanh) hoặc **Custom** (tự chọn đường dẫn).
3. Chọn **Mixed Mode authentication** và đặt mật khẩu mạnh cho tài khoản `sa` (ghi chú lại).
4. Bật TCP/IP trong **SQL Server Configuration Manager** > SQL Server Network Configuration.
5. (Khuyến nghị) Cài SQL Server Management Studio hoặc Azure Data Studio để quản trị GUI.
6. Kiểm tra bằng `sqlcmd` (nếu đã cài):

   ```bash
   sqlcmd -S localhost -U sa -P <matkhau> -Q "SELECT @@VERSION;"
   ```

## 5) Postman

1. Tải desktop app: [postman.com/downloads](https://www.postman.com/downloads/)
2. Cài đặt và đăng nhập (hoặc dùng offline).
3. Tạo một **Collection** mới cho API khóa học, lưu sẵn biến môi trường `{{baseUrl}}`.
4. Bật **Automatically follow redirects** trong Settings để test login dễ hơn.

## 6) Kiểm tra nhanh sau khi cài

- Rider mở được solution `.sln` và chạy `dotnet --info` ok.
- VS Code mở thư mục frontend, extensions hoạt động.
- `node -v`, `npm -v`, `corepack enable` không báo lỗi.
- SQL Server: kết nối `localhost` bằng công cụ quản trị hoặc `sqlcmd` thành công.
- Postman gửi thử request `GET https://postman-echo.com/get` và nhận mã 200.

Giờ bạn đã sẵn sàng để bắt đầu Tuần 1.
