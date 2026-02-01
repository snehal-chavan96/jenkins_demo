import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher'|'institution';
  ecoPoints?: number;
  level?: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const storedUser = localStorage.getItem('ecolearn_user');
  const storedToken = localStorage.getItem('ecolearn_token');
  const tokenExpiry = localStorage.getItem('token_expiry');

  if (storedUser && storedToken && tokenExpiry) {
    if (Date.now() > Number(tokenExpiry)) {
      // Token expired → logout
      logout();
    } else {
      // Token valid
      setUser(JSON.parse(storedUser));

      // Optional: auto-extend expiry on page load
      // localStorage.setItem('token_expiry', (Date.now() + 60*60*1000).toString());
    }
  }

  setIsLoading(false);
}, []);


const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    const user = response.user;
    setUser(user);

    // Save user and token in localStorage
    localStorage.setItem('ecolearn_user', JSON.stringify(user));
    localStorage.setItem('ecolearn_token', response.token);

    // Set expiry time (1 hour from now)
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('token_expiry', expiresAt.toString());

    return user; 
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const register = async (userData: any) => {
  try {
    const response = await authAPI.register(userData);

    setUser(response.user);
    localStorage.setItem('ecolearn_user', JSON.stringify(response.user));
    
    if (response.token) {
      localStorage.setItem('ecolearn_token', response.token);

      // Set expiry time (24 hours from now)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('token_expiry', expiresAt.toString());
    }

    return response.user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};


const logout = async () => {
  try {
    const token = localStorage.getItem('ecolearn_token');
    if (token) {
      await authAPI.logout(token); // call backend logout endpoint
    }
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    setUser(null);
    localStorage.removeItem('ecolearn_user');
    localStorage.removeItem('ecolearn_token');
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
