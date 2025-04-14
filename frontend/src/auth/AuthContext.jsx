import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// AuthProvider wraps your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load session from localStorage on startup
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
export const useAuth = () => useContext(AuthContext);
