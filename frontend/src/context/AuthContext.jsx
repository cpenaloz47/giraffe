import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión desde localStorage al montar
  useEffect(() => {
    const savedToken = localStorage.getItem('giraffe_token');
    const savedUser = localStorage.getItem('giraffe_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser({ id: data.id, nombre: data.nombre, email: data.email, rol: data.rol });
    localStorage.setItem('giraffe_token', data.token);
    localStorage.setItem('giraffe_user', JSON.stringify({
      id: data.id, nombre: data.nombre, email: data.email, rol: data.rol,
    }));
    return data;
  };

  const register = async (nombre, email, password, telefono) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password, telefono }),
    });
    setToken(data.token);
    setUser({ id: data.id, nombre: data.nombre, email: data.email, rol: data.rol });
    localStorage.setItem('giraffe_token', data.token);
    localStorage.setItem('giraffe_user', JSON.stringify({
      id: data.id, nombre: data.nombre, email: data.email, rol: data.rol,
    }));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('giraffe_token');
    localStorage.removeItem('giraffe_user');
  };

  const isAdmin = user?.rol === 'ADMIN';
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated, isAdmin,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
