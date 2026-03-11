import { createContext, useContext, useMemo, useState } from "react";
import { loginRequest } from "../api/adminApi";

const AuthContext = createContext(null);
const tokenKey = "foliomind_admin_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(tokenKey) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("foliomind_admin_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const data = await loginRequest({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem("foliomind_admin_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem("foliomind_admin_user");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

