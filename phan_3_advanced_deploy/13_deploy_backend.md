# 🟨 TUẦN 13: DEPLOY BACKEND (IIS/DOCKER)

## 🎯 Mục tiêu
- Publish ứng dụng .NET ra file chạy được.
- Deploy lên IIS (Windows Server) hoặc Docker.

---

## 📦 1. Publish

### 🎬 Ví dụ dẫn nhập: Deploy website lên server

Hãy tưởng tượng bạn đã hoàn thành website bán hàng:

**Tình huống thực tế:**
- Code đang chạy trên máy local (localhost)
- Bạn muốn đưa lên server để mọi người truy cập được
- Cần chuyển từ development → production

**Vấn đề:**
```
❌ Code trên máy local không ai truy cập được
❌ Không thể chạy Visual Studio trên server
❌ Cần file có thể chạy độc lập
```

**Giải pháp: Publish**
- Build code thành file có thể chạy độc lập
- Deploy lên server (IIS, Docker, Cloud)
- Mọi người có thể truy cập qua internet

### 🌐 Liên hệ thực tế

**Deploy được dùng ở mọi website:**
- **Shopee, Tiki**: Deploy lên cloud (AWS, Azure)
- **Facebook, Google**: Deploy lên data center riêng
- **Banking App**: Deploy với security cao
- **Startup**: Deploy lên VPS, Heroku, Vercel

**Tất cả đều cần Deploy!**

Mở Terminal tại thư mục API:
```powershell
dotnet publish -c Release -o ./publish
```
Kết quả: Thư mục `publish` chứa file `.dll` và `.exe`.

---

## 🌐 2. Deploy lên IIS (Windows)

1. Cài đặt **IIS** trên Windows (Turn Windows features on or off).
2. Cài đặt **.NET Core Hosting Bundle** (để IIS hiểu được .NET Core).
3. Mở **IIS Manager** -> Add Website.
   - Site name: `DNUShopAPI`
   - Physical path: Chọn thư mục `publish` vừa tạo.
   - Port: 8080.
4. Truy cập `http://localhost:8080/swagger` để kiểm tra.

---

## 🐳 3. Deploy bằng Docker (Linux/Cloud)

### 3.1. Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "DNU.Shop.API.dll"]
```

### 3.2. Build & Run
```powershell
docker build -t dnushop-api .
docker run -d -p 5000:8080 dnushop-api
```

---

## 🎯 3. Case Study: Deploy Backend lên Production

### Mô tả tình huống

Deploy API .NET lên production server, tương tự như các website thực tế.

### Yêu cầu

- Build production release
- Deploy lên IIS (Windows Server)
- Hoặc Deploy lên Docker (Linux/Cloud)
- Cấu hình HTTPS
- Cấu hình CORS cho production
- Monitoring và logging

### Implementation

**1. Publish Configuration (`DNU.Shop.API.csproj`):**
```xml
<PropertyGroup>
  <TargetFramework>net8.0</TargetFramework>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>

<!-- Production settings -->
<PropertyGroup Condition="'$(Configuration)'=='Release'">
  <PublishSingleFile>true</PublishSingleFile>
  <SelfContained>false</SelfContained>
  <RuntimeIdentifier>win-x64</RuntimeIdentifier>
</PropertyGroup>
```

**2. Publish Script (`publish.ps1`):**
```powershell
# Build và publish
dotnet publish -c Release -o ./publish

# Copy appsettings.Production.json
Copy-Item "appsettings.Production.json" -Destination "./publish/appsettings.Production.json"

# Copy wwwroot (nếu có)
if (Test-Path "./wwwroot") {
    Copy-Item "./wwwroot" -Destination "./publish/wwwroot" -Recurse
}

Write-Host "Publish completed! Files in ./publish"
```

**3. Production Configuration (`appsettings.Production.json`):**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=production-server;Database=DNUShop;User Id=sa;Password=***;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "PRODUCTION_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG",
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

**4. IIS Configuration (`web.config`):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" 
                  arguments=".\DNU.Shop.API.dll" 
                  stdoutLogEnabled="true" 
                  stdoutLogFile=".\logs\stdout" 
                  hostingModel="inprocess">
        <environmentVariables>
          <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Production" />
        </environmentVariables>
      </aspNetCore>
    </system.webServer>
  </location>
</configuration>
```

**5. Docker Configuration (`Dockerfile`):**
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["DNU.Shop.API/DNU.Shop.API.csproj", "DNU.Shop.API/"]
RUN dotnet restore "DNU.Shop.API/DNU.Shop.API.csproj"

# Copy everything and build
COPY . .
WORKDIR "/src/DNU.Shop.API"
RUN dotnet build "DNU.Shop.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "DNU.Shop.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published files
COPY --from=publish /app/publish .

# Expose port
EXPOSE 8080

# Set environment
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Run
ENTRYPOINT ["dotnet", "DNU.Shop.API.dll"]
```

**6. Docker Compose (`docker-compose.yml`):**
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=DNUShop;User Id=sa;Password=YourPassword123;TrustServerCertificate=True
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

**7. Program.cs - Production Configuration:**
```csharp
var builder = WebApplication.CreateBuilder(args);

// CORS - Production
if (builder.Environment.IsProduction())
{
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("ProductionCors", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });
}

var app = builder.Build();

// Use CORS
if (app.Environment.IsProduction())
{
    app.UseCors("ProductionCors");
}

// HTTPS Redirection (Production only)
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.Run();
```

**8. Deploy Script (`deploy.sh` - Linux):**
```bash
#!/bin/bash

echo "Building Docker image..."
docker build -t dnushop-api:latest .

echo "Stopping existing container..."
docker stop dnushop-api || true
docker rm dnushop-api || true

echo "Starting new container..."
docker run -d \
  --name dnushop-api \
  -p 5000:8080 \
  --env-file .env.production \
  --restart unless-stopped \
  dnushop-api:latest

echo "Deploy completed!"
```

**9. Health Check (`Controllers/HealthController.cs`):**
```csharp
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    [HttpGet]
    public async Task<IActionResult> Check()
    {
        try
        {
            // Check database connection
            await _context.Database.CanConnectAsync();
            
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.Now,
                version = "1.0.0"
            });
        }
        catch
        {
            return StatusCode(503, new { status = "unhealthy" });
        }
    }
}
```

**Giải thích:**
- **Publish**: Build code thành file có thể chạy độc lập
- **IIS**: Deploy trên Windows Server
- **Docker**: Deploy trên Linux/Cloud (linh hoạt hơn)
- **Configuration**: Tách biệt config cho production
- **Security**: HTTPS, CORS, secure secrets
- **Monitoring**: Health check, logging

---

## 🧪 4. Thực hành

1. Thực hiện Publish dự án.
2. (Lựa chọn) Cài IIS trên máy cá nhân và deploy thử.
3. Hoặc cài Docker Desktop và chạy container.

---

## ❌ 5. Các lỗi thường gặp

### Lỗi 1: IIS không chạy được .NET
**❌ Vấn đề:** 500 error  
**✅ Giải pháp:** Cài .NET Core Hosting Bundle, restart IIS.

### Lỗi 2: Connection string sai
**❌ Vấn đề:** Không kết nối được DB  
**✅ Giải pháp:** Kiểm tra connection string trong `appsettings.json`.

### Lỗi 3: CORS lỗi sau deploy
**❌ Vấn đề:** Frontend không gọi được API  
**✅ Giải pháp:** Update CORS policy với production URL.

---

## 💡 6. Best Practices

- Use environment variables cho config
- Enable HTTPS
- Set up logging
- Monitor với Application Insights
- Backup database regularly
- Use reverse proxy (Nginx)

---

## 📝 7. Bài tập thực hành

1. Deploy lên Azure App Service
2. Setup CI/CD với GitHub Actions
3. Configure SSL certificate
4. Setup monitoring và alerts
5. Implement health checks

---

## 🧪 8. Mini Test

### Câu 1: Dockerfile là gì?
<details>
<summary>Xem đáp án</summary>
File hướng dẫn build Docker image.
</details>

### Câu 2: Tại sao cần .NET Hosting Bundle?
<details>
<summary>Xem đáp án</summary>
Để IIS có thể chạy .NET Core applications.
</details>

---

## 📌 9. Quick Notes

### Publish Command
```powershell
dotnet publish -c Release -o ./publish
```

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "API.dll"]
```

### Docker Commands
```powershell
docker build -t api .
docker run -d -p 5000:8080 api
```