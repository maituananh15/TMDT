import { useState } from "react";
import { PRODUCTS, REVIEWS, formatPrice } from "../data/mockData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetailPage.css";

function StarRating({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-input">
      {[1,2,3,4,5].map(i => (
        <button key={i}
          className={`star-btn ${i <= (hover || rating) ? "filled" : ""}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >★</button>
      ))}
    </div>
  );
}

export default function ProductDetailPage({ navigate, product }) {
  const p = product || PRODUCTS[0];
  const { addToCart } = useCart();
  const { user } = useAuth();

  // ProductVariants — chọn variant đầu tiên còn hàng
  const activeVariants = p.variants.filter(v => v.active);
  const [selectedVariant, setSelectedVariant] = useState(
    activeVariants.find(v => v.stockQuantity > 0) || activeVariants[0]
  );
  const [qty, setQty]             = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const [toast, setToast]         = useState(null);

  // Reviews (productId, customerId, orderItemId, rating, comment, approved)
  const [reviews, setReviews] = useState(() => {
    const r = REVIEWS.filter(r => r.productId === p.id);
    return r.length > 0 ? r : REVIEWS.slice(0, 3);
  });
  const [reviewText, setReviewText]     = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Sản phẩm liên quan — cùng categoryId (DB: Categories.id → Products.categoryId)
  const relatedProducts = PRODUCTS
    .filter(r => r.id !== p.id && r.categoryId === p.categoryId)
    .slice(0, 4);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(p, selectedVariant, qty);
    showToast(`Đã thêm ${qty} "${p.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(p, selectedVariant, qty);
    navigate("cart");
  };

  const handleSubmitReview = () => {
    if (!user) { navigate("login"); return; }
    if (!reviewText.trim()) return;
    const newReview = {
      id: Date.now(),
      productId:   p.id,
      customerId:  user.id,
      orderItemId: null,
      rating:      reviewRating,
      comment:     reviewText,
      approved:    true,
      createdAt:   new Date().toLocaleDateString("vi-VN"),
      _userName: user.fullName,
      _avatar:   user.avatar,
      _helpful:  0,
    };
    setReviews(prev => [newReview, ...prev]);
    setReviewText(""); setReviewRating(5);
    showToast("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : p.rating;

  // Giá & discount theo variant đang chọn
  const displayPrice = selectedVariant?.priceOverride ?? p.basePrice;
  const hasDiscount  = p.basePrice > displayPrice;
  const discountPct  = hasDiscount
    ? Math.round((1 - displayPrice / p.basePrice) * 100)
    : null;

  // Tổng tồn kho của product (để hiển thị meta-tag)
  const totalStock = p.variants.reduce((s, v) => s + v.stockQuantity, 0);
  const inStock    = selectedVariant && selectedVariant.stockQuantity > 0;

  return (
    <div className="pdp-page">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === "success" ? "✅" : "ℹ️"} {toast.msg}
          </div>
        </div>
      )}

      <div className="pdp-inner">
        {/* Breadcrumb — giống gốc */}
        <div className="breadcrumb">
          <button onClick={() => navigate("home")}>🏠 Trang chủ</button>
          <span>›</span>
          <button onClick={() => navigate("products")}>Sản phẩm</button>
          <span>›</span>
          <button onClick={() => navigate("products")}>{p.brand}</button>
          <span>›</span>
          <span>{p.name}</span>
        </div>

        {/* Main */}
        <div className="pdp-main">
          {/* Gallery — ProductImages */}
          <div className="pdp-gallery">
            <div className="pdp-main-img">
              <div className="pdp-emoji">{p.images[0]}</div>
              {discountPct && <span className="pdp-badge">-{discountPct}%</span>}
            </div>
            {/* Thumbnails — giữ nguyên như gốc */}
            <div className="pdp-thumbnails">
              {p.images.map((img, i) => (
                <div key={i} className={`pdp-thumb ${i === 0 ? "active" : ""}`}>{img}</div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp-brand">{p.brand}</div>
            <h1 className="pdp-name">{p.name}</h1>

            <div className="pdp-rating-row">
              <div className="stars">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`star ${i <= Math.round(Number(avgRating)) ? "" : "empty"}`}>★</span>
                ))}
              </div>
              <span className="pdp-avg">{avgRating}</span>
              <span className="pdp-review-count">({reviews.length} đánh giá)</span>
              <span className="pdp-sold">• Đã bán {p.sold.toLocaleString()}</span>
            </div>

            {/* Giá theo variant đang chọn (ProductVariants.priceOverride) */}
            <div className="pdp-price-block">
              <span className="pdp-price">{formatPrice(displayPrice)}</span>
              {hasDiscount && (
                <span className="pdp-price-old">{formatPrice(p.basePrice)}</span>
              )}
              {discountPct && <span className="pdp-discount-badge">-{discountPct}%</span>}
            </div>

            {/* Meta tags — giữ nguyên phong cách gốc, dùng data từ DB */}
            <div className="pdp-meta-tags">
              <span className="meta-tag">🏭 {p.brand}</span>
              <span className="meta-tag">🧱 {p.material}</span>
              {selectedVariant
                ? <span className="meta-tag">📦 Còn {selectedVariant.stockQuantity} sản phẩm</span>
                : <span className="meta-tag">📦 Còn {totalStock} sản phẩm</span>
              }
            </div>

            {/* Chọn Variant — THÊM MỚI (ProductVariants selector) */}
            {activeVariants.length > 1 && (
              <div className="variant-selector">
                <div className="variant-label">Chọn phân loại:</div>
                <div className="variant-options">
                  {activeVariants.map(v => (
                    <button
                      key={v.id}
                      className={`variant-btn ${selectedVariant?.id === v.id ? "selected" : ""} ${v.stockQuantity === 0 ? "oos" : ""}`}
                      onClick={() => { setSelectedVariant(v); setQty(1); }}
                      disabled={v.stockQuantity === 0}
                    >
                      <div className="vb-color">{v.color}</div>
                      <div className="vb-size">{v.size}</div>
                      <div className="vb-price">{formatPrice(v.priceOverride)}</div>
                      {v.stockQuantity === 0 && <div className="vb-oos">Hết hàng</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Số lượng — giống gốc */}
            <div className="pdp-qty-row">
              <label>Số lượng:</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(selectedVariant?.stockQuantity || 1, q + 1))}>+</button>
              </div>
              <span className="stock-note">
                Còn {selectedVariant?.stockQuantity ?? totalStock} trong kho
              </span>
            </div>

            {/* CTA — giống gốc */}
            <div className="pdp-cta">
              <button className="btn btn-secondary btn-lg" onClick={handleAddToCart} disabled={!inStock}>
                🛒 Thêm vào giỏ hàng
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={!inStock}>
                ⚡ Mua ngay
              </button>
            </div>

            <div className="pdp-shipping">
              <div className="shipping-row"><span>🚚</span><span>Giao hàng nhanh 2-4h nội thành</span></div>
              <div className="shipping-row"><span>↩️</span><span>Đổi trả miễn phí trong 30 ngày</span></div>
              <div className="shipping-row"><span>🔒</span><span>Sản phẩm được kiểm định an toàn</span></div>
            </div>
          </div>
        </div>

        {/* Tabs — giữ nguyên 3 tab như gốc */}
        <div className="pdp-tabs-section">
          <div className="pdp-tabs">
            {[
              { key: "desc",    label: "📋 Mô tả" },
              { key: "specs",   label: "📊 Thông số" },
              { key: "reviews", label: `⭐ Đánh giá (${reviews.length})` },
            ].map(tab => (
              <button key={tab.key}
                className={`pdp-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >{tab.label}</button>
            ))}
          </div>

          <div className="pdp-tab-content">
            {/* Tab Mô tả — giữ nguyên như gốc */}
            {activeTab === "desc" && (
              <div className="tab-desc">
                <p>{p.description}</p>
                <div className="desc-tags">
                  <span className="desc-tag">#{p.brand}</span>
                  <span className="desc-tag">#{p.material}</span>
                </div>
              </div>
            )}

            {/* Tab Thông số — dùng ProductVariants thay cho specs object */}
            {activeTab === "specs" && (
              <div className="tab-specs">
                <table className="specs-table">
                  <tbody>
                    <tr><td className="spec-key">Thương hiệu</td><td className="spec-val">{p.brand}</td></tr>
                    <tr><td className="spec-key">Chất liệu</td><td className="spec-val">{p.material}</td></tr>
                    <tr><td className="spec-key">Giá niêm yết</td><td className="spec-val">{formatPrice(p.basePrice)}</td></tr>
                    {activeVariants.map(v => (
                      <tr key={v.id}>
                        <td className="spec-key">{v.color} / {v.size}</td>
                        <td className="spec-val">{formatPrice(v.priceOverride)} · Còn {v.stockQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab Đánh giá — giữ nguyên như gốc */}
            {activeTab === "reviews" && (
              <div className="tab-reviews">
                <div className="rating-summary">
                  <div className="rating-big">
                    <div className="rating-num">{avgRating}</div>
                    <div className="stars">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`star ${i <= Math.round(Number(avgRating)) ? "" : "empty"}`}>★</span>
                      ))}
                    </div>
                    <div className="rating-total">{reviews.length} đánh giá</div>
                  </div>
                </div>

                <div className="write-review">
                  <h4>✍️ Viết đánh giá của bạn</h4>
                  {!user && (
                    <p className="login-prompt">
                      <button className="btn-link" onClick={() => navigate("login")}>Đăng nhập</button> để viết đánh giá
                    </p>
                  )}
                  <div className="review-rating-row">
                    <span>Đánh giá:</span>
                    <StarRating rating={reviewRating} onChange={setReviewRating} />
                  </div>
                  <textarea className="form-input review-textarea"
                    placeholder={user ? "Chia sẻ cảm nhận của bạn về sản phẩm..." : "Đăng nhập để viết đánh giá"}
                    value={reviewText} onChange={e => setReviewText(e.target.value)}
                    disabled={!user} rows={3}
                  />
                  <button className="btn btn-primary btn-sm"
                    onClick={handleSubmitReview}
                    disabled={!user || !reviewText.trim()}
                  >Gửi đánh giá</button>
                </div>

                <div className="review-list">
                  {reviews.length === 0 ? (
                    <div className="empty-state">
                      <div className="emoji">💬</div>
                      <h3>Chưa có đánh giá nào</h3>
                      <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                    </div>
                  ) : (
                    reviews.map(r => (
                      <div key={r.id} className="review-item">
                        <div className="review-header">
                          <span className="review-avatar">{r._avatar || "👤"}</span>
                          <div>
                            <div className="review-user">{r._userName || "Khách hàng"}</div>
                            <div className="review-meta-row">
                              <div className="stars">
                                {[1,2,3,4,5].map(i => (
                                  <span key={i} className={`star ${i <= r.rating ? "" : "empty"}`}>★</span>
                                ))}
                              </div>
                              <span className="review-date">{r.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                        <button className="helpful-btn">👍 Hữu ích ({r._helpful || 0})</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products — giống gốc, lọc theo categoryId */}
        {relatedProducts.length > 0 && (
          <div className="pdp-related">
            <h2 className="sec-title">🔗 Sản phẩm liên quan</h2>
            <div className="related-grid">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="related-card" onClick={() => navigate("product-detail", rp)}>
                  <div className="related-img">{rp.images[0]}</div>
                  <div className="related-body">
                    <div className="related-name">{rp.name}</div>
                    <div className="related-price">
                      {formatPrice(rp.variants.find(v => v.active && v.stockQuantity > 0)?.priceOverride ?? rp.basePrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
