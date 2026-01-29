# HƯỚNG DẪN THỰC HÀNH DEPLOY FULLSTACK (FRONTEND VUE.JS)

> **Bối cảnh**: Triển khai Frontend Vue.js của dự án **"Vợt thủ phố núi"**.
> **Lưu ý quan trọng**: Tài liệu này là phần nối tiếp của **Part A**. Bạn cần đảm bảo đã deploy thành công Backend API.

---

## PHẦN B1: CHUẨN BỊ SOURCE CODE VUE.JS

### 1. Cấu hình biến môi trường (Environment Variables)
Khi chạy ở Local (Dev), bạn gọi API `localhost` nhưng khi lên Server (Prod), Frontend cần gọi API thật.

Trong thư mục gốc dự án Vue, tạo file `.env.production` (nếu chưa có):

```ini
# .env.production
# Thay thế bằng URL API Backend của bạn (đã deploy ở Part A)
VITE_API_ENDPOINT=https://api.yourdomain.com/api
```

Trong code gọi API (ví dụ `axios`), hãy chắc chắn bạn sử dụng biến này thay vì hard-code chuỗi URL:

```javascript
// Example in api.js
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT;

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Build dự án cho Production
Lệnh này sẽ đóng gói code Vue thành các file tĩnh (HTML, CSS, JS) trong thư mục `dist`.

```bash
# Tại máy local
npm run build
```

Kiểm tra thư mục `dist/` mới được tạo ra. Đây là tất cả những gì chúng ta cần để deploy.

---

## PHẦN B2: CÁC PHƯƠNG ÁN DEPLOY FRONTEND

Chúng ta có 2 phương án phổ biến:
1.  **Deploy trên cùng VPS với Backend (dùng Nginx)** - *Khuyên dùng để hiểu bản chất*.
2.  **Deploy trên Static Hosting (Vercel/Netlify)** - *Nhanh, miễn phí, phù hợp demo*.

---

### Phương án 1: Deploy trên VPS (Sử dụng Nginx)

Phương pháp này gom cả Frontend và Backend về chung một máy chủ.
-   Backend API chạy port 5000 (localhost).
-   Frontend là file tĩnh.
-   Nginx đóng vai trò Web Server phục vụ cả hai.

#### Bước 1: Upload thư mục `dist` lên VPS
Sử dụng WinSCP hoặc lệnh `scp` để đẩy folder `dist` lên:

```bash
# Nén thư mục dist thành dist.zip
# Upload lên VPS, ví dụ tại /var/www/myvueapp
```

Trên VPS:
```bash
sudo mkdir -p /var/www/myvueapp
# Giải nén dist.zip vào đây
sudo unzip dist.zip -d /var/www/myvueapp
# (Nếu giải nén ra 1 thư mục con, hãy move file ra ngoài sao cho index.html nằm ngay trong /var/www/myvueapp)
```

#### Bước 2: Cấu hình Nginx
Mở file config Nginx đã tạo ở Part A:

```bash
sudo nano /etc/nginx/sites-available/default
```

Cập nhật lại cấu hình:

```nginx
server {
    listen 80;
    server_name your_domain.com; # Tên miền chính cho Frontend

    root /var/www/myvueapp; # Trỏ vào thư mục Frontend
    index index.html;

    # Cấu hình Frontend (SPA Routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cấu hình Proxy cho Backend API (Nếu muốn dùng chung domain qua path /api)
    # Nếu Backend deploy ở subdomain khác (api.yourdomain.com) thì không cần block này ở đây
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Kiểm tra và reload Nginx:
```bash
sudo nginx -t
sudo nginx -s reload
```

---

### Phương án 2: Deploy trên Vercel (Miễn phí & Nhanh)

Vercel tối ưu cực tốt cho các SPA như Vue/React.

#### Bước 1: Cài đặt Vercel CLI hoặc dùng Dashboard
Cách đơn giản nhất là đẩy code lên **GitHub**, sau đó kết nối Vercel với GitHub Repo.

1.  Đăng nhập [Vercel](https://vercel.com/) bằng GitHub.
2.  Click **"Add New..."** -> **Project**.
3.  Chọn Repo Vue.js của bạn -> **Import**.

#### Bước 2: Cấu hình Build
Vercel thường tự nhận diện Vue (Vite).
-   **Build Command**: `npm run build`
-   **Output Directory**: `dist`
-   **Environment Variables**:
    -   Thêm biến `VITE_API_ENDPOINT` với giá trị là URL Backend API của bạn.

#### Bước 3: Deploy
Click **Deploy**. Sau 1-2 phút, bạn sẽ có URL dạng `https://my-vue-project.vercel.app`.

---

## PHẦN B3: XỬ LÝ LỖI (TROUBLESHOOTING)

### 1. Lỗi CORS (Cross-Origin Resource Sharing)
Đây là lỗi phổ biến nhất khi Front (domain A) gọi Back (domain B).

**Dấu hiệu**: Console báo đỏ lòm `Access to XMLHttpRequest... has been blocked by CORS policy...`.

**Cách khắc phục**:
Vào code **Backend (ASP.NET Core)** file `Program.cs`, thêm cấu hình CORS cho phép domain Frontend gọi vào:

```csharp
var builder = WebApplication.CreateBuilder(args);

// ... services

var app = builder.Build();

// Cấu hình CORS - Đặt TRƯỚC Authentication/Authorization
app.UseCors(policy => policy
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins(
        "https://my-vue-project.vercel.app", // Domain Vercel
        "https://your_domain.com",           // Domain VPS
        "http://localhost:5173"              // Local Dev
    )
    .AllowCredentials() // Nếu dùng Cookie/Auth
);

// ... middlewares khác
```

**Lưu ý**: Sau khi sửa Backend, phải **Publish lại** code lên VPS và restart service (`sudo systemctl restart kestrel-mywebapp`).

### 2. Lỗi 404 khi Reload trang (Trường hợp Deploy Nginx)
Vì Vue là SPA (Single Page App), khi bạn vào đường dẫn sâu như `/products/123` và bấm F5, Nginx sẽ tìm file `/products/123` trên ổ cứng -> Không thấy -> Báo 404.

**Khắc phục**:
Trong cấu hình Nginx (Phương án 1) đã có dòng:
```nginx
try_files $uri $uri/ /index.html;
```
Dòng này bảo Nginx: "Nếu không tìm thấy file, hãy trả về `index.html` để Vue Router tự xử lý tiếp".

### 3. Kiểm thử kết quả
-   Vào trang web Frontend.
-   Đăng nhập thử -> Nếu nhận Token và chuyển trang -> OK.
-   F12 (Network tab) để xem các request API có xanh (Status 200) không.
