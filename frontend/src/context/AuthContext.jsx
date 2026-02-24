import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("employee");
    if (stored) setEmployee(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (employeeData) => {
    localStorage.setItem("employee", JSON.stringify(employeeData));
    setEmployee(employeeData);
  };

  const logout = () => {
    localStorage.removeItem("employee");
    localStorage.removeItem("token");
    setEmployee(null);
  };

  return (
    <AuthContext.Provider value={{ employee, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
