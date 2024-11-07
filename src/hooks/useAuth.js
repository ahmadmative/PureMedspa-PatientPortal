import { useState, useEffect, createContext, useContext } from 'react';
import { authUtils } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authUtils.getToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = (token) => {
    authUtils.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authUtils.removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 