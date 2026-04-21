import { createContext, useContext, useState } from "react";

// CartItem shape — khớp Carts + CartItems + snapshot cho OrderItems:
// {
//   cartItemId    (CartItems.id — mock)
//   productId     (Products.id)
//   variantId     (ProductVariants.id — CartItems.variantId)
//   productName   (Products.name — dùng làm OrderItems.productNameSnapshot)
//   color         (ProductVariants.color — → OrderItems.colorSnapshot)
//   size          (ProductVariants.size  — → OrderItems.sizeSnapshot)
//   unitPrice     (ProductVariants.priceOverride — → OrderItems.unitPrice)
//   emoji         (ProductImages.imageUrl thumbnail)
//   quantity      (CartItems.quantity)
//   stockQuantity (ProductVariants.stockQuantity — để validate)
// }

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // addToCart nhận product + variant đã chọn
  const addToCart = (product, variant, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.variantId === variant.id);
      if (exists) {
        return prev.map(i =>
          i.variantId === variant.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, variant.stockQuantity) }
            : i
        );
      }
      return [
        ...prev,
        {
          cartItemId:    Date.now(),
          productId:     product.id,
          variantId:     variant.id,
          productName:   product.name,
          color:         variant.color,
          size:          variant.size,
          unitPrice:     variant.priceOverride,
          emoji:         product.images[0],
          quantity,
          stockQuantity: variant.stockQuantity,
        },
      ];
    });
  };

  const removeFromCart = (variantId) =>
    setCart(prev => prev.filter(i => i.variantId !== variantId));

  const updateQuantity = (variantId, qty) => {
    if (qty < 1) { removeFromCart(variantId); return; }
    setCart(prev =>
      prev.map(i =>
        i.variantId === variantId
          ? { ...i, quantity: Math.min(qty, i.stockQuantity) }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  // Orders.subtotal = sum(lineTotal) = sum(unitPrice * quantity)
  const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const count    = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      subtotal, count,
      // backward compat alias
      total: subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
