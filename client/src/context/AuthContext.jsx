import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('research_os_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.error('Session expired', err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('research_os_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const register = async (email, password, name, institution) => {
    const res = await authAPI.register({ email, password, name, institution });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('research_os_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('research_os_token');
    setToken(null);
    setUser(null);
  };

  const updateApiKey = async (apiKey) => {
    if (user) {
      const updatedUser = { ...user, apiKey };
      setUser(updatedUser);
      try {
        await authAPI.updateProfile({ apiKey });
      } catch (e) {
        console.log('Saved key locally');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
