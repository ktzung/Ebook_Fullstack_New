# 🚀 HƯỚNG DẪN DEPLOYMENT DNU SHOP

## 🎯 1. Tổng quan

Hướng dẫn deploy hệ thống DNU Shop lên production environment.

### 1.1. Môi trường

- **Development:** Local (localhost)
- **Staging:** Test server (optional)
- **Production:** Live server

### 1.2. Yêu cầu

- **Backend:** Windows Server với IIS hoặc Linux với Docker
- **Frontend:** Static hosting (Vercel, Netlify, Nginx)
- **Database:** SQL Server (Local hoặc Cloud)

---

## 🔧 2. Backend Deployment

### 2.1. Chuẩn bị

**1. Build Production:**
```powershell
cd DNU.Shop.API
dotnet publish -c Release -o ./publish
```

**2. Kiểm tra file:**
- `DNU.Shop.API.dll`
- `appsettings.Production.json`
- `web.config` (cho IIS)

### 2.2. Deploy lên IIS (Windows Server)

**Bước 1: Cài đặt .NET Core Hosting Bundle**
- Download từ: https://dotnet.microsoft.com/download
- Cài đặt trên server

**Bước 2: Tạo Website trong IIS**
1. Mở IIS Manager
2. Right-click "Sites" → "Add Website"
3. Cấu hình:
   - Site name: `DNUShopAPI`
   - Physical path: `C:\inetpub\wwwroot\dnushop-api`
   - Port: `8080`
   - Host name: `api.dnushop.com` (optional)

**Bước 3: Copy files**
```powershell
# Copy từ máy dev
Copy-Item -Path ".\publish\*" -Destination "\\server\C$\inetpub\wwwroot\dnushop-api" -Recurse
```

**Bước 4: Cấu hình Application Pool**
- .NET CLR Version: "No Managed Code"
- Managed Pipeline Mode: "Integrated"

**Bước 5: Cấu hình appsettings.Production.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=PROD-SERVER;Database=DNUShop;User Id=sa;Password=***;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "PRODUCTION_SECRET_KEY_AT_LEAST_32_CHARACTERS",
    "Issuer": "https://api.dnushop.com",
    "Audience": "https://api.dnushop.com"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://dnushop.com",
      "https://www.dnushop.com"
    ]
  }
}
```

### 2.3. Deploy lên Docker (Linux/Cloud)

**Bước 1: Tạo Dockerfile**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["DNU.Shop.API/DNU.Shop.API.csproj", "DNU.Shop.API/"]
RUN dotnet restore "DNU.Shop.API/DNU.Shop.API.csproj"
COPY . .
WORKDIR "/src/DNU.Shop.API"
RUN dotnet build "DNU.Shop.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DNU.Shop.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DNU.Shop.API.dll"]
```

**Bước 2: Build Docker Image**
```bash
docker build -t dnushop-api:latest .
```

**Bước 3: Run Container**
```bash
docker run -d \
  --name dnushop-api \
  -p 5000:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Server=db;Database=DNUShop;User Id=sa;Password=***" \
  dnushop-api:latest
```

**Bước 4: Docker Compose (với Database)**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=DNUShop;User Id=sa;Password=YourPassword123
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123
    ports:
      - "1433:1433"
    volumes:
      - db_data:/var/opt/mssql
    restart: unless-stopped

volumes:
  db_data:
```

---

## 🎨 3. Frontend Deployment

### 3.1. Build Production

```powershell
cd DNU.Shop.Client
npm install
npm run build
```

**Kết quả:** Thư mục `dist/` chứa file tĩnh

### 3.2. Deploy lên Vercel (Miễn phí)

**Bước 1: Đăng ký Vercel**
- Vào https://vercel.com
- Login bằng GitHub

**Bước 2: Import Project**
1. Click "Add New Project"
2. Chọn repository GitHub
3. Cấu hình:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**Bước 3: Environment Variables**
```
VITE_API_BASE_URL=https://api.dnushop.com
```

**Bước 4: Deploy**
- Vercel tự động deploy khi push code lên GitHub
- Nhận link: `https://dnushop.vercel.app`

### 3.3. Deploy lên Netlify (Miễn phí)

**Bước 1: Đăng ký Netlify**
- Vào https://netlify.com
- Login bằng GitHub

**Bước 2: Deploy**
1. Drag & drop thư mục `dist/`
2. Hoặc kết nối GitHub repository

**Bước 3: Cấu hình `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3.4. Deploy lên Nginx (VPS)

**Bước 1: Cài đặt Nginx**
```bash
sudo apt update
sudo apt install nginx
```

**Bước 2: Copy files**
```bash
sudo cp -r dist/* /var/www/dnushop/
```

**Bước 3: Cấu hình Nginx**
```nginx
server {
    listen 80;
    server_name dnushop.com www.dnushop.com;
    
    root /var/www/dnushop;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Bước 4: SSL với Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dnushop.com -d www.dnushop.com
```

---

## 🗄️ 4. Database Deployment

### 4.1. Tạo Database

```sql
CREATE DATABASE DNUShop;
GO

USE DNUShop;
GO
```

### 4.2. Chạy Migrations

```powershell
# Từ máy dev
dotnet ef database update --connection "Server=PROD-SERVER;Database=DNUShop;User Id=sa;Password=***"
```

### 4.3. Seed Data (Optional)

```powershell
dotnet run --project DNU.Shop.API -- seed
```

---

## 🔒 5. Security Checklist

### 5.1. Backend

- ✅ HTTPS enabled
- ✅ CORS chỉ cho phép domain production
- ✅ JWT secret key đủ mạnh (32+ characters)
- ✅ Connection string không hardcode
- ✅ Error messages không expose thông tin nhạy cảm
- ✅ Input validation đầy đủ

### 5.2. Frontend

- ✅ Environment variables không commit vào Git
- ✅ API base URL từ environment
- ✅ Token không log ra console
- ✅ XSS protection

### 5.3. Database

- ✅ Strong password cho SA account
- ✅ Firewall chỉ cho phép IP server
- ✅ Backup định kỳ
- ✅ Connection string encrypted

---

## 📊 6. Monitoring & Logging

### 6.1. Application Insights (Azure)

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry();
```

### 6.2. Logging

```csharp
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### 6.3. Health Checks

```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString);

app.MapHealthChecks("/health");
```

---

## 🔄 7. CI/CD Pipeline

### 7.1. GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
      - name: Build
        run: dotnet publish -c Release
      - name: Deploy to Server
        run: |
          # Deploy script
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

---

## 📝 8. Rollback Plan

### 8.1. Backend Rollback

```powershell
# Quay lại version cũ
Copy-Item -Path ".\backup\v1.0\*" -Destination "C:\inetpub\wwwroot\dnushop-api" -Recurse
```

### 8.2. Frontend Rollback

- Vercel/Netlify: Deploy lại version cũ từ Git
- Nginx: Copy lại thư mục backup

### 8.3. Database Rollback

```sql
-- Restore từ backup
RESTORE DATABASE DNUShop FROM DISK = 'C:\backup\DNUShop.bak'
```

---

## 🎯 9. Kết luận

Deployment checklist:
- ✅ Build production
- ✅ Deploy backend (IIS/Docker)
- ✅ Deploy frontend (Vercel/Netlify/Nginx)
- ✅ Setup database
- ✅ Configure security
- ✅ Setup monitoring
- ✅ Test production
- ✅ Document rollback plan

