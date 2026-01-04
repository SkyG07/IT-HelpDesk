import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast"; // ✅ import toast

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (data) => {
    try {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome, ${data.name}!`);
    } catch (err) {
      toast.error("Login failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
