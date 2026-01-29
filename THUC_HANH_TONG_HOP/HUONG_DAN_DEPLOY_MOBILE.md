# HƯỚNG DẪN THỰC HÀNH DEPLOY MOBILE APP (FLUTTER)

> **Bối cảnh**: Đóng gói và phát hành ứng dụng Mobile **"Vợt thủ phố núi"**.
> **Lưu ý quan trọng**: 
> 1. Tài liệu này dành cho **Flutter 3.10+**.
> 2. Đây là **Part C**, tiếp nối Part A. App cần kết nối tới Backend API đã deploy.

---

## PHẦN C1: CHUẨN BỊ (PRE-DEPLOYMENT)

### 1. Cập nhật API Endpoint
Khi chạy Simulator/Emulator, bạn có thể dùng `10.0.2.2` (Android) hay `localhost` (iOS). Nhưng khi đóng gói bản Release chạy trên máy thật, bạn **BẮT BUỘC** phải dùng URL thực tế của Server (Part A).

Mở file cấu hình API trong project Flutter (ví dụ `lib/core/constants/api_constants.dart`):

```dart
class ApiConstants {
  // Thay đổi dòng này thành domain thật của bạn
  // static const String baseUrl = "http://10.0.2.2:5000/api"; // Cũ
  static const String baseUrl = "https://your_domain.com/api"; // Mới (Production)
}
```

> **Mẹo**: Nếu chưa có domain và dùng IP, hãy ráng cấu hình IP tĩnh và đảm bảo điện thoại 3G/4G truy cập được IP đó.

### 2. Tạo Icon & Splash Screen
Đừng để logo mặc định của Flutter.
Sử dụng package `flutter_launcher_icons`:

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_launcher_icons: "^0.13.1"

flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/icon/app_icon.png"
```
Chạy lệnh tạo icon:
```bash
dart run flutter_launcher_icons
```

---

## PHẦN C2: XÂY DỰNG & DEPLOY CHO ANDROID

### 1. Tạo KeyStore (Chữ ký số)
Để đưa lên Google Play hoặc cài file APK Release, ứng dụng cần được ký số.

**Trên Windows (PowerShell):**
```powershell
keytool -genkey -v -keystore D:\upload-keystore.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```
*Lưu ý: Giữ file `.jks` cẩn thận và **nhớ mật khẩu**.*

### 2. Cấu hình Signing trong Code
Tạo file `android/key.properties`: (Không đưa file này lên Git)
```properties
storePassword=mat_khau_cua_ban
keyPassword=mat_khau_cua_ban
keyAlias=upload
storeFile=D:/upload-keystore.jks
```

Sửa file `android/app/build.gradle`:
```gradle
android {
    // ...
    signingConfigs {
        release {
            keyAlias 'upload'
            keyPassword 'mat_khau_cua_ban' // Hoặc đọc từ key.properties
            storeFile file('D:/upload-keystore.jks') // Hoặc đọc từ key.properties
            storePassword 'mat_khau_cua_ban'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ...
        }
    }
}
```

### 3. Build APK (Để cài trực tiếp)
Dành cho việc test nhanh, gửi file qua Zalo/Drive cho bạn bè cài thử.

```bash
flutter build apk --release
```

-   File kết quả: `build/app/outputs/flutter-apk/app-release.apk`.
-   **Cách dùng**: Copy file APK này vào điện thoại Android -> Mở và cài đặt.

### 4. Build App Bundle (AAB) (Để up Google Play)
Google Play hiện bắt buộc dùng định dạng `.aab`.

```bash
flutter build appbundle --release
```

-   File kết quả: `build/app/outputs/bundle/release/app-release.aab`.

### 5. Upload lên Google Play Console (Tóm tắt)
1.  Đăng ký tài khoản Developer (phí $25 trọn đời).
2.  Tạo ứng dụng mới -> Điền thông tin (Tên, mô tả, ảnh chụp màn hình).
3.  Vào mục **Production** hoặc **Internal Testing** -> Upload file `.aab`.
4.  Điền các bảng khảo sát (Nội dung, Độ tuổi, Quảng cáo).
5.  Gửi xét duyệt (Review). Quá trình này mất từ 1-7 ngày.

---

## PHẦN C3: XÂY DỰNG CHO IOS (YÊU CẦU MACOS)

*Lưu ý: Bạn bắt buộc phải có máy Mac và tài khoản Apple Developer (phí $99/năm) để đưa lên App Store.*

1.  Mở `ios/Runner.xcworkspace` bằng **Xcode**.
2.  Vào tab **Signing & Capabilities** -> Chọn Team (Tài khoản Apple Dev).
3.  Cập nhật **Bundle Identifier** (phải là duy nhất toàn cầu).
4.  Trên Menu Xcode: **Product** -> **Archive**.
5.  Sau khi Archive xong, cửa sổ Organizer hiện ra -> Chọn **Distribute App**.
6.  Chọn **App Store Connect** -> Upload.
7.  Vào trang web [App Store Connect](https://appstoreconnect.apple.com/) để điền thông tin và Submit for Review.

---

## PHẦN C4: GIẢI PHÁP PHÂN PHỐI KHÁC (MIỄN PHÍ)

Nếu không có tài khoản Developer trả phí, bạn có thể dùng các cách sau để cho người khác thực hành chấm điểm/test:

### 1. Firebase App Distribution (Khuyên dùng)
-   Hỗ trợ cả Android và iOS (iOS cần UDID máy test).
-   Tải app và cài đặt dễ dàng qua ứng dụng "App Tester".
-   Log được crash và lỗi chi tiết.

### 2. Diawi hoặc Install On Air
-   Upload file `.ipa` (iOS) hoặc `.apk` (Android).
-   Nó sinh ra link tải QR Code.
-   Gửi link cho bạn bè tải về cài đặt.

### 3. Nội bộ (Android only)
-   Chỉ cần gửi file `app-release.apk` qua Drive/Zalo/USB.
-   Trên điện thoại bật chế độ "Install from Unknown Sources" (Cài từ nguồn không xác định) để cài đặt.
