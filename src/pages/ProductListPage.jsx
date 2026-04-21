import { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES, formatPrice, getDisplayPrice, getDefaultVariant } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import "./ProductListPage.css";

function ProductListItem({ product, navigate, onAddToCart }) {
  const { addToCart } = useCart();
  const displayPrice = getDisplayPrice(product);
  const hasDiscount  = product.basePrice > displayPrice;
  const discountPct  = hasDiscount ? Math.round((1 - displayPrice / product.basePrice) * 100) : null;

  return (
    <div className="product-list-item" onClick={() => navigate("product-detail", product)}>
      <div className="pli-img">{product.images[0]}</div>
      <div className="pli-body">
        <div className="pli-brand">{product.brand}</div>
        <h3 className="pli-name">{product.name}</h3>
        <p className="pli-desc">{product.description.substring(0, 120)}...</p>
        <div className="pli-meta">
          <div className="product-stars">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`star ${i <= Math.round(product.rating) ? "" : "empty"}`}>★</span>
            ))}
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <span className="sold-label">Đã bán {product.sold}</span>
        </div>
      </div>
      <div className="pli-right">
        <div className="price-current">{formatPrice(displayPrice)}</div>
        {hasDiscount && <div className="price-original">{formatPrice(product.basePrice)}</div>}
        {discountPct && <div className="pli-discount">-{discountPct}%</div>}
        <button className="btn btn-secondary btn-sm" onClick={e => {
          e.stopPropagation();
          const v = getDefaultVariant(product);
          if (v) { addToCart(product, v); onAddToCart && onAddToCart(product.name); }
        }}>🛒 Thêm vào giỏ</button>
      </div>
    </div>
  );
}

export default function ProductListPage({ navigate }) {
  const [search, setSearch]           = useState("");
  const [selectedCatId, setSelectedCatId] = useState("all");
  const [priceMin, setPriceMin]       = useState("");
  const [priceMax, setPriceMax]       = useState("");
  const [sortBy, setSortBy]           = useState("default");
  const [toast, setToast]             = useState(null);
  const [viewMode, setViewMode]       = useState("grid");

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter(p => p.status === "ACTIVE");
    if (search)
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      );
    if (selectedCatId !== "all")
      result = result.filter(p => p.categoryId === selectedCatId);
    if (priceMin)
      result = result.filter(p => getDisplayPrice(p) >= Number(priceMin) * 1000);
    if (priceMax)
      result = result.filter(p => getDisplayPrice(p) <= Number(priceMax) * 1000);
    if (sortBy === "price-asc")  result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    if (sortBy === "price-desc") result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    if (sortBy === "rating")     result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "sold")       result.sort((a, b) => b.sold - a.sold);
    return result;
  }, [search, selectedCatId, priceMin, priceMax, sortBy]);

  const handleClearFilter = () => {
    setSearch(""); setSelectedCatId("all"); setPriceMin(""); setPriceMax(""); setSortBy("default");
  };
  const showToast = (name) => { setToast(name); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="product-list-page">
      {toast && <div className="toast-container"><div className="toast success">✅ {toast} đã thêm vào giỏ!</div></div>}
      <div className="plp-inner">
        <aside className="plp-sidebar">
          <div className="sidebar-header">
            <h3>🔍 Bộ lọc</h3>
            <button className="clear-btn" onClick={handleClearFilter}>Xóa tất cả</button>
          </div>
          <div className="filter-group">
            <label className="filter-label">Tìm kiếm</label>
            <input className="form-input" placeholder="Tên sản phẩm, thương hiệu..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Danh mục</label>
            <div className="filter-list">
              <button className={`filter-cat-btn ${selectedCatId === "all" ? "active" : ""}`}
                onClick={() => setSelectedCatId("all")}>
                🏷️ Tất cả ({PRODUCTS.filter(p => p.status === "ACTIVE").length})
              </button>
              {CATEGORIES.filter(c => c.active).map(cat => {
                const cnt = PRODUCTS.filter(p => p.status === "ACTIVE" && p.categoryId === cat.id).length;
                return (
                  <button key={cat.id}
                    className={`filter-cat-btn ${selectedCatId === cat.id ? "active" : ""}`}
                    onClick={() => setSelectedCatId(cat.id)}>
                    {cat.imageUrl} {cat.name} ({cnt})
                  </button>
                );
              })}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Khoảng giá (nghìn đồng)</label>
            <div className="price-inputs">
              <input className="form-input" type="number" placeholder="Từ"
                value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              <span className="price-sep">—</span>
              <input className="form-input" type="number" placeholder="Đến"
                value={priceMax} onChange={e => setPriceMax(e.target.value)} />
            </div>
            <div className="price-presets">
              {[{label:"< 200k",min:"",max:"200"},{label:"200–500k",min:"200",max:"500"},{label:"> 500k",min:"500",max:""}].map(p => (
                <button key={p.label} className="price-preset"
                  onClick={() => { setPriceMin(p.min); setPriceMax(p.max); }}>{p.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div className="plp-main">
          <div className="plp-toolbar">
            <span className="result-count">Tìm thấy <strong>{filtered.length}</strong> sản phẩm</span>
            <div className="toolbar-right">
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="sold">Bán chạy nhất</option>
              </select>
              <div className="view-toggle">
                <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>⊞</button>
                <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>≡</button>
              </div>
            </div>
          </div>

          {(selectedCatId !== "all" || priceMin || priceMax || search) && (
            <div className="active-filters">
              <span>Đang lọc:</span>
              {selectedCatId !== "all" && (
                <span className="filter-tag">
                  {CATEGORIES.find(c => c.id === selectedCatId)?.name}
                  <button onClick={() => setSelectedCatId("all")}>×</button>
                </span>
              )}
              {search && <span className="filter-tag">"{search}" <button onClick={() => setSearch("")}>×</button></span>}
              {(priceMin || priceMax) && (
                <span className="filter-tag">{priceMin||0}k–{priceMax||"∞"}k
                  <button onClick={() => { setPriceMin(""); setPriceMax(""); }}>×</button>
                </span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button className="btn btn-primary" onClick={handleClearFilter}>Xóa bộ lọc</button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="product-grid-plp">
              {filtered.map(p => <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={showToast} />)}
            </div>
          ) : (
            <div className="product-list-view">
              {filtered.map(p => <ProductListItem key={p.id} product={p} navigate={navigate} onAddToCart={showToast} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
