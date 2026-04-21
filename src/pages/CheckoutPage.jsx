import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../data/mockData";
import "./CheckoutPage.css";

const STEPS = ["Thông tin giao hàng", "Thanh toán", "Xác nhận"];

export default function CheckoutPage({ navigate }) {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep]         = useState(0);

  // Orders.shippingName/Address/Phone (từ AddressUsers hoặc nhập tay)
  const [form, setForm] = useState({
    shippingName:    user?.fullName  || "",
    shippingPhone:   user?.phone     || "",
    shippingEmail:   user?.email     || "",
    shippingAddress: "",
    city:            "Hà Nội",
    note:            "",
  });

  // Payments.paymentMethod
  const [payMethod, setPayMethod] = useState("COD");
  const [errors, setErrors]       = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Orders financial fields
  const shippingFee    = subtotal >= 300000 ? 0 : 30000;
  const discountAmount = 0;   // Orders.discountAmount (voucher)
  const totalAmount    = subtotal + shippingFee - discountAmount;

  const validate = () => {
    const e = {};
    if (!form.shippingName.trim())    e.shippingName    = "Vui lòng nhập họ tên";
    if (!form.shippingPhone.trim())   e.shippingPhone   = "Vui lòng nhập số điện thoại";
    else if (!/^0\d{9}$/.test(form.shippingPhone)) e.shippingPhone = "Số điện thoại không hợp lệ";
    if (!form.shippingEmail.trim())   e.shippingEmail   = "Vui lòng nhập email";
    if (!form.shippingAddress.trim()) e.shippingAddress = "Vui lòng nhập địa chỉ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validate()) return;
    setStep(s => s + 1);
  };

  const handlePlaceOrder = () => {
    // Mock tạo Orders + OrderItems + Payments
    const orderCode = "DH" + Date.now().toString().slice(-8);

    // OrderItems[] — snapshot tại thời điểm đặt hàng
    const orderItems = cart.map(item => ({
      variantId:           item.variantId,           // OrderItems.variantId
      productNameSnapshot: item.productName,          // OrderItems.productNameSnapshot
      colorSnapshot:       item.color,                // OrderItems.colorSnapshot
      sizeSnapshot:        item.size,                 // OrderItems.sizeSnapshot
      unitPrice:           item.unitPrice,            // OrderItems.unitPrice
      quantity:            item.quantity,             // OrderItems.quantity
      lineTotal:           item.unitPrice * item.quantity, // OrderItems.lineTotal
      _emoji: item.emoji,
    }));

    const order = {
      orderCode,
      customerId:      user?.id,
      voucherId:       null,                           // Orders.voucherId (chưa áp voucher)
      shippingName:    form.shippingName,
      shippingAddress: `${form.shippingAddress}, ${form.city}`,
      shippingPhone:   form.shippingPhone,
      orderStatus:     "PENDING",                      // Orders.orderStatus
      paymentStatus:   "UNPAID",                       // Orders.paymentStatus
      shippingStatus:  "NOT_SHIPPED",                  // Orders.shippingStatus
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      cancelReason:    null,
      items: orderItems,
      // Payments
      payment: {
        paymentMethod: payMethod,                      // Payments.paymentMethod
        paymentStatus: "UNPAID",                       // Payments.paymentStatus
        amount: totalAmount,
        providerName: payMethod === "MOMO" ? "MoMo"
          : payMethod === "BANKING" ? "Vietcombank"
          : payMethod === "VNPAY" ? "VNPAY"
          : null,
      },
    };

    setCreatedOrder(order);
    setOrderSuccess(true);
    clearCart();
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (orderSuccess && createdOrder) {
    return (
      <div className="checkout-page">
        <div className="checkout-inner">
          <div className="order-success">
            <div className="success-icon">🎉</div>
            <h2>Đặt hàng thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng tại ToyWorld. Đơn hàng đang được xử lý.</p>
            <div className="order-id">
              Mã đơn hàng: <strong>{createdOrder.orderCode}</strong>
            </div>
            {/* Trạng thái 3 chiều khớp DB */}
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", margin:"12px 0" }}>
              <span style={{ background:"#fff4e0", color:"#c96a00", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700 }}>
                ⏳ {createdOrder.orderStatus === "PENDING" ? "Chờ xác nhận" : createdOrder.orderStatus}
              </span>
              <span style={{ background:"#ffe8f0", color:"var(--danger)", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700 }}>
                💳 {createdOrder.paymentStatus === "UNPAID" ? "Chưa thanh toán" : createdOrder.paymentStatus}
              </span>
              <span style={{ background:"#e8f0ff", color:"#3a5bc7", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700 }}>
                📦 {createdOrder.shippingStatus === "NOT_SHIPPED" ? "Chưa giao" : createdOrder.shippingStatus}
              </span>
            </div>
            <p className="order-note">
              Chúng tôi sẽ gửi thông tin xác nhận đến <strong>{form.shippingEmail}</strong>
            </p>
            <div className="success-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("orders")}>Xem đơn hàng</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate("home")}>Về trang chủ</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1 className="checkout-title">💳 Thanh toán</h1>

        {/* Steps */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <div className="step-num">{i < step ? "✓" : i + 1}</div>
              <div className="step-label">{s}</div>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-panel">

            {/* Step 0: Orders.shippingName / shippingAddress / shippingPhone */}
            {step === 0 && (
              <div className="checkout-section">
                <h3>📍 Thông tin giao hàng</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input className={`form-input ${errors.shippingName ? "error" : ""}`}
                      placeholder="Nguyễn Văn A" value={form.shippingName}
                      onChange={e => update("shippingName", e.target.value)} />
                    {errors.shippingName && <div className="form-error">⚠️ {errors.shippingName}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input className={`form-input ${errors.shippingPhone ? "error" : ""}`}
                      placeholder="0901234567" value={form.shippingPhone}
                      onChange={e => update("shippingPhone", e.target.value)} />
                    {errors.shippingPhone && <div className="form-error">⚠️ {errors.shippingPhone}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className={`form-input ${errors.shippingEmail ? "error" : ""}`}
                    placeholder="email@example.com" value={form.shippingEmail}
                    onChange={e => update("shippingEmail", e.target.value)} />
                  {errors.shippingEmail && <div className="form-error">⚠️ {errors.shippingEmail}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Địa chỉ nhận hàng *</label>
                  <input className={`form-input ${errors.shippingAddress ? "error" : ""}`}
                    placeholder="Số nhà, tên đường, phường/xã" value={form.shippingAddress}
                    onChange={e => update("shippingAddress", e.target.value)} />
                  {errors.shippingAddress && <div className="form-error">⚠️ {errors.shippingAddress}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Tỉnh / Thành phố</label>
                  <select className="form-select" value={form.city} onChange={e => update("city", e.target.value)}>
                    {["Hà Nội","TP. Hồ Chí Minh","Đà Nẵng","Hải Phòng","Cần Thơ","An Giang","Bình Dương","Đồng Nai"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ghi chú (tùy chọn)</label>
                  <textarea className="form-input" rows={3} placeholder="Ghi chú cho người giao hàng..."
                    value={form.note} onChange={e => update("note", e.target.value)} style={{ resize: "none" }} />
                </div>
              </div>
            )}

            {/* Step 1: Payments.paymentMethod */}
            {step === 1 && (
              <div className="checkout-section">
                <h3>💳 Phương thức thanh toán</h3>
                <div className="pay-methods">
                  {[
                    { key: "COD",     icon: "💵", label: "Thanh toán khi nhận hàng (COD)", desc: "Trả tiền mặt khi nhận được hàng" },
                    { key: "BANKING", icon: "🏦", label: "Chuyển khoản ngân hàng",          desc: "Chuyển khoản qua tài khoản ngân hàng" },
                    { key: "MOMO",    icon: "💜", label: "Ví MoMo",                          desc: "Thanh toán qua ứng dụng MoMo" },
                    { key: "VNPAY",   icon: "💳", label: "VNPAY QR",                         desc: "Quét mã QR qua ứng dụng ngân hàng" },
                  ].map(m => (
                    <label key={m.key} className={`pay-method ${payMethod === m.key ? "selected" : ""}`}>
                      <input type="radio" name="pay" value={m.key}
                        checked={payMethod === m.key} onChange={() => setPayMethod(m.key)} />
                      <span className="pm-icon">{m.icon}</span>
                      <div>
                        <div className="pm-label">{m.label}</div>
                        <div className="pm-desc">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {payMethod === "BANKING" && (
                  <div className="bank-info">
                    <div className="bank-row"><span>Ngân hàng:</span><strong>Vietcombank</strong></div>
                    <div className="bank-row"><span>Số TK:</span><strong>1234567890</strong></div>
                    <div className="bank-row"><span>Chủ TK:</span><strong>CONG TY TOYWORLD</strong></div>
                    <div className="bank-row"><span>Nội dung CK:</span><strong>THANHTOAN {form.shippingPhone || "[SĐT]"}</strong></div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Xác nhận — hiển thị tất cả Orders + OrderItems snapshot */}
            {step === 2 && (
              <div className="checkout-section">
                <h3>✅ Xác nhận đơn hàng</h3>
                <div className="confirm-info">
                  <div className="confirm-block">
                    <h4>📍 Thông tin giao hàng</h4>
                    <p><strong>{form.shippingName}</strong> · {form.shippingPhone}</p>
                    <p>{form.shippingAddress}, {form.city}</p>
                    <p>{form.shippingEmail}</p>
                    {form.note && <p className="confirm-note">📝 {form.note}</p>}
                  </div>
                  <div className="confirm-block">
                    <h4>💳 Phương thức thanh toán</h4>
                    <p>{payMethod === "COD" ? "💵 Thanh toán khi nhận hàng"
                       : payMethod === "BANKING" ? "🏦 Chuyển khoản ngân hàng"
                       : payMethod === "MOMO" ? "💜 Ví MoMo"
                       : "💳 VNPAY QR"}</p>
                  </div>
                  <div className="confirm-block">
                    {/* OrderItems snapshot */}
                    <h4>🧸 Sản phẩm ({cart.length})</h4>
                    {cart.map(item => (
                      <div key={item.variantId} className="confirm-item">
                        <span>
                          {item.emoji} {item.productName}
                          <span style={{ color:"var(--gray)", fontSize:11 }}> ({item.color} / {item.size})</span>
                          × {item.quantity}
                        </span>
                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-nav">
              {step > 0 && (
                <button className="btn btn-light btn-lg" onClick={() => setStep(s => s - 1)}>← Quay lại</button>
              )}
              {step < 2 ? (
                <button className="btn btn-primary btn-lg" onClick={handleNext}>Tiếp theo →</button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder}>🎉 Đặt hàng ngay</button>
              )}
            </div>
          </div>

          {/* Order summary — Orders financial */}
          <div className="checkout-summary">
            <h3 className="summary-title">📦 Đơn hàng ({cart.length})</h3>
            <div className="co-items">
              {cart.map(item => (
                <div key={item.variantId} className="co-item">
                  <div className="co-img">{item.emoji}</div>
                  <div className="co-name">
                    {item.productName}
                    <div style={{ fontSize:10, color:"var(--secondary-dark)", fontWeight:700 }}>
                      {item.color} / {item.size}
                    </div>
                    <span className="co-qty">×{item.quantity}</span>
                  </div>
                  <div className="co-price">{formatPrice(item.unitPrice * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="co-totals">
              <div className="co-row"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
              <div className="co-row">
                <span>Vận chuyển</span>
                <span className={shippingFee === 0 ? "free-ship" : ""}>
                  {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="co-total">
                <span>Tổng</span>
                <span className="total-amount">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
