import { createContext, useContext, useState } from "react";
import { LOYALTY_ACCOUNT } from "../data/mockData";

const AuthContext = createContext();

// Mock user — khớp bảng Users
// Users: id, fullName, userName, email, phone, passwordHash, status(ACTIVE/INACTIVE/BANNED), role(CUSTOMER/ADMIN/DELIVERY)
const createUser = (email, extra = {}) => ({
  id: 1,
  fullName: extra.fullName || "Nguyễn Văn An",
  userName: extra.userName || "nguyenvanan",
  email,
  phone: extra.phone || "0901234567",
  passwordHash: "***",
  status: "ACTIVE",
  role: "CUSTOMER",
  avatar: "👤",
  // LoyaltyAccounts (join để hiển thị điểm)
  loyaltyAccount: { ...LOYALTY_ACCOUNT },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Users.email + passwordHash → mock chấp nhận mọi cặp hợp lệ
  const login = (email, password) => {
    if (!email || !password) return false;
    setUser(createUser(email));
    return true;
  };

  // Tạo Users mới: fullName, userName, email, phone, passwordHash
  const register = (data) => {
    setUser(createUser(data.email, {
      fullName: data.name,
      userName: data.userName || data.email.split("@")[0],
      phone: data.phone,
    }));
    return true;
  };

  const logout = () => setUser(null);

  // Cập nhật Users fields + AddressUsers
  const updateProfile = (data) => setUser(prev => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
