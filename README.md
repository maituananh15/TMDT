# 🧸 ToyWorld — Frontend React (Phía Người Xem)

Website bán đồ chơi trẻ em, xây dựng bằng **React + Vite**, thiết kế theo mockup tài liệu nhóm 2.

---

## 📁 Cấu trúc dự án

```
ToyShop_FE/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  ← Entry point
    ├── App.jsx                   ← Router chính (SPA)
    ├── styles/
    │   └── globals.css           ← Design system, biến CSS, utilities
    ├── context/
    │   ├── CartContext.jsx       ← State giỏ hàng toàn cục
    │   └── AuthContext.jsx       ← State đăng nhập toàn cục
    ├── data/
    │   └── mockData.js           ← Dữ liệu giả (sản phẩm, đơn hàng, đánh giá)
    ├── components/
    │   ├── Header.jsx / .css     ← Thanh điều hướng cố định
    │   ├── Footer.jsx / .css     ← Footer
    │   └── ProductCard.jsx / .css← Card sản phẩm dùng chung
    └── pages/
        ├── HomePage.jsx / .css         ← Trang chủ
        ├── ProductListPage.jsx / .css  ← Danh sách & lọc sản phẩm
        ├── ProductDetailPage.jsx / .css← Chi tiết sản phẩm + đánh giá
        ├── CartPage.jsx / .css         ← Giỏ hàng
        ├── CheckoutPage.jsx / .css     ← Thanh toán 3 bước
        ├── LoginPage.jsx               ← Đăng nhập
        ├── RegisterPage.jsx            ← Đăng ký
        ├── AuthPages.css               ← CSS dùng chung cho auth
        ├── ProfilePage.jsx / .css      ← Hồ sơ cá nhân + tích điểm
        └── OrderHistoryPage.jsx / .css ← Lịch sử đơn hàng
```

---

## 🚀 Cài đặt & Chạy

```bash
# 1. Di chuyển vào thư mục
cd ToyShop_FE

# 2. Cài dependencies
npm install

# 3. Chạy development server
npm run dev
# → Mở http://localhost:5173
```

---

## 🎨 Design System

| Token | Giá trị |
|-------|---------|
| `--primary` | `#FF6B35` (Cam đỏ) |
| `--secondary` | `#4ECDC4` (Teal) |
| `--accent` | `#FFE66D` (Vàng) |
| `--dark` | `#2C2C54` (Tím đêm) |
| Font display | Baloo 2 (tiêu đề) |
| Font body | Nunito (nội dung) |

---

## 📄 Trang đã hoàn thiện

| Trang | Mô tả | Usecase tương ứng |
|-------|-------|-------------------|
| 🏠 Trang chủ | Hero, danh mục, sản phẩm nổi bật, flash sale, tích điểm | Xem danh sách sản phẩm |
| 📋 Danh sách sản phẩm | Lọc theo danh mục, giá, tìm kiếm, sắp xếp, 2 view mode | Xem & tìm kiếm sản phẩm |
| 🔍 Chi tiết sản phẩm | Gallery, thông số, đánh giá, sản phẩm liên quan | Xem đánh giá & bình luận |
| 🛒 Giỏ hàng | Cập nhật số lượng, xóa, tính tổng, voucher | Thêm vào giỏ hàng |
| 💳 Thanh toán | 3 bước: địa chỉ → thanh toán → xác nhận | Đặt hàng & thanh toán |
| 🔑 Đăng nhập | Validate form, xử lý lỗi | Đăng nhập |
| 📝 Đăng ký | Validate đầy đủ, strength meter | Đăng ký tài khoản |
| 👤 Hồ sơ cá nhân | Thông tin, địa chỉ, đổi mật khẩu, điểm thưởng | Quản lý tài khoản cá nhân |
| 📦 Lịch sử đơn hàng | Timeline trạng thái, lọc theo tình trạng | Xem lịch sử mua hàng |

---

## 🔌 Kết nối Backend

Thay thế dữ liệu mock trong `src/data/mockData.js` bằng API calls thực tế.

Ví dụ:
```js
// Thay vì dùng PRODUCTS từ mockData.js
// Gọi API:
const res = await fetch('/api/products');
const products = await res.json();
```

Context files (`CartContext.jsx`, `AuthContext.jsx`) cần cập nhật để gọi API thực tế thay vì mock logic.

---

## 📝 Lưu ý

- Đây là **frontend-only**, chưa kết nối backend thực
- Dữ liệu mock hoàn toàn trong `src/data/mockData.js`
- Đăng nhập demo: nhập **bất kỳ email + password** để vào
- Responsive cho mobile/tablet/desktop
