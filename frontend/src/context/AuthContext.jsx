import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("healthnest_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("healthnest_token", data.token);
    localStorage.setItem("healthnest_user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    persist(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await axiosClient.post("/auth/register", payload);
    persist(res.data);
    return res.data;
  };

  const refreshUser = (patch) => {
    const updated = { ...user, ...patch };
    localStorage.setItem("healthnest_user", JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem("healthnest_token");
    localStorage.removeItem("healthnest_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}