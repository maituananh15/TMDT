import { useCart } from "../context/CartContext";
import { formatPrice, getDisplayPrice, getDefaultVariant, isInStock } from "../data/mockData";
import "./ProductCard.css";

export default function ProductCard({ product, navigate, onAddToCart }) {
  const { addToCart } = useCart();

  const displayPrice   = getDisplayPrice(product);
  const inStock        = isInStock(product);
  const hasDiscount    = product.basePrice > displayPrice;
  const discountPct    = hasDiscount
    ? Math.round((1 - displayPrice / product.basePrice) * 100)
    : null;
  const multiVariant   = product.variants.filter(v => v.active).length > 1;

  // Badge: % giảm > badge text
  const badgeText = discountPct
    ? `-${discountPct}%`
    : !hasDiscount && product.variants[0]?.stockQuantity < 10
      ? "Hot"
      : null;
  const badgeClass = discountPct ? "badge-sale" : "badge-hot";

  const handleAdd = (e) => {
    e.stopPropagation();
    const variant = getDefaultVariant(product);
    if (!variant) return;
    addToCart(product, variant, 1);
    if (onAddToCart) onAddToCart(product.name);
  };

  return (
    <div className="product-card" onClick={() => navigate("product-detail", product)}>
      <div className="product-img-wrap">
        <div className="product-emoji">{product.images[0]}</div>
        {badgeText && (
          <span className={`product-badge ${badgeClass}`}>{badgeText}</span>
        )}
        {!inStock && <div className="out-of-stock">Hết hàng</div>}
      </div>

      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>

        {/* Hiển thị số lựa chọn variant */}
        {multiVariant && (
          <div className="variant-count">
            {product.variants.filter(v => v.active).length} lựa chọn
          </div>
        )}

        <div className="product-meta">
          <div className="product-stars">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`star ${i <= Math.round(product.rating) ? "" : "empty"}`}>★</span>
            ))}
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <span className="sold-count">Đã bán {product.sold}</span>
        </div>

        <div className="product-price-row">
          <span className="price-current">{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span className="price-original">{formatPrice(product.basePrice)}</span>
          )}
        </div>

        <button className="btn-add-cart" onClick={handleAdd} disabled={!inStock}>
          {inStock ? "🛒 Thêm vào giỏ" : "Hết hàng"}
        </button>
      </div>
    </div>
  );
}
