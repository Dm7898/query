import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = () => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("role", user.role);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("role", user.role);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
