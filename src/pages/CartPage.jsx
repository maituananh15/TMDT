import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../data/mockData";
import "./CartPage.css";

export default function CartPage({ navigate }) {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Orders.shippingFee / discountAmount / totalAmount
  const shippingFee    = subtotal >= 300000 ? 0 : 30000;
  const discountAmount = 0;
  const totalAmount    = subtotal + shippingFee - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-inner">
          <div className="empty-state">
            <div className="emoji">🛒</div>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy thêm sản phẩm yêu thích vào giỏ hàng để tiếp tục mua sắm</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("products")}>
              🧸 Khám phá sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <div className="cart-header">
          <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>
          <span className="cart-count">{cart.length} sản phẩm</span>
        </div>

        <div className="cart-layout">
          {/* CartItems */}
          <div className="cart-items">
            <div className="cart-items-header">
              <button className="clear-all-btn" onClick={clearCart}>🗑️ Xóa tất cả</button>
            </div>

            {cart.map(item => (
              <div key={item.variantId} className="cart-item">
                <div className="ci-img">{item.emoji}</div>
                <div className="ci-body">
                  {/* Tên thương hiệu giữ nguyên như gốc */}
                  <div className="ci-brand">{item.productName}</div>
                  {/* Tên sản phẩm + phân loại (màu · size) */}
                  <h3 className="ci-name" onClick={() => navigate("products")}>
                    {item.productName}
                  </h3>
                  {/* Phân loại variant — thêm mới so với gốc */}
                  <div className="ci-variant">{item.color} · {item.size}</div>
                  <div className="ci-price-mobile">{formatPrice(item.unitPrice)}</div>
                </div>
                <div className="ci-qty">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                </div>
                {/* lineTotal = unitPrice × quantity */}
                <div className="ci-price">{formatPrice(item.unitPrice * item.quantity)}</div>
                <button className="ci-remove" onClick={() => removeFromCart(item.variantId)} title="Xóa">✕</button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3 className="summary-title">📋 Tóm tắt đơn hàng</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className={shippingFee === 0 ? "free-ship" : ""}>
                  {shippingFee === 0 ? "🎉 Miễn phí" : formatPrice(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <div className="ship-notice">
                  Mua thêm <strong>{formatPrice(300000 - subtotal)}</strong> để được miễn phí vận chuyển
                </div>
              )}
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Voucher — giữ nguyên như gốc */}
            <div className="voucher-row">
              <input className="form-input" placeholder="Mã voucher / giảm giá" />
              <button className="btn btn-outline btn-sm">Áp dụng</button>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span className="total-amount">{formatPrice(totalAmount)}</span>
            </div>

            <button
              className="btn btn-primary btn-lg btn-full checkout-btn"
              onClick={() => user ? navigate("checkout") : navigate("login")}
            >
              {user ? "⚡ Tiến hành thanh toán" : "🔑 Đăng nhập để thanh toán"}
            </button>

            <button className="btn btn-light btn-full continue-btn" onClick={() => navigate("products")}>
              ← Tiếp tục mua sắm
            </button>

            <div className="secure-badges">
              <span>🔒 Thanh toán bảo mật</span>
              <span>💳 Nhiều hình thức thanh toán</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
