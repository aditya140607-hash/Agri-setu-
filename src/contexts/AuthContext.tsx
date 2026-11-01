import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickDemoLogin: (role: 'FARMER' | 'ADMIN' | 'EXPERT') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  quickDemoLogin: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agri_setu_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem('agri_setu_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.warn('Failed to fetch user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await api.login(identifier, password);
      if (res.success && res.data) {
        localStorage.setItem('agri_setu_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login.' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      if (res.success && res.data) {
        localStorage.setItem('agri_setu_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during registration.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('agri_setu_token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (targetRole: 'FARMER' | 'ADMIN' | 'EXPERT') => {
    if (targetRole === 'FARMER') {
      await login('9876543210', 'farmer123');
    } else if (targetRole === 'ADMIN') {
      await login('admin@agrisetu.in', 'admin123');
    } else if (targetRole === 'EXPERT') {
      await login('expert.sharma@agrisetu.in', 'expert123');
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
