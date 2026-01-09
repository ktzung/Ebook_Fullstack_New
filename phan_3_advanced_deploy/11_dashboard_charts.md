# 🟨 TUẦN 11: DASHBOARD & CHARTS

## 🎯 Mục tiêu
- Viết API thống kê (Tổng doanh thu, số đơn hàng).
- Vẽ biểu đồ cột/tròn bằng Chart.js trên Vue.

---

## 📈 1. Backend: Statistics API

### 🎬 Ví dụ dẫn nhập: Dashboard thống kê

Hãy tưởng tượng bạn đang xây dựng **Dashboard** cho Admin, tương tự như **Shopee Seller Center**:

**Tình huống thực tế:**
- Admin cần xem: Tổng doanh thu hôm nay, tuần này, tháng này
- Admin cần xem: Số đơn hàng, số khách hàng mới
- Admin cần xem: Top 10 sản phẩm bán chạy nhất
- Admin cần xem: Biểu đồ doanh thu theo tháng
- Admin cần xem: Biểu đồ phân bố đơn hàng theo trạng thái

**Vấn đề:**
- Làm sao tính toán các số liệu này?
- Làm sao trả về dữ liệu phù hợp để vẽ biểu đồ?
- Làm sao tối ưu performance khi có nhiều dữ liệu?

**Giải pháp:**
- Backend: Viết API thống kê với aggregate queries
- Frontend: Dùng Chart.js để vẽ biểu đồ

Ta cần API trả về dữ liệu dạng số liệu để vẽ biểu đồ.

### 🌐 Liên hệ thực tế

**Dashboard và Charts được dùng ở mọi nơi:**
- **Shopee Seller Center**: Dashboard doanh thu, biểu đồ bán hàng
- **Facebook Analytics**: Dashboard lượt xem, biểu đồ tăng trưởng
- **Banking App**: Dashboard số dư, biểu đồ chi tiêu
- **E-commerce**: Dashboard đơn hàng, biểu đồ sản phẩm bán chạy

**Tất cả đều cần Statistics API và Charts!**

```csharp
[HttpGet("stats")]
public async Task<IActionResult> GetStats()
{
    var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);
    var totalOrders = await _context.Orders.CountAsync();
    var topProducts = await _context.OrderItems
        .GroupBy(x => x.ProductName)
        .Select(g => new { Name = g.Key, Count = g.Sum(x => x.Quantity) })
        .Take(5)
        .ToListAsync();

    return Ok(new { totalRevenue, totalOrders, topProducts });
}
```

---

## 📊 2. Frontend: Chart.js

### 2.1. Cài đặt
```powershell
npm install chart.js vue-chartjs
```

### 2.2. Tạo Component Biểu đồ (`components/RevenueChart.vue`)

```html
<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
  datasets: [
    { label: 'Doanh thu', backgroundColor: '#f87979', data: [40, 20, 12] }
  ]
}
</script>

<template>
  <Bar :data="chartData" />
</template>
```

---

## 🧪 3. Thực hành

1. Viết API thống kê đơn giản.
2. Tạo trang `DashboardPage.vue`.
3. Nhúng biểu đồ doanh thu vào Dashboard.
4. Hiển thị các thẻ số liệu (Cards) ở trên cùng: "Tổng thu nhập: 100tr", "Đơn hàng: 50".

---

## 🎯 3. Case Study: Xây dựng Dashboard hoàn chỉnh

### Mô tả tình huống

Xây dựng Dashboard thống kê cho Admin, tương tự như **Shopee Seller Center**, với đầy đủ biểu đồ và số liệu.

### Yêu cầu

- Stat Cards: Tổng doanh thu, Số đơn hàng, Số khách hàng, Số sản phẩm
- Biểu đồ cột: Doanh thu theo tháng
- Biểu đồ tròn: Phân bố đơn hàng theo trạng thái
- Biểu đồ đường: Tăng trưởng đơn hàng
- Top sản phẩm bán chạy
- Real-time updates

### Implementation

**1. Backend - Statistics API (`Controllers/StatisticsController.cs`):**
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class StatisticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    [HttpGet("overview")]
    public async Task<ActionResult<OverviewStatsDto>> GetOverview(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var start = startDate ?? DateTime.Now.AddMonths(-1);
        var end = endDate ?? DateTime.Now;

        var totalRevenue = await _context.Orders
            .Where(o => o.OrderDate >= start && o.OrderDate <= end && o.Status == "Completed")
            .SumAsync(o => o.TotalAmount);

        var totalOrders = await _context.Orders
            .Where(o => o.OrderDate >= start && o.OrderDate <= end)
            .CountAsync();

        var newCustomers = await _context.Users
            .Where(u => u.CreatedDate >= start && u.CreatedDate <= end)
            .CountAsync();

        var totalProducts = await _context.Products
            .Where(p => !p.IsDeleted)
            .CountAsync();

        return Ok(new OverviewStatsDto
        {
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            NewCustomers = newCustomers,
            TotalProducts = totalProducts
        });
    }

    [HttpGet("revenue-by-month")]
    public async Task<ActionResult<List<RevenueByMonthDto>>> GetRevenueByMonth(
        [FromQuery] int months = 6)
    {
        var startDate = DateTime.Now.AddMonths(-months);
        
        var revenue = await _context.Orders
            .Where(o => o.OrderDate >= startDate && o.Status == "Completed")
            .GroupBy(o => new { 
                Year = o.OrderDate.Year, 
                Month = o.OrderDate.Month 
            })
            .Select(g => new RevenueByMonthDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Revenue = g.Sum(o => o.TotalAmount),
                OrderCount = g.Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        return Ok(revenue);
    }

    [HttpGet("orders-by-status")]
    public async Task<ActionResult<List<OrderStatusDto>>> GetOrdersByStatus()
    {
        var orders = await _context.Orders
            .GroupBy(o => o.Status)
            .Select(g => new OrderStatusDto
            {
                Status = g.Key,
                Count = g.Count(),
                TotalAmount = g.Sum(o => o.TotalAmount)
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("top-products")]
    public async Task<ActionResult<List<TopProductDto>>> GetTopProducts(
        [FromQuery] int limit = 10)
    {
        var topProducts = await _context.OrderItems
            .GroupBy(oi => new { oi.ProductId, oi.ProductName })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                TotalSold = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity)
            })
            .OrderByDescending(x => x.TotalSold)
            .Take(limit)
            .ToListAsync();

        return Ok(topProducts);
    }
}

// DTOs
public class OverviewStatsDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int NewCustomers { get; set; }
    public int TotalProducts { get; set; }
}

public class RevenueByMonthDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

public class OrderStatusDto
{
    public string Status { get; set; }
    public int Count { get; set; }
    public decimal TotalAmount { get; set; }
}

public class TopProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public int TotalSold { get; set; }
    public decimal TotalRevenue { get; set; }
}
```

**2. Frontend - Dashboard Page (`views/admin/DashboardPage.vue`):**
```vue
<template>
  <v-container>
    <h1 class="mb-6">Dashboard</h1>
    
    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card revenue">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="success" class="mr-4">mdi-cash</v-icon>
              <div>
                <div class="text-h6">{{ formatPrice(stats.totalRevenue) }} đ</div>
                <div class="text-caption">Tổng doanh thu</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card orders">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="primary" class="mr-4">mdi-cart</v-icon>
              <div>
                <div class="text-h6">{{ stats.totalOrders }}</div>
                <div class="text-caption">Tổng đơn hàng</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card customers">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="info" class="mr-4">mdi-account-group</v-icon>
              <div>
                <div class="text-h6">{{ stats.newCustomers }}</div>
                <div class="text-caption">Khách hàng mới</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card products">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="warning" class="mr-4">mdi-package-variant</v-icon>
              <div>
                <div class="text-h6">{{ stats.totalProducts }}</div>
                <div class="text-caption">Tổng sản phẩm</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Charts -->
    <v-row>
      <!-- Revenue Chart -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Doanh thu theo tháng</v-card-title>
          <v-card-text>
            <RevenueChart :data="revenueData" />
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Order Status Chart -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Đơn hàng theo trạng thái</v-card-title>
          <v-card-text>
            <OrderStatusChart :data="orderStatusData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Top Products -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Top 10 sản phẩm bán chạy</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng bán</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in topProducts" :key="product.productId">
                  <td>{{ index + 1 }}</td>
                  <td>{{ product.productName }}</td>
                  <td>{{ product.totalSold }}</td>
                  <td>{{ formatPrice(product.totalRevenue) }} đ</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import statisticsService from '@/services/statisticsService'
import RevenueChart from '@/components/RevenueChart.vue'
import OrderStatusChart from '@/components/OrderStatusChart.vue'

const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  newCustomers: 0,
  totalProducts: 0
})

const revenueData = ref([])
const orderStatusData = ref([])
const topProducts = ref([])

async function loadDashboard() {
  try {
    // Load overview stats
    const overview = await statisticsService.getOverview()
    stats.value = overview
    
    // Load revenue by month
    revenueData.value = await statisticsService.getRevenueByMonth(6)
    
    // Load orders by status
    orderStatusData.value = await statisticsService.getOrdersByStatus()
    
    // Load top products
    topProducts.value = await statisticsService.getTopProducts(10)
  } catch (error) {
    console.error('Error loading dashboard:', error)
  }
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN')
}

onMounted(() => {
  loadDashboard()
  
  // Auto refresh mỗi 5 phút
  setInterval(() => {
    loadDashboard()
  }, 5 * 60 * 1000)
})
</script>
```

**3. Chart Components (`components/RevenueChart.vue`):**
```vue
<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  data: Array
})

const chartData = computed(() => {
  return {
    labels: props.data.map(d => `Tháng ${d.month}/${d.year}`),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        backgroundColor: '#42b983',
        data: props.data.map(d => d.revenue)
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.parsed.y.toLocaleString('vi-VN')} đ`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return `${value.toLocaleString('vi-VN')} đ`
        }
      }
    }
  }
}
</script>
```

**Giải thích:**
- **Backend**: Aggregate queries để tính toán hiệu quả
- **Frontend**: Chart.js để vẽ biểu đồ đẹp
- **Real-time**: Auto refresh để cập nhật số liệu
- **Responsive**: Charts responsive trên mọi thiết bị

---

## ❌ 4. Các lỗi thường gặp

### Lỗi 1: Chart không hiển thị
**❌ Vấn đề:** Biểu đồ trống  
**✅ Giải pháp:** Kiểm tra data format, đảm bảo register đúng Chart.js components.

### Lỗi 2: Performance chậm với nhiều data
**❌ Vấn đề:** Dashboard load chậm  
**✅ Giải pháp:** Paginate data, cache kết quả, lazy load charts.

### Lỗi 3: Responsive không tốt
**❌ Vấn đề:** Chart bị vỡ trên mobile  
**✅ Giải pháp:** Set `responsive: true` và `maintainAspectRatio: false`.

---

## 💡 5. Best Practices

- Cache statistics data
- Use real-time updates nếu cần
- Optimize queries với indexes
- Show loading state
- Handle empty data gracefully

---

## 📝 6. Bài tập thực hành

1. Tạo multiple charts (line, bar, pie)
2. Thêm date range filter
3. Export chart as image
4. Real-time updates với SignalR
5. Drill-down charts

---

## 🧪 7. Mini Test

### Câu 1: Chart.js cần register components không?
<details>
<summary>Xem đáp án</summary>
Có, phải register các components cần dùng (Bar, Line, Pie, etc).
</details>

### Câu 2: Làm sao optimize statistics query?
<details>
<summary>Xem đáp án</summary>
Dùng indexes, cache, aggregate queries, limit data range.
</details>

---

## 📌 8. Quick Notes

### Chart.js Setup
```javascript
import { Bar } from 'vue-chartjs'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
```

### Statistics API
```csharp
[HttpGet("stats")]
public async Task<IActionResult> GetStats() {
    var revenue = await _context.Orders.SumAsync(o => o.TotalAmount);
    return Ok(new { revenue });
}
```