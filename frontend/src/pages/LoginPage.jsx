import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [registerForm, setRegisterForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const handleLoginChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '', submit: '' }));
  }, []);

  const handleRegisterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '', submit: '' }));
  }, []);

  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.email.trim()) newErrors.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) newErrors.email = 'Email no válido';
    if (!loginForm.password) newErrors.password = 'Contraseña es requerida';
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerForm.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!registerForm.apellidos.trim()) newErrors.apellidos = 'Apellidos son requeridos';
    if (!registerForm.email.trim()) newErrors.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) newErrors.email = 'Email no válido';
    if (!registerForm.password) newErrors.password = 'Contraseña es requerida';
    else if (registerForm.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!registerForm.terms) newErrors.terms = 'Debes aceptar los términos';
    return newErrors;
  };

  const handleLoginSubmit = useCallback(async (e) => {
    e.preventDefault();
    const newErrors = validateLogin();
    if (Object.keys(newErrors).length === 0) {
      try {
        await login(loginForm.email, loginForm.password);
        navigate('/');
      } catch (error) {
        const errorMessage = error?.message || 'Error al iniciar sesión';
        setErrors({ submit: errorMessage });
      }
    } else {
      setErrors(newErrors);
    }
  }, [loginForm, login, navigate]);

  const handleRegisterSubmit = useCallback(async (e) => {
    e.preventDefault();
    const newErrors = validateRegister();
    if (Object.keys(newErrors).length === 0) {
      try {
        await register(
          registerForm.nombre + ' ' + registerForm.apellidos,
          registerForm.email,
          registerForm.password,
          ''
        );
        navigate('/');
      } catch (error) {
        const errorMessage = error?.message || 'Error al registrarse';
        setErrors({ submit: errorMessage });
      }
    } else {
      setErrors(newErrors);
    }
  }, [registerForm, register, navigate]);

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-header">
          <h1>BIENVENIDO</h1>
          <p>Inicia sesión o crea tu cuenta para acceder a beneficios exclusivos y gestionar tus consultas.</p>
        </div>

        <div className="login-container">
          {/* Sección Inicia Sesión */}
          <div className="login-section login-form-section">
            <h2 className="login-title">INICIA SESIÓN</h2>
            <p className="login-subtitle">Ingresa tus datos para acceder a tu cuenta.</p>

            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu correo electrónico"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">CONTRASEÑA</label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Ingresa tu contraseña"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                  <span className="password-toggle">
                    <i className="bi bi-eye" />
                  </span>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-check remember-check">
                <input
                  type="checkbox"
                  name="remember"
                  id="rememberMe"
                  className="form-check-input"
                  checked={loginForm.remember}
                  onChange={handleLoginChange}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Recuérdame
                </label>
              </div>

              <button type="submit" className="btn btn-login">INGRESAR</button>
              {errors.submit && <div className="error-text">{errors.submit}</div>}

              <p className="forgot-password">
                <a href="#">¿Olvidaste tu contraseña?</a>
              </p>

              <div className="divider">o continúa con</div>

              <div className="social-buttons">
                <button type="button" className="btn btn-social btn-google">
                  CONTINUAR CON GOOGLE
                </button>
                <button type="button" className="btn btn-social btn-apple">
                  CONTINUAR CON APPLE
                </button>
              </div>

              <p className="signup-link">
                ¿No tienes cuenta? <a href="#" onClick={() => setActiveTab('register')}>Regístrate aquí</a>
              </p>
            </form>
          </div>

          {/* Sección Crea tu Cuenta */}
          <div className="login-section register-form-section">
            <h2 className="login-title">CREA TU CUENTA</h2>
            <p className="login-subtitle">Completa tus datos para crear tu cuenta.</p>

            <form onSubmit={handleRegisterSubmit} noValidate>
              <div className="form-row">
                <div className="form-group form-group-half">
                  <label className="form-label">NOMBRE COMPLETO</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    placeholder="Ingresa tu nombre completo"
                    value={registerForm.nombre}
                    onChange={handleRegisterChange}
                  />
                  {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                </div>

                <div className="form-group form-group-half">
                  <label className="form-label">APELLIDOS</label>
                  <input
                    type="text"
                    name="apellidos"
                    className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                    placeholder="Ingresa tus apellidos"
                    value={registerForm.apellidos}
                    onChange={handleRegisterChange}
                  />
                  {errors.apellidos && <span className="error-text">{errors.apellidos}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu correo electrónico"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">CONTRASEÑA</label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Crea una contraseña"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                  />
                  <span className="password-toggle">
                    <i className="bi bi-eye" />
                  </span>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">CONFIRMAR CONTRASEÑA</label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirma tu contraseña"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                  <span className="password-toggle">
                    <i className="bi bi-eye" />
                  </span>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-check terms-check">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="form-check-input"
                  checked={registerForm.terms}
                  onChange={handleRegisterChange}
                />
                <label className="form-check-label" htmlFor="terms">
                  Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
                </label>
              </div>
              {errors.terms && <span className="error-text">{errors.terms}</span>}

              <button type="submit" className="btn btn-register">REGISTRARME</button>
              {errors.submit && <div className="error-text">{errors.submit}</div>}
            </form>
          </div>
        </div>

        {/* Beneficios */}
        <div className="login-benefits">
          <h3>AL CREAR TU CUENTA PODRÁS:</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-heart" />
              </div>
              <p>Guardar tus autos favoritos</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-tag" />
              </div>
              <p>Recibir ofertas personalizadas</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-chat-dots" />
              </div>
              <p>Hacer seguimiento a tus consultas</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-gift" />
              </div>
              <p>Aceptar a beneficios exclusivos</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-clock-history" />
              </div>
              <p>Gestionar tus solicitudes de financiamiento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
