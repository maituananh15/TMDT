import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ADDRESS_USERS, LOYALTY_TRANSACTIONS, formatPrice } from "../data/mockData";
import "./ProfilePage.css";

const TABS = [
  { key: "info",     label: "👤 Thông tin cá nhân" },
  { key: "address",  label: "📍 Địa chỉ" },
  { key: "password", label: "🔒 Đổi mật khẩu" },
  { key: "points",   label: "⭐ Điểm thưởng" },
];

export default function ProfilePage({ navigate }) {
  const { user, updateProfile, logout } = useAuth();
  const [tab, setTab] = useState("info");

  // Users fields — dùng fullName nhưng hiển thị như "name" cho quen thuộc
  const [form, setForm] = useState({
    name:  user?.fullName || "",
    phone: user?.phone    || "",
    email: user?.email    || "",
    dob:   "",
  });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saved, setSaved]   = useState(false);
  const [pwError, setPwError] = useState("");

  if (!user) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔑</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>Vui lòng đăng nhập</h3>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("login")}>Đăng nhập ngay</button>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile({ fullName: form.name, phone: form.phone, email: form.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!pwForm.current)                          { setPwError("Vui lòng nhập mật khẩu hiện tại"); return; }
    if (!pwForm.newPw || pwForm.newPw.length < 6) { setPwError("Mật khẩu mới ít nhất 6 ký tự"); return; }
    if (pwForm.newPw !== pwForm.confirm)           { setPwError("Mật khẩu xác nhận không khớp"); return; }
    setPwError("");
    setPwForm({ current: "", newPw: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Điểm thưởng từ LoyaltyAccounts
  const loyalty = user.loyaltyAccount || { currentPoints: 0, lifetimeEarnedPoints: 0, lifetimeSpentPoints: 0 };
  const points  = loyalty.currentPoints ?? 0;

  return (
    <div className="profile-page">
      <div className="profile-inner">
        {/* Sidebar — giống gốc */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{user.avatar}</div>
            {/* Users.fullName hiển thị như name gốc */}
            <div className="profile-name">{user.fullName}</div>
            <div className="profile-email">{user.email}</div>
            {/* LoyaltyAccounts.currentPoints thay user.points */}
            <div className="profile-points-badge">⭐ {points.toLocaleString()} điểm</div>
          </div>
          <nav className="profile-nav">
            {TABS.map(t => (
              <button key={t.key}
                className={`pnav-btn ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >{t.label}</button>
            ))}
            <div className="pnav-divider" />
            <button className="pnav-btn" onClick={() => navigate("orders")}>📦 Đơn hàng của tôi</button>
            <button className="pnav-btn logout" onClick={() => { logout(); navigate("home"); }}>🚪 Đăng xuất</button>
          </nav>
        </aside>

        {/* Main */}
        <div className="profile-main">
          {saved && <div className="save-toast">✅ Đã lưu thành công!</div>}

          {/* Tab thông tin — giống gốc, dùng Users.fullName */}
          {tab === "info" && (
            <div className="profile-section">
              <h2 className="section-title">👤 Thông tin cá nhân</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input className="form-input" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>
                  <input className="form-input" type="date" value={form.dob}
                    onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input className="form-input" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSave}>💾 Lưu thay đổi</button>
            </div>
          )}

          {/* Tab địa chỉ — AddressUsers với isDefault, shipName, shipAddress, shipPhone, shipEmail */}
          {tab === "address" && (
            <div className="profile-section">
              <h2 className="section-title">📍 Địa chỉ giao hàng</h2>
              <div className="address-list">
                {ADDRESS_USERS.map(addr => (
                  <div key={addr.id} className={`address-card ${addr.isDefault ? "default" : ""}`}>
                    {/* AddressUsers.isDefault */}
                    {addr.isDefault && <div className="addr-badge">Mặc định</div>}
                    {/* AddressUsers.shipName + shipPhone */}
                    <div className="addr-name">{addr.shipName} · {addr.shipPhone}</div>
                    {/* AddressUsers.shipAddress */}
                    <div className="addr-detail">{addr.shipAddress}</div>
                    <div className="addr-actions">
                      <button className="btn btn-outline btn-sm">Chỉnh sửa</button>
                      <button className="btn btn-light btn-sm">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 16 }}>+ Thêm địa chỉ mới</button>
            </div>
          )}

          {/* Tab đổi mật khẩu — giống gốc */}
          {tab === "password" && (
            <div className="profile-section">
              <h2 className="section-title">🔒 Đổi mật khẩu</h2>
              {pwError && <div className="server-error" style={{ marginBottom: 16 }}>❌ {pwError}</div>}
              <div className="form-group" style={{ maxWidth: 420 }}>
                <label className="form-label">Mật khẩu hiện tại</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
              </div>
              <div className="form-group" style={{ maxWidth: 420 }}>
                <label className="form-label">Mật khẩu mới</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={pwForm.newPw} onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} />
              </div>
              <div className="form-group" style={{ maxWidth: 420 }}>
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
              </div>
              <button className="btn btn-primary" onClick={handleChangePassword}>🔒 Đổi mật khẩu</button>
            </div>
          )}

          {/* Tab điểm thưởng — LoyaltyAccounts + LoyaltyTransactions, giống giao diện gốc */}
          {tab === "points" && (
            <div className="profile-section">
              <h2 className="section-title">⭐ Chương trình tích điểm</h2>
              <div className="points-overview">
                <div className="points-big">
                  {/* LoyaltyAccounts.currentPoints */}
                  <div className="pts-num">{points.toLocaleString()}</div>
                  <div className="pts-label">Điểm tích lũy</div>
                </div>
                <div className="points-info">
                  {/* Quy đổi theo LoyaltyPolicies.pointValue */}
                  <p>Tương đương: <strong>{(points / 100 * 10000).toLocaleString()}đ</strong> tiền giảm giá</p>
                  <div className="pts-rule">
                    <div className="rule-item">🛒 10.000đ mua hàng = 1 điểm</div>
                    <div className="rule-item">⭐ 100 điểm = Giảm 10.000đ</div>
                    <div className="rule-item">🎁 Điểm hết hạn sau 12 tháng</div>
                  </div>
                </div>
              </div>

              {/* LoyaltyTransactions — giống giao diện gốc */}
              <div className="points-history">
                <h4>Lịch sử điểm</h4>
                {LOYALTY_TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="pts-history-row">
                    <div>
                      <div className="pts-desc">{tx.note}</div>
                      <div className="pts-date">{tx.createdAt}</div>
                    </div>
                    <div className={`pts-change ${tx.pointsChange > 0 ? "plus" : "minus"}`}>
                      {tx.pointsChange > 0 ? "+" : ""}{tx.pointsChange}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
