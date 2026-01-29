# HƯỚNG DẪN THỰC HÀNH DEPLOY BACKEND (DỰ ÁN VỢT THỦ PHỐ NÚI)

Tài liệu này hướng dẫn chi tiết 2 phương pháp deploy ứng dụng ASP.NET Core Web API (Target: .NET 8.0 LTS) và SQL Server cho dự án **Vợt thủ phố núi**:
1.  **Phần A1**: Deploy trực tiếp trên **VPS Linux (Ubuntu)**.
2.  **Phần A2**: Deploy sử dụng **Docker & Docker Compose**.

---

## PHẦN A1: DEPLOY TRÊN VPS LINUX (UBUNTU)

### 1. Chuẩn bị (Prerequisites)
> **Bối cảnh**: Hướng dẫn này áp dụng cho dự án **"Vợt thủ phố núi"** mà các bạn đã phát triển.

#### Khuyến khích đầu tư cho nghề nghiệp
Mặc dù có thể dùng thử các dịch vụ miễn phí, nhưng để làm quen với môi trường làm việc thực tế tại doanh nghiệp, mình **rất khuyến khích** các bạn nên đầu tư mua một **VPS** và **Tên miền** giá rẻ. Chi phí chỉ bằng 1-2 cốc trà sữa/tháng nhưng kinh nghiệm thu được là vô giá.

**Một số nhà cung cấp uy tín tại Việt Nam (có hỗ trợ sinh viên/giá rẻ):**
*   **VPS/Cloud Server**: Viettel IDC, VNPT Cloud, BKNS, TinoHost, 123Host.
*   **Tên miền**: Tenten.vn, Pavietnam.vn, Inet.vn, Matbao.net.

#### Yêu cầu kỹ thuật:
-   **VPS**: Một máy chủ ảo (VPS) chạy hệ điều hành **Ubuntu 20.04** hoặc **22.04 LTS**.
    -   *Cấu hình tối thiểu đề xuất*: 2 CPU, 4GB RAM (để chạy mượt SQL Server).
-   **SSH Client**: PuTTY (Windows) hoặc Terminal (macOS/Linux).
-   **Source Code**: Project **Vợt thủ phố núi** (ASP.NET Core Web API) đã hoàn thiện.

### 2. Thiết lập Tên miền (Domain)

Để ứng dụng chuyên nghiệp và dễ truy cập, bạn cần một tên miền trỏ về IP của VPS.

#### Tùy chọn 1 (Ưu tiên): Tên miền miễn phí tại Việt Nam hoặc Edu
-   Kiểm tra các chương trình tên miền miễn phí `.vn` cho sinh viên (nếu có chương trình tài trợ hiện hành từ VNNIC hoặc nhà đăng ký).
-   Hoặc sử dụng tên miền con (subdomain) từ các CLB/Trường nếu được cấp.

#### Tùy chọn 2: Tên miền miễn phí quốc tế
-   Sử dụng dịch vụ Dynamic DNS hoặc Free DNS như **No-IP**, **DuckDNS**.
-   Đăng ký **GitHub Student Developer Pack** để nhận tên miền miễn phí 1 năm từ Namecheap, .TECH, v.v.

#### Tùy chọn 3: Mua tên miền giá rẻ
-   Mua tên miền `.com`, `.net`, `.org` hoặc `.xyz` (thường rất rẻ năm đầu) tại Namecheap, Porkbun, Tenten, PA Vietnam...

#### Cấu hình DNS
Sau khi có tên miền, vào trang quản trị DNS:
1.  Tạo **A Record**:
    -   **Host/Name**: `@` (hoặc `www` hoặc `api` tùy nhu cầu).
    -   **Value/IP**: Nhập địa chỉ IP Public của VPS (ví dụ: `103.1.2.3`).
    -   **TTL**: Để mặc định hoặc 3600 (1 giờ).
2.  Lưu lại và đợi vài phút để DNS cập nhật.

---

### 3. Cài đặt Môi trường trên VPS

Kết nối SSH vào VPS:
```bash
ssh root@your_vps_ip
# Nhập mật khẩu root
```

#### Bước 3.1: Cài đặt .NET 8.0 SDK & Runtime
(Thay đổi phiên bản tùy theo project của bạn)

```bash
# Cập nhật danh sách gói
sudo apt-get update

# Cài đặt .NET SDK
sudo apt-get install -y dotnet-sdk-8.0

# Cài đặt ASP.NET Core Runtime (để chạy app)
sudo apt-get install -y aspnetcore-runtime-8.0

# Kiểm tra cài đặt
dotnet --version
```

#### Bước 3.2: Cài đặt SQL Server 2022 trên Linux

```bash
# Import GPG key và thêm repository
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list

# Cài đặt SQL Server
sudo apt-get update
sudo apt-get install -y mssql-server

# Cấu hình SQL Server (Đặt mật khẩu SA - Yêu cầu mạnh: Ký tự hoa, thường, số, ký tự đặc biệt)
sudo /opt/mssql/bin/mssql-conf setup
# Chọn phiên bản: 2 (Developer) -> Chấp nhận License -> Nhập pass SA

# Kiểm tra trạng thái
systemctl status mssql-server --no-pager
```

#### Bước 3.3: Cài đặt SQL Command Line Tools (sqlcmd)
Để thao tác với DB từ dòng lệnh:

```bash
curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt-get update
sudo apt-get install -y mssql-tools18 unixodbc-dev

# Thêm vào PATH
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bash_profile
source ~/.bash_profile
```

---

### 4. Deploy Ứng dụng (Publish & Run)

#### Bước 4.1: Publish Code từ Local
Tại máy cá nhân (Windows), mở CMD/Terminal tại thư mục chứa file `.csproj`:

```bash
# Publish ra thư mục 'publish'
dotnet publish -c Release -o ./publish
```

Nén toàn bộ file trong thư mục `publish` thành `app.zip` và upload lên VPS (dùng **WinSCP** hoặc `scp`).

#### Bước 4.2: Setup trên VPS

```bash
# Tạo thư mục chứa app
sudo mkdir -p /var/www/mywebapp

# Giả sử đã upload app.zip vào /root/
sudo apt-get install unzip
sudo unzip /root/app.zip -d /var/www/mywebapp

# Cấp quyền
sudo chown -R www-data:www-data /var/www/mywebapp
sudo chmod -R 755 /var/www/mywebapp
```

#### Bước 4.3: Cấu hình Systemd Service
Tạo file service để app tự chạy ngầm và tự khởi động lại khi crash.

```bash
sudo nano /etc/systemd/system/kestrel-mywebapp.service
```

Nội dung file: (Thay đổi `YourApp.dll` thành tên file dll chính của bạn)

```ini
[Unit]
Description=Example .NET Web API App running on Ubuntu

[Service]
WorkingDirectory=/var/www/mywebapp
ExecStart=/usr/bin/dotnet /var/www/mywebapp/YourApp.dll
Restart=always
# Khởi động lại sau 10 giây nếu crash
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-example
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

Lưu file (`Ctrl+O` -> Enter -> `Ctrl+X`).

Kích hoạt service:
```bash
sudo systemctl enable kestrel-mywebapp.service
sudo systemctl start kestrel-mywebapp.service
sudo systemctl status kestrel-mywebapp.service
```

---

### 5. Cài đặt & Cấu hình Nginx (Reverse Proxy)

Nginx sẽ đón request từ internet (Port 80/443) và chuyển tiếp vào ứng dụng Kestrel (mặc định Port 5000).

```bash
sudo apt-get install -y nginx
sudo systemctl start nginx
```

Cấu hình site:
```bash
sudo nano /etc/nginx/sites-available/default
```

Thay thế nội dung bằng: (Thay `your_domain.com` bằng tên miền của bạn)

```nginx
server {
    listen        80;
    server_name   your_domain.com; # Hoặc IP VPS nếu chưa có domain

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

Kiểm tra và reload Nginx:
```bash
sudo nginx -t
sudo nginx -s reload
```

---

### 6. Cài đặt SSL (HTTPS) miễn phí với Let's Encrypt

Để bảo mật API và tránh lỗi "Not Secure" trên trình duyệt/Mobile App.

```bash
sudo apt-get install -y certbot python3-certbot-nginx

# Chạy Certbot (Làm theo hướng dẫn trên màn hình)
sudo certbot --nginx -d your_domain.com
```

Certbot sẽ tự động sửa file cấu hình Nginx để bật HTTPS.

---

## PHẦN A2: DEPLOY VỚI DOCKER & DOCKER COMPOSE

Phương pháp này giúp "đóng gói" môi trường, dễ dàng chia sẻ và chạy trên mọi máy có Docker.

### 1. Chuẩn bị
-   Cài đặt **Docker Desktop** (trên Local Windows) hoặc **Docker Engine** (trên VPS).
-   Tạo tài khoản **Docker Hub** (https://hub.docker.com/).

### 2. Tạo Dockerfile
Tạo file tên `Dockerfile` (không có đuôi) trong thư mục gốc của project Backend.

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["YourProjectName/YourProjectName.csproj", "YourProjectName/"]
RUN dotnet restore "YourProjectName/YourProjectName.csproj"
COPY . .
WORKDIR "/src/YourProjectName"
RUN dotnet build "YourProjectName.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "YourProjectName.csproj" -c Release -o /app/publish

# Stage 3: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "YourProjectName.dll"]
```

### 3. Đóng gói & Chia sẻ Image (Image Distribution)

Đây là bước quan trọng để bạn bè hoặc giảng viên có thể chạy thử project của bạn mà không cần cài Visual Studio hay SQL Server.

#### Bước 3.1: Build Image
Mở Terminal tại thư mục chứa `Dockerfile`:

```bash
# Cú pháp: docker build -t <dockerhub_username>/<image_name>:<tag> .
docker build -t yourusername/my-api-project:v1 .
```

#### Bước 3.2: Chạy thử tại Local (Kiểm tra)
```bash
docker run -d -p 8080:8080 --name test-api yourusername/my-api-project:v1
# Truy cập localhost:8080/swagger để test
```

#### Bước 3.3: Push lên Docker Hub
Đăng nhập Docker Hub trên terminal:
```bash
docker login
# Nhập username và password
```

Push image:
```bash
docker push yourusername/my-api-project:v1
```

👉 **Chia sẻ**: Bây giờ bạn chỉ cần gửi câu lệnh `docker run...` cho bạn bè, họ có thể chạy ngay lập tức!

---

### 4. Deploy với Docker Compose (SQL Server + API)

Tạo file `docker-compose.yml` để chạy cả Database và API cùng lúc.

```yaml
version: '3.8'
# Lưu ý: Với Docker Compose V2, khai báo version là không bắt buộc, nhưng giữ lại để tương thích ngược.

services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: mssql_db
    restart: always
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=Password123!@# # Đặt pass mạnh
    ports:
      - "1433:1433"
    volumes:
      - sql_data:/var/opt/mssql

  api:
    image: yourusername/my-api-project:v1
    container_name: web_api
    restart: always
    depends_on:
      - db
    ports:
      - "80:8080" # Map port 80 máy chủ vào port 8080 container
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      # Connection String lưu ý: Server=db (tên service); ...
      - ConnectionStrings__DefaultConnection=Server=db;Database=MyDatabase;User Id=sa;Password=Password123!@#;TrustServerCertificate=True;

volumes:
  sql_data:
```

### 5. Khởi chạy hệ thống

> **Lưu ý**: Docker hiện đại sử dụng lệnh `docker compose` (v2) thay vì `docker-compose` (v1).

```bash
# Kiểm tra phiên bản
docker compose version

# Khởi chạy background (-d)
docker compose up -d

# Xem logs để debug
docker compose logs -f
```

### 6. Verification (Kiểm tra kết quả)

-   **API Availability**: Truy cập `http://your_domain.com/swagger` hoặc `http://IP_VPS/swagger` (nếu code có bật swagger ở prod, nếu không thử gọi API endpoint).
-   **Database Connection**: API đăng nhập/đăng ký thành công -> DB hoạt động tốt.
-   **SSL**: Truy cập được `https://...` không bị báo đỏ.
-   **Docker Share**: Nhờ một bạn khác pull image về chạy thử thành công.
