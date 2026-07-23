'use client';

import { isAxiosError } from 'axios';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '@/api/apiClient';

interface AuthContextValue {
  apiKey: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (key: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAuthLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('claude_api_key');
    if (stored) setApiKey(stored);
    setIsLoading(false);
  }, []);

  const login = async (key: string) => {
    try {
      await api.verify({ apiKey: key });
      localStorage.setItem('claude_api_key', key);
      setApiKey(key);
    } catch (err) {
      const userMessage = isAxiosError(err)
        ? (err.response?.data?.userMessage ?? 'API 키 인증에 실패했습니다.')
        : 'API 키 인증에 실패했습니다.';
      throw new Error(userMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('claude_api_key');
    setApiKey(null);
  };

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        isAuthenticated: !!apiKey,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
