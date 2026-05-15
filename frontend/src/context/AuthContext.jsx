import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      setError(null);
      const data = await loginUser(email, password);
      
      const userData = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol || 'USER',
      };
      
      setToken(data.token);
      setUser(userData);
      localStorage.setItem('giraffe_token', data.token);
      localStorage.setItem('giraffe_user', JSON.stringify(userData));
      
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error al iniciar sesión';
      setError(errorMsg);
      throw err;
    }
  };

  const register = async (nombre, email, password, telefono) => {
    try {
      setError(null);
      // No enviar telefono si está vacío
      const data = await registerUser(nombre, email, password, telefono && telefono.trim() ? telefono : undefined);
      
      const userData = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol || 'USER',
      };
      
      setToken(data.token);
      setUser(userData);
      localStorage.setItem('giraffe_token', data.token);
      localStorage.setItem('giraffe_user', JSON.stringify(userData));
      
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error al registrar usuario';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('giraffe_token');
    localStorage.removeItem('giraffe_user');
  };

  const isAdmin = user?.rol === 'ADMIN';
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
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
