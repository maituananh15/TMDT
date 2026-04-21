import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/globals.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedProduct(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage navigate={navigate} />;
      case "products": return <ProductListPage navigate={navigate} />;
      case "product-detail": return <ProductDetailPage navigate={navigate} product={selectedProduct} />;
      case "cart": return <CartPage navigate={navigate} />;
      case "checkout": return <CheckoutPage navigate={navigate} />;
      case "login": return <LoginPage navigate={navigate} />;
      case "register": return <RegisterPage navigate={navigate} />;
      case "profile": return <ProfilePage navigate={navigate} />;
      case "orders": return <OrderHistoryPage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Header navigate={navigate} currentPage={currentPage} />
          <main className="main-wrapper">
            {renderPage()}
          </main>
          <Footer navigate={navigate} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
