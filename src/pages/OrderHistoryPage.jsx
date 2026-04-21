import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ORDERS, formatPrice } from "../data/mockData";
import "./OrderHistoryPage.css";

// Orders.orderStatus mapping
const ORDER_STATUS = {
  PENDING:   { label: "Chờ xác nhận", color: "warn",      icon: "⏳" },
  CONFIRMED: { label: "Đã xác nhận",  color: "primary",   icon: "✅" },
  PACKING:   { label: "Đang đóng gói",color: "secondary", icon: "📦" },
  SHIPPING:  { label: "Đang giao",    color: "secondary", icon: "🚚" },
  DELIVERED: { label: "Đã giao",      color: "success",   icon: "🎉" },
  CANCELLED: { label: "Đã hủy",       color: "danger",    icon: "❌" },
};

// Shipments.shipmentStatus mapping (timeline)
const SHIPMENT_STEPS = (order) => [
  { label: "Đặt hàng",  done: true,                                       icon: "🛒" },
  { label: "Xác nhận",  done: order.orderStatus !== "PENDING",            icon: "✅" },
  { label: "Đóng gói",  done: ["PACKING","SHIPPING","DELIVERED"].includes(order.shipment?.shipmentStatus), icon: "📦" },
  { label: "Đang giao", done: ["SHIPPING","DELIVERED"].includes(order.shipment?.shipmentStatus),           icon: "🚚" },
  { label: "Đã giao",   done: order.shipment?.shipmentStatus === "DELIVERED",                             icon: "🎉" },
];

// Payments.paymentMethod label
const PAY_LABEL = {
  COD:     "💵 Tiền mặt khi nhận",
  BANKING: "🏦 Chuyển khoản",
  MOMO:    "💜 Ví MoMo",
  VNPAY:   "💳 VNPAY QR",
};

export default function OrderHistoryPage({ navigate }) {
  const { user } = useAuth();
  const [filter, setFilter]       = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  if (!user) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>Đăng nhập để xem đơn hàng</h3>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("login")}>Đăng nhập ngay</button>
      </div>
    );
  }

  // Lọc theo Orders.orderStatus
  const filtered = filter === "all"
    ? ORDERS
    : ORDERS.filter(o => o.orderStatus === filter);

  return (
    <div className="orders-page">
      <div className="orders-inner">
        <div className="orders-header">
          <h1 className="orders-title">📦 Đơn hàng của tôi</h1>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("profile")}>← Hồ sơ</button>
        </div>

        {/* Filter tabs theo Orders.orderStatus */}
        <div className="order-filter-tabs">
          {[
            { key: "all",       label: "Tất cả" },
            { key: "PENDING",   label: "⏳ Chờ xác nhận" },
            { key: "CONFIRMED", label: "✅ Đã xác nhận" },
            { key: "SHIPPING",  label: "🚚 Đang giao" },
            { key: "DELIVERED", label: "🎉 Đã giao" },
            { key: "CANCELLED", label: "❌ Đã hủy" },
          ].map(f => (
            <button key={f.key}
              className={`filter-tab ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >{f.label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📭</div>
            <h3>Không có đơn hàng nào</h3>
            <p>Bạn chưa có đơn hàng ở trạng thái này</p>
            <button className="btn btn-primary" onClick={() => navigate("products")}>🧸 Tiếp tục mua sắm</button>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map(order => {
              const status     = ORDER_STATUS[order.orderStatus] || ORDER_STATUS.PENDING;
              const isExpanded = expandedId === order.id;
              const steps      = SHIPMENT_STEPS(order);

              return (
                <div key={order.id} className="order-card">
                  <div className="order-header" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                    <div className="order-id-wrap">
                      <span className="order-icon">📦</span>
                      <div>
                        {/* Orders.orderCode */}
                        <div className="order-id">#{order.orderCode}</div>
                        <div className="order-date">{order.createdAt}</div>
                      </div>
                    </div>

                    <div className="order-status-wrap">
                      {/* Orders.orderStatus */}
                      <span className={`order-status status-${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>

                    <div className="order-total-wrap">
                      <div className="order-total-label">Tổng tiền</div>
                      {/* Orders.totalAmount */}
                      <div className="order-total">{formatPrice(order.totalAmount)}</div>
                    </div>

                    <div className="order-expand">{isExpanded ? "▲" : "▼"}</div>
                  </div>

                  {isExpanded && (
                    <div className="order-detail">
                      {/* Shipments timeline */}
                      <div className="order-timeline">
                        {steps.map((s, i, arr) => (
                          <div key={i} className={`tl-step ${s.done ? "done" : ""}`}>
                            <div className="tl-icon">{s.icon}</div>
                            <div className="tl-label">{s.label}</div>
                            {i < arr.length - 1 && <div className={`tl-line ${s.done ? "done" : ""}`} />}
                          </div>
                        ))}
                      </div>

                      {/* OrderItems — hiển thị snapshot fields */}
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="oi-row"
                            onClick={() => navigate("product-detail", { id: item._productId })}>
                            <div className="oi-img">{item._emoji}</div>
                            <div className="oi-info">
                              {/* OrderItems.productNameSnapshot */}
                              <div className="oi-name">{item.productNameSnapshot}</div>
                              {/* OrderItems.colorSnapshot + sizeSnapshot */}
                              <div style={{ fontSize:11, color:"var(--secondary-dark)", fontWeight:700 }}>
                                {item.colorSnapshot} · {item.sizeSnapshot}
                              </div>
                              <div className="oi-qty">× {item.quantity}</div>
                            </div>
                            {/* OrderItems.lineTotal */}
                            <div className="oi-price">{formatPrice(item.lineTotal)}</div>
                          </div>
                        ))}
                      </div>

                      {/* Payments info */}
                      <div style={{ padding:"10px 20px", fontSize:13, color:"var(--dark2)", background:"var(--light)", borderTop:"1px solid var(--border)" }}>
                        <strong>Thanh toán:</strong>{" "}
                        {PAY_LABEL[order.payment?.paymentMethod] || order.payment?.paymentMethod}
                        {" · "}
                        <span style={{ color: order.payment?.paymentStatus === "PAID" ? "var(--success)" : "var(--warn)" }}>
                          {order.payment?.paymentStatus === "PAID" ? "✅ Đã thanh toán" : "⏳ Chờ thanh toán"}
                        </span>
                      </div>

                      {/* Orders finance summary */}
                      <div style={{ padding:"10px 20px 14px", fontSize:12, color:"var(--gray)", display:"flex", gap:16, flexWrap:"wrap" }}>
                        <span>Tạm tính: {formatPrice(order.subtotal)}</span>
                        <span>Ship: {order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}</span>
                        {order.discountAmount > 0 && <span>Giảm: -{formatPrice(order.discountAmount)}</span>}
                        <strong>Tổng: {formatPrice(order.totalAmount)}</strong>
                      </div>

                      {/* Actions */}
                      <div className="order-actions">
                        {order.orderStatus === "DELIVERED" && (
                          <button className="btn btn-outline btn-sm"
                            onClick={() => navigate("product-detail", { id: order.items[0]._productId })}>
                            ⭐ Đánh giá sản phẩm
                          </button>
                        )}
                        {order.orderStatus === "DELIVERED" && (
                          <button className="btn btn-secondary btn-sm">🔄 Mua lại</button>
                        )}
                        {order.orderStatus === "PENDING" && (
                          <button className="btn btn-light btn-sm" style={{ color: "var(--danger)" }}>
                            ❌ Hủy đơn hàng
                          </button>
                        )}
                        <button className="btn btn-light btn-sm">📞 Liên hệ hỗ trợ</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
