import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

export default function LoginPage({ navigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: "" })); setServerError(""); };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Vui lòng nhập email";
    if (!form.password) e.password = "Vui lòng nhập mật khẩu";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(form.email, form.password);
    if (ok) { navigate("home"); }
    else { setServerError("Email hoặc mật khẩu không đúng. Vui lòng thử lại."); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-brand">🧸 ToyWorld</div>
          <h2>Chào mừng trở lại!</h2>
          <p>Đăng nhập để xem đơn hàng, tích điểm thưởng và mua sắm dễ dàng hơn.</p>
          <div className="auth-features">
            <div className="af-item">⭐ Tích điểm với mỗi đơn hàng</div>
            <div className="af-item">📦 Theo dõi đơn hàng real-time</div>
            <div className="af-item">💝 Ưu đãi dành riêng cho thành viên</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <h1 className="auth-title">Đăng nhập</h1>
          <p className="auth-sub">Chưa có tài khoản? <button className="auth-link" onClick={() => navigate("register")}>Đăng ký ngay</button></p>

          {serverError && <div className="server-error">❌ {serverError}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input ${errors.email ? "error" : ""}`}
              type="email" placeholder="email@example.com"
              value={form.email} onChange={e => update("email", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            {errors.email && <div className="form-error">⚠️ {errors.email}</div>}
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <label className="form-label" style={{ margin: 0 }}>Mật khẩu</label>
              <button className="auth-link" style={{ fontSize: 12 }}>Quên mật khẩu?</button>
            </div>
            <input
              className={`form-input ${errors.password ? "error" : ""}`}
              type="password" placeholder="••••••••"
              value={form.password} onChange={e => update("password", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            {errors.password && <div className="form-error">⚠️ {errors.password}</div>}
          </div>

          <button className="btn btn-primary btn-lg btn-full submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="btn-loading"><span className="spinner" />Đang đăng nhập...</span> : "🔑 Đăng nhập"}
          </button>


        </div>
      </div>
    </div>
  );
}
