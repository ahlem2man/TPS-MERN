import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger user au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login attempt:", { email });
      
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Token saved?', localStorage.getItem('token') ? 'Yes' : 'No');
      console.log('User saved?', localStorage.getItem('user') ? 'Yes' : 'No');
      
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log("Register attempt:", { username, email });
      
      const response = await api.post('/auth/register', { 
        username,  // ← IMPORTANT: doit être "username" pas "name"
        email, 
        password 
      });
      
      console.log('Register response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Token saved?', localStorage.getItem('token') ? 'Yes' : 'No');
      
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};