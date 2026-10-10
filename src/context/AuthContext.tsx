import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.ts';

interface AuthContextType {
  isAdmin: boolean;
  token: string | null;
  adminEmail: string | null;
  login: (password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  token: null,
  adminEmail: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('portfolio_admin_token'));
  const [adminEmail, setAdminEmail] = useState<string | null>(() => localStorage.getItem('portfolio_admin_email'));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      try {
        const valid = await api.verifyToken(token);
        if (valid) {
          setIsAdmin(true);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    checkToken();
  }, [token]);

  const login = async (password: string, email?: string): Promise<boolean> => {
    try {
      const res = await api.login(password, email);
      if (res.token) {
        setToken(res.token);
        setAdminEmail(res.user?.email || 'admin@portfolio.dev');
        setIsAdmin(true);
        localStorage.setItem('portfolio_admin_token', res.token);
        localStorage.setItem('portfolio_admin_email', res.user?.email || 'admin@portfolio.dev');
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setAdminEmail(null);
    setIsAdmin(false);
    localStorage.removeItem('portfolio_admin_token');
    localStorage.removeItem('portfolio_admin_email');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, adminEmail, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
