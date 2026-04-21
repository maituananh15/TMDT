// ================================================================
// MOCK DATA — cấu trúc field khớp với DB schema
// ================================================================

// ── Categories (khớp bảng Categories) ──────────────────────────
export const CATEGORIES = [
  { id: 1, name: "Đồ chơi LEGO",           imageUrl: "🧱", parentId: null, active: true },
  { id: 2, name: "Xe & Phương tiện",        imageUrl: "🚗", parentId: null, active: true },
  { id: 3, name: "Búp bê & Thú nhồi bông", imageUrl: "🧸", parentId: null, active: true },
  { id: 4, name: "Đồ chơi giáo dục",       imageUrl: "📚", parentId: null, active: true },
  { id: 5, name: "Trò chơi board game",     imageUrl: "🎲", parentId: null, active: true },
  { id: 6, name: "Đồ chơi nước & ngoài trời", imageUrl: "🌊", parentId: null, active: true },
  { id: 7, name: "Robot & Công nghệ",       imageUrl: "🤖", parentId: null, active: true },
  { id: 8, name: "Nghệ thuật & Thủ công",   imageUrl: "🎨", parentId: null, active: true },
];

// ── Suppliers (khớp bảng Suppliers) ────────────────────────────
export const SUPPLIERS = [
  { id: 1, name: "LEGO Group",      contactPerson: "John Doe",   phone: "0901000001", active: true },
  { id: 2, name: "Dickie Toys VN",  contactPerson: "Trần A",     phone: "0901000002", active: true },
  { id: 3, name: "Mattel Vietnam",  contactPerson: "Nguyễn B",   phone: "0901000003", active: true },
  { id: 4, name: "EduToy Corp",     contactPerson: "Lê C",       phone: "0901000004", active: true },
  { id: 5, name: "Makeblock VN",    contactPerson: "Phạm D",     phone: "0901000005", active: true },
  { id: 6, name: "TeddyLand VN",    contactPerson: "Hoàng E",    phone: "0901000006", active: true },
];

// ── Products + ProductVariants + ProductImages (kết hợp để hiển thị) ──
// Products: id, name, description, brand, material, basePrice, status, categoryId, supplierId
// ProductVariants: id, productId, color, size, priceOverride, stockQuantity, active
// ProductImages: id, productId, imageUrl, thumbnail
export const PRODUCTS = [
  {
    // Products fields
    id: 1,
    name: "LEGO City Xe Cứu Hỏa 60280",
    description: "Bộ LEGO City Xe Cứu Hỏa với 316 mảnh ghép, gồm xe cứu hỏa, thang mở rộng và 3 nhân vật lính cứu hỏa. Phát triển tư duy sáng tạo và kỹ năng xây dựng.",
    brand: "LEGO",
    material: "Nhựa ABS cao cấp",
    basePrice: 850000,
    status: "ACTIVE",
    categoryId: 1,
    supplierId: 1,
    // ProductImages (thumbnail = true)
    images: ["🧱", "🏗️", "🚒"],
    // For display (computed from variants)
    rating: 4.8, reviewCount: 124, sold: 342,
    // ProductVariants[]
    variants: [
      { id: 101, productId: 1, color: "Đỏ-Vàng", size: "316 mảnh", priceOverride: 650000, stockQuantity: 15, active: true },
      { id: 102, productId: 1, color: "Đỏ-Vàng", size: "500 mảnh", priceOverride: 850000, stockQuantity: 8,  active: true },
    ],
  },
  {
    id: 2,
    name: "Xe Điều Khiển Từ Xa Địa Hình",
    description: "Xe địa hình điều khiển từ xa tốc độ cao với 4 bánh độc lập. Pin sạc USB, tốc độ max 15km/h, bán kính điều khiển 30m.",
    brand: "Dickie Toys",
    material: "Nhựa ABS + Kim loại",
    basePrice: 480000,
    status: "ACTIVE",
    categoryId: 2,
    supplierId: 2,
    images: ["🚗", "🏎️", "🔋"],
    rating: 4.6, reviewCount: 87, sold: 210,
    variants: [
      { id: 201, productId: 2, color: "Đỏ",  size: "1:16", priceOverride: 480000, stockQuantity: 8,  active: true },
      { id: 202, productId: 2, color: "Xanh", size: "1:16", priceOverride: 480000, stockQuantity: 5,  active: true },
      { id: 203, productId: 2, color: "Đen",  size: "1:12", priceOverride: 620000, stockQuantity: 3,  active: true },
    ],
  },
  {
    id: 3,
    name: "Búp Bê Barbie Thời Trang 2024",
    description: "Búp bê Barbie thời trang với trang phục có thể thay đổi, tóc dài có thể tạo kiểu. Bộ gồm búp bê + 3 bộ quần áo.",
    brand: "Barbie",
    material: "Nhựa ABS an toàn",
    basePrice: 400000,
    status: "ACTIVE",
    categoryId: 3,
    supplierId: 3,
    images: ["👗", "💄", "👠"],
    rating: 4.9, reviewCount: 256, sold: 891,
    variants: [
      { id: 301, productId: 3, color: "Hồng",  size: "30cm", priceOverride: 320000, stockQuantity: 30, active: true },
      { id: 302, productId: 3, color: "Trắng", size: "30cm", priceOverride: 320000, stockQuantity: 20, active: true },
    ],
  },
  {
    id: 4,
    name: "Bộ Ghép Hình IQ Builder 200 Mảnh",
    description: "Bộ ghép hình giáo dục 200 mảnh với hình ảnh bản đồ Việt Nam và các công trình nổi tiếng. Phát triển trí tuệ và kiên nhẫn.",
    brand: "EduToy",
    material: "Bìa cứng cao cấp",
    basePrice: 250000,
    status: "ACTIVE",
    categoryId: 4,
    supplierId: 4,
    images: ["🧩", "🗺️", "🏛️"],
    rating: 4.7, reviewCount: 93, sold: 445,
    variants: [
      { id: 401, productId: 4, color: "Nhiều màu", size: "200 mảnh", priceOverride: 195000, stockQuantity: 50, active: true },
      { id: 402, productId: 4, color: "Nhiều màu", size: "500 mảnh", priceOverride: 320000, stockQuantity: 25, active: true },
    ],
  },
  {
    id: 5,
    name: "Robot Thông Minh Coding Bot",
    description: "Robot lập trình đơn giản cho trẻ em học code qua game. Kết nối Bluetooth, điều khiển bằng app, 50+ thử thách lập trình.",
    brand: "Makeblock",
    material: "Nhựa ABS + Linh kiện điện tử",
    basePrice: 1100000,
    status: "ACTIVE",
    categoryId: 7,
    supplierId: 5,
    images: ["🤖", "📱", "💡"],
    rating: 4.5, reviewCount: 61, sold: 128,
    variants: [
      { id: 501, productId: 5, color: "Trắng-Xanh", size: "Standard", priceOverride: 890000, stockQuantity: 5, active: true },
    ],
  },
  {
    id: 6,
    name: "Thú Nhồi Bông Gấu Teddy Khổng Lồ",
    description: "Gấu Teddy nhồi bông siêu mềm kích thước 80cm. Chất liệu bông PP an toàn cho trẻ sơ sinh, vỏ ngoài cotton nhung cao cấp.",
    brand: "TeddyLand",
    material: "Bông PP + Cotton nhung",
    basePrice: 550000,
    status: "ACTIVE",
    categoryId: 3,
    supplierId: 6,
    images: ["🧸", "🤗", "❤️"],
    rating: 4.9, reviewCount: 312, sold: 1024,
    variants: [
      { id: 601, productId: 6, color: "Nâu Caramel", size: "80cm",  priceOverride: 550000, stockQuantity: 20, active: true },
      { id: 602, productId: 6, color: "Trắng",       size: "80cm",  priceOverride: 550000, stockQuantity: 12, active: true },
      { id: 603, productId: 6, color: "Nâu Caramel", size: "120cm", priceOverride: 890000, stockQuantity: 8,  active: true },
    ],
  },
  {
    id: 7,
    name: "Board Game Cờ Tỷ Phú Việt Nam",
    description: "Phiên bản Cờ Tỷ Phú chủ đề Việt Nam với 40 ô địa danh nổi tiếng, 200 thẻ Cơ hội & Ngân hàng. Chơi 2-6 người.",
    brand: "Doo",
    material: "Giấy cứng + Nhựa",
    basePrice: 350000,
    status: "ACTIVE",
    categoryId: 5,
    supplierId: 4,
    images: ["🎲", "🏙️", "💰"],
    rating: 4.6, reviewCount: 178, sold: 560,
    variants: [
      { id: 701, productId: 7, color: "Tiêu chuẩn", size: "Hộp lớn", priceOverride: 285000, stockQuantity: 40, active: true },
    ],
  },
  {
    id: 8,
    name: "Bộ Đất Nặn Play-Doh 24 Màu",
    description: "Bộ 24 hộp đất nặn màu sắc rực rỡ an toàn không độc hại. Phát triển sáng tạo và kỹ năng vận động tinh.",
    brand: "Play-Doh",
    material: "Đất nặn an toàn",
    basePrice: 280000,
    status: "ACTIVE",
    categoryId: 8,
    supplierId: 3,
    images: ["🎨", "🌈", "✨"],
    rating: 4.8, reviewCount: 203, sold: 678,
    variants: [
      { id: 801, productId: 8, color: "Nhiều màu", size: "24 hộp", priceOverride: 220000, stockQuantity: 60, active: true },
      { id: 802, productId: 8, color: "Nhiều màu", size: "48 hộp", priceOverride: 380000, stockQuantity: 30, active: true },
    ],
  },
];

// ── Reviews (khớp bảng Reviews) ─────────────────────────────────
// Reviews: id, productId, customerId, orderItemId, rating, comment, approved
export const REVIEWS = [
  {
    id: 1, productId: 1, customerId: 99,
    orderItemId: 1001,   // Reviews.orderItemId → OrderItems.id
    rating: 5, comment: "Sản phẩm tuyệt vời! Con tôi rất thích. Chất lượng đúng như mô tả, giao hàng nhanh.",
    approved: true, createdAt: "15/03/2025",
    // UI-only (join từ Users)
    _userName: "Nguyễn Thị Mai", _avatar: "👩", _helpful: 23,
  },
  {
    id: 2, productId: 1, customerId: 98,
    orderItemId: 1002,
    rating: 4, comment: "Chất lượng ổn, giá hợp lý. Sẽ mua lại lần sau.",
    approved: true, createdAt: "12/03/2025",
    _userName: "Trần Văn Hùng", _avatar: "👨", _helpful: 15,
  },
  {
    id: 3, productId: 1, customerId: 97,
    orderItemId: 1003,
    rating: 5, comment: "Mua cho bé 7 tuổi, bé ghép được luôn không cần hướng dẫn. Rất ấn tượng!",
    approved: true, createdAt: "08/03/2025",
    _userName: "Lê Thị Lan", _avatar: "👩‍💼", _helpful: 31,
  },
];

// ── Orders mock (khớp Orders + OrderItems + Payments + Shipments) ──
// Dùng cho OrderHistoryPage
export const ORDERS = [
  {
    // Orders fields
    id: 1,
    orderCode: "DH2025031501",
    customerId: 1,
    voucherId: null,
    shippingName: "Nguyễn Văn An",
    shippingAddress: "123 Lê Lợi, P.1, Q.1, TP.HCM",
    shippingPhone: "0901234567",
    orderStatus: "DELIVERED",      // Orders.orderStatus
    paymentStatus: "PAID",         // Orders.paymentStatus
    shippingStatus: "DELIVERED",   // Orders.shippingStatus
    subtotal: 1040000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 1040000,
    cancelReason: null,
    createdAt: "15/03/2025",
    // OrderItems[]
    items: [
      {
        id: 1001, orderId: 1, variantId: 101,
        productNameSnapshot: "LEGO City Xe Cứu Hỏa 60280",
        colorSnapshot: "Đỏ-Vàng", sizeSnapshot: "316 mảnh",
        unitPrice: 650000, quantity: 1, lineTotal: 650000,
        // UI helpers
        _emoji: "🧱", _productId: 1,
      },
      {
        id: 1002, orderId: 1, variantId: 401,
        productNameSnapshot: "Bộ Ghép Hình IQ Builder 200 Mảnh",
        colorSnapshot: "Nhiều màu", sizeSnapshot: "200 mảnh",
        unitPrice: 195000, quantity: 2, lineTotal: 390000,
        _emoji: "🧩", _productId: 4,
      },
    ],
    // Payments
    payment: {
      id: 1, orderId: 1, paymentMethod: "COD",
      paymentStatus: "PAID", amount: 1040000,
      providerName: null, paidAt: "15/03/2025",
    },
    // Shipments
    shipment: {
      id: 1, orderId: 1, deliveryStaffId: 10,
      shipmentStatus: "DELIVERED",
      assignedAt: "15/03/2025", shippedAt: "15/03/2025", deliveredAt: "15/03/2025",
    },
  },
  {
    id: 2,
    orderCode: "DH2025030802",
    customerId: 1,
    voucherId: null,
    shippingName: "Nguyễn Văn An",
    shippingAddress: "123 Lê Lợi, P.1, Q.1, TP.HCM",
    shippingPhone: "0901234567",
    orderStatus: "CONFIRMED",
    paymentStatus: "UNPAID",
    shippingStatus: "SHIPPING",
    subtotal: 890000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 890000,
    cancelReason: null,
    createdAt: "08/03/2025",
    items: [
      {
        id: 2001, orderId: 2, variantId: 501,
        productNameSnapshot: "Robot Thông Minh Coding Bot",
        colorSnapshot: "Trắng-Xanh", sizeSnapshot: "Standard",
        unitPrice: 890000, quantity: 1, lineTotal: 890000,
        _emoji: "🤖", _productId: 5,
      },
    ],
    payment: {
      id: 2, orderId: 2, paymentMethod: "BANKING",
      paymentStatus: "UNPAID", amount: 890000,
      providerName: "Vietcombank", paidAt: null,
    },
    shipment: {
      id: 2, orderId: 2, deliveryStaffId: 11,
      shipmentStatus: "SHIPPING",
      assignedAt: "08/03/2025", shippedAt: "09/03/2025", deliveredAt: null,
    },
  },
  {
    id: 3,
    orderCode: "DH2025022003",
    customerId: 1,
    voucherId: null,
    shippingName: "Nguyễn Văn An",
    shippingAddress: "123 Lê Lợi, P.1, Q.1, TP.HCM",
    shippingPhone: "0901234567",
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    shippingStatus: "DELIVERED",
    subtotal: 760000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 790000,
    cancelReason: null,
    createdAt: "20/02/2025",
    items: [
      {
        id: 3001, orderId: 3, variantId: 301,
        productNameSnapshot: "Búp Bê Barbie Thời Trang 2024",
        colorSnapshot: "Hồng", sizeSnapshot: "30cm",
        unitPrice: 320000, quantity: 1, lineTotal: 320000,
        _emoji: "👗", _productId: 3,
      },
      {
        id: 3002, orderId: 3, variantId: 801,
        productNameSnapshot: "Bộ Đất Nặn Play-Doh 24 Màu",
        colorSnapshot: "Nhiều màu", sizeSnapshot: "24 hộp",
        unitPrice: 220000, quantity: 2, lineTotal: 440000,
        _emoji: "🎨", _productId: 8,
      },
    ],
    payment: {
      id: 3, orderId: 3, paymentMethod: "MOMO",
      paymentStatus: "PAID", amount: 790000,
      providerName: "MoMo", paidAt: "20/02/2025",
    },
    shipment: {
      id: 3, orderId: 3, deliveryStaffId: 10,
      shipmentStatus: "DELIVERED",
      assignedAt: "20/02/2025", shippedAt: "20/02/2025", deliveredAt: "21/02/2025",
    },
  },
];

// ── LoyaltyAccounts mock ─────────────────────────────────────────
// LoyaltyAccounts: userId, currentPoints, lifetimeEarnedPoints, lifetimeSpentPoints
export const LOYALTY_ACCOUNT = {
  userId: 1,
  currentPoints: 1200,
  lifetimeEarnedPoints: 1300,
  lifetimeSpentPoints: 100,
};

// LoyaltyTransactions: id, userId, orderId, pointsChange, balanceAfter, type, note
export const LOYALTY_TRANSACTIONS = [
  { id: 1, userId: 1, orderId: 1, pointsChange: +65,  balanceAfter: 1265, type: "EARN",  note: "Mua hàng đơn DH2025031501", createdAt: "15/03/2025" },
  { id: 2, userId: 1, orderId: 2, pointsChange: +89,  balanceAfter: 1354, type: "EARN",  note: "Mua hàng đơn DH2025030802", createdAt: "08/03/2025" },
  { id: 3, userId: 1, orderId: null, pointsChange: -100, balanceAfter: 1254, type: "SPEND", note: "Đổi điểm giảm giá",        createdAt: "20/02/2025" },
  { id: 4, userId: 1, orderId: 3, pointsChange: +77,  balanceAfter: 1331, type: "EARN",  note: "Mua hàng đơn DH2025022003", createdAt: "20/02/2025" },
];

// ── AddressUsers mock ────────────────────────────────────────────
export const ADDRESS_USERS = [
  {
    id: 1, userId: 1,
    shipName: "Nguyễn Văn An",
    shipAddress: "123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh",
    shipEmail: "nguyenvanan@email.com",
    shipPhone: "0901234567",
    isDefault: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────────

// Lấy variant mặc định (giá thấp nhất, còn hàng)
export const getDefaultVariant = (product) =>
  product.variants
    .filter(v => v.active && v.stockQuantity > 0)
    .sort((a, b) => a.priceOverride - b.priceOverride)[0] || product.variants[0];

// Giá hiển thị (thấp nhất trong các variant còn hàng)
export const getDisplayPrice = (product) => {
  const v = getDefaultVariant(product);
  return v ? v.priceOverride : product.basePrice;
};

// Kiểm tra còn hàng
export const isInStock = (product) =>
  product.variants.some(v => v.active && v.stockQuantity > 0);

// Tổng tồn kho
export const getTotalStock = (product) =>
  product.variants.reduce((s, v) => s + v.stockQuantity, 0);

export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
