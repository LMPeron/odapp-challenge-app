import { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../service/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const renewToken = async () => {
    try {
      const response = await AuthService.renewToken();
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('authToken', userData.token);
    } catch (error) {
      console.error('Error renewing token:', error);
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const signIn = async (data) => {
    try {
      const response = await AuthService.login(data);
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('authToken', userData.token);
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) await renewToken();
      setLoading(false);
    };

    initializeAuth();

    const interval = setInterval(renewToken, 300000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
