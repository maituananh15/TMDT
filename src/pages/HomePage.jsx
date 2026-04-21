import { useState } from "react";
import { PRODUCTS, CATEGORIES, formatPrice } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import "./HomePage.css";

function Toast({ message, onClose }) {
  setTimeout(onClose, 2500);
  return <div className="toast success">✅ {message} đã được thêm vào giỏ hàng!</div>;
}

export default function HomePage({ navigate }) {
  const [toast, setToast] = useState(null);

  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="home-page">
      {toast && <div className="toast-container"><Toast message={toast} onClose={() => setToast(null)} /></div>}

      {/* Hero Banner — giữ nguyên như gốc */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-tag">🎉 Miễn phí vận chuyển đơn từ 300k</div>
            <h1 className="hero-title">
              Thế Giới Đồ Chơi
              <span className="hero-highlight"> Kỳ Diệu</span>
              <br />Cho Bé Yêu! 🚀
            </h1>
            <p className="hero-desc">Khám phá hơn 1.000+ sản phẩm đồ chơi an toàn, chất lượng cho trẻ từ 0-12 tuổi. Giao hàng nhanh, đổi trả dễ dàng.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("products")}>
                🛍️ Mua sắm ngay
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate("products")}>
                Xem khuyến mãi
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat"><div className="stat-num">10K+</div><div className="stat-label">Sản phẩm</div></div>
              <div className="stat-divider" />
              <div className="stat"><div className="stat-num">50K+</div><div className="stat-label">Khách hàng</div></div>
              <div className="stat-divider" />
              <div className="stat"><div className="stat-num">4.9⭐</div><div className="stat-label">Đánh giá</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-emoji-cloud">
              <span className="float-emoji e1">🧸</span>
              <span className="float-emoji e2">🚗</span>
              <span className="float-emoji e3">🤖</span>
              <span className="float-emoji e4">🎲</span>
              <span className="float-emoji e5">🧩</span>
              <span className="float-emoji e6">🎨</span>
              <div className="hero-circle" />
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục — dùng Categories.imageUrl thay icon, count từ PRODUCTS */}
      <section className="section">
        <div className="section-inner">
          <h2 className="sec-title">📂 Danh mục sản phẩm</h2>
          <div className="category-grid">
            {CATEGORIES.filter(c => c.active).map(cat => (
              <button key={cat.id} className="cat-card" onClick={() => navigate("products")}>
                <span className="cat-icon">{cat.imageUrl}</span>
                <span className="cat-name">{cat.name}</span>
                {/* Đếm số sản phẩm thực tế theo categoryId */}
                <span className="cat-count">
                  {PRODUCTS.filter(p => p.status === "ACTIVE" && p.categoryId === cat.id).length} sản phẩm
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner — giữ nguyên */}
      <section className="flash-sale-section">
        <div className="section-inner">
          <div className="flash-banner">
            <div className="flash-left">
              <div className="flash-tag">⚡ FLASH SALE</div>
              <h2>Giảm đến 30% hôm nay!</h2>
              <p>Ưu đãi có hạn — đừng bỏ lỡ</p>
              <button className="btn btn-dark btn-lg" onClick={() => navigate("products")}>
                Xem tất cả ưu đãi →
              </button>
            </div>
            <div className="flash-emojis">🎁✨🛍️💝🎉</div>
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật — dùng ProductCard đã cập nhật variant */}
      <section className="section">
        <div className="section-inner">
          <h2 className="sec-title">⭐ Sản phẩm nổi bật</h2>
          <div className="product-grid">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={name => setToast(name)} />
            ))}
          </div>
          <div className="show-more">
            <button className="btn btn-outline btn-lg" onClick={() => navigate("products")}>
              Xem tất cả sản phẩm →
            </button>
          </div>
        </div>
      </section>

      {/* Features — giữ nguyên */}
      <section className="features-section">
        <div className="section-inner">
          <div className="features-grid">
            {[
              { icon: "🚚", title: "Giao hàng nhanh",  desc: "Giao trong 2-4 giờ nội thành TP.HCM & Hà Nội" },
              { icon: "🔒", title: "An toàn & Tin cậy", desc: "Sản phẩm kiểm định đạt chuẩn an toàn trẻ em quốc tế" },
              { icon: "↩️", title: "Đổi trả 30 ngày",  desc: "Miễn phí đổi trả trong 30 ngày nếu sản phẩm lỗi" },
              { icon: "💬", title: "Hỗ trợ 24/7",       desc: "Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn" },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tích điểm — LoyaltyPolicies, giữ nguyên giao diện */}
      <section className="section">
        <div className="section-inner">
          <div className="points-banner">
            <div>
              <h2>⭐ Tích điểm, hoàn tiền</h2>
              <p>Mỗi 10.000đ mua hàng = 1 điểm thưởng. Đổi 100 điểm = giảm 10.000đ cho đơn tiếp theo!</p>
              <button className="btn btn-primary" onClick={() => navigate("register")}>
                Đăng ký ngay để tích điểm
              </button>
            </div>
            <div className="points-visual">🌟💰🎁</div>
          </div>
        </div>
      </section>
    </div>
  );
}
