import React, { createContext, useState, useEffect } from 'react';

interface User {
  email: string;
  password: string; // In production, never store plain text!
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  register: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load authenticated user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const registeredUser: User = JSON.parse(storedUserStr);
      if (registeredUser.email === email && registeredUser.password === password) {
        setUser(registeredUser);
        localStorage.setItem('authUser', JSON.stringify(registeredUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const register = (email: string, password: string): boolean => {
    // For simplicity, only allow one registered user.
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      return false; // User already exists
    }
    const newUser: User = { email, password };
    localStorage.setItem('registeredUser', JSON.stringify(newUser));
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
