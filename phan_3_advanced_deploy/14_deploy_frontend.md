# 🟨 TUẦN 14: DEPLOY FRONTEND

## 🎯 Mục tiêu
- Build Vue project ra file tĩnh (HTML/CSS/JS).
- Deploy lên các nền tảng miễn phí (Vercel/Netlify) hoặc Nginx.

---

## 📦 1. Build Production

### 🎬 Ví dụ dẫn nhập: Đưa website lên internet

Hãy tưởng tượng bạn đã hoàn thành website Vue:

**Tình huống thực tế:**
- Website đang chạy trên localhost:5173
- Bạn muốn đưa lên internet để mọi người truy cập
- Cần file tĩnh (HTML, CSS, JS) để upload lên server

**Vấn đề:**
```
❌ Code Vue không thể chạy trực tiếp trên browser
❌ Cần compile thành HTML/CSS/JS thuần
❌ Cần tối ưu (minify, compress)
```

**Giải pháp: Build Production**
- Compile Vue code thành HTML/CSS/JS
- Tối ưu file (minify, tree-shaking)
- Tạo file tĩnh có thể deploy lên bất kỳ server nào

### 🌐 Liên hệ thực tế

**Frontend Deploy được dùng ở mọi nơi:**
- **Shopee, Tiki**: Deploy lên CDN để load nhanh
- **Facebook, YouTube**: Deploy lên edge servers
- **Startup**: Deploy lên Vercel, Netlify (miễn phí)
- **Enterprise**: Deploy lên Nginx, Apache

**Tất cả đều cần Build và Deploy!**

```powershell
npm run build
```
Kết quả: Thư mục `dist` được tạo ra. Đây là tất cả những gì cần để chạy web.

---

## ☁️ 2. Deploy lên Vercel (Khuyên dùng)

Cách nhanh nhất để có link demo nộp bài.

1. Đẩy code lên GitHub.
2. Vào [Vercel.com](https://vercel.com) -> Login bằng GitHub.
3. Chọn "Add New Project" -> Chọn Repo `dnu-shop-client`.
4. Vercel tự nhận diện là Vue/Vite. Bấm **Deploy**.
5. Nhận link: `https://dnu-shop-client.vercel.app`.

---

## 🕸️ 3. Deploy lên Nginx (Server riêng)

Nếu deploy trên VPS (Ubuntu/CentOS):

1. Cài Nginx: `sudo apt install nginx`.
2. Copy thư mục `dist` lên server (VD: `/var/www/dnushop`).
3. Cấu hình Nginx (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name my-shop.com;

    location / {
        root /var/www/dnushop;
        index index.html;
        try_files $uri $uri/ /index.html; # Quan trọng cho SPA Router
    }
}
```

---

## 🎯 2. Case Study: Deploy Frontend lên Production

### Mô tả tình huống

Deploy website Vue lên production, tương tự như các website thực tế.

### Yêu cầu

- Build production với optimization
- Deploy lên Vercel/Netlify (miễn phí)
- Hoặc Deploy lên Nginx (VPS)
- Cấu hình environment variables
- Cấu hình routing (SPA)
- CDN và caching

### Implementation

**1. Build Configuration (`vite.config.js`):**
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Tắt sourcemap trong production
    minify: 'terser', // Minify code
    terserOptions: {
      compress: {
        drop_console: true, // Xóa console.log
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['vuetify'],
          'chart-vendor': ['chart.js', 'vue-chartjs']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

**2. Environment Variables (`.env.production`):**
```env
VITE_API_BASE_URL=https://api.dnushop.com
VITE_APP_NAME=DNUShop
VITE_APP_VERSION=1.0.0
```

**3. Axios Configuration (`utils/axios.js`):**
```javascript
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.dnushop.com'

const instance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000
})

export default instance
```

**4. Deploy lên Vercel (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**5. Deploy lên Netlify (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**6. Nginx Configuration (`nginx.conf`):**
```nginx
server {
    listen 80;
    server_name dnushop.com www.dnushop.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dnushop.com www.dnushop.com;
    
    # SSL Certificate
    ssl_certificate /etc/ssl/certs/dnushop.crt;
    ssl_certificate_key /etc/ssl/private/dnushop.key;
    
    # Root directory
    root /var/www/dnushop/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**7. Deploy Script (`deploy.sh`):**
```bash
#!/bin/bash

echo "Building production..."
npm run build

echo "Deploying to server..."
# Option 1: Vercel
# vercel --prod

# Option 2: Netlify
# netlify deploy --prod

# Option 3: Nginx (VPS)
rsync -avz --delete dist/ user@server:/var/www/dnushop/dist/

echo "Deploy completed!"
```

**8. GitHub Actions CI/CD (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Giải thích:**
- **Build**: Optimize code (minify, tree-shaking, code splitting)
- **Vercel/Netlify**: Deploy miễn phí, tự động SSL
- **Nginx**: Deploy trên VPS, full control
- **Caching**: Cache static assets để load nhanh
- **SPA Routing**: Redirect tất cả về index.html
- **CI/CD**: Tự động deploy khi push code

---

## 🧪 4. Thực hành

1. Build dự án ra thư mục `dist`.
2. Deploy lên Vercel để lấy link public.
3. Gửi link cho bạn bè test thử.

---

## ❌ 5. Các lỗi thường gặp

### Lỗi 1: 404 khi refresh trang
**❌ Vấn đề:** SPA route không hoạt động  
**✅ Giải pháp:** Cấu hình `try_files $uri $uri/ /index.html` trong Nginx.

### Lỗi 2: API calls fail sau deploy
**❌ Vấn đề:** CORS hoặc URL sai  
**✅ Giải pháp:** Update API baseURL, check CORS policy.

### Lỗi 3: Assets không load
**❌ Vấn đề:** Ảnh/CSS không hiển thị  
**✅ Giải pháp:** Kiểm tra base path, đảm bảo assets được copy vào dist.

---

## 💡 6. Best Practices

- Set correct base URL cho production
- Enable compression (gzip)
- Use CDN cho static assets
- Implement caching strategy
- Monitor với analytics
- Setup error tracking (Sentry)

---

## 📝 7. Bài tập thực hành

1. Deploy lên Netlify
2. Setup custom domain
3. Configure environment variables
4. Setup CI/CD
5. Implement PWA features

---

## 🧪 8. Mini Test

### Câu 1: SPA cần config gì đặc biệt?
<details>
<summary>Xem đáp án</summary>
Fallback về index.html cho mọi route (try_files).
</details>

### Câu 2: Vercel vs Nginx khác gì?
<details>
<summary>Xem đáp án</summary>
Vercel: managed service, dễ dùng. Nginx: tự quản lý, linh hoạt hơn.
</details>

---

## 📌 9. Quick Notes

### Build Command
```powershell
npm run build
```

### Nginx Config
```nginx
location / {
    root /var/www/dist;
    try_files $uri $uri/ /index.html;
}
```

### Vercel Deploy
- Push to GitHub
- Connect repo to Vercel
- Auto deploy on push