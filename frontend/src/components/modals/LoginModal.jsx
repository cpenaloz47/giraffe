import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginModal() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ nombre: '', email: '', telefono: '', password: '' });
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const closeModal = () => {
    const modal = document.getElementById('loginModal');
    const bsModal = window.bootstrap?.Modal?.getInstance(modal);
    bsModal?.hide();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(loginData.email, loginData.password);
      closeModal();
      showToast(`Bienvenido, ${data.nombre}`);
    } catch (err) {
      showToast(err.message || 'Error al iniciar sesión', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await register(regData.nombre, regData.email, regData.password, regData.telefono);
      closeModal();
      showToast(`Cuenta creada. Bienvenido, ${data.nombre}`);
    } catch (err) {
      showToast(err.message || 'Error al registrarse', 'error');
    }
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Iniciar Sesión</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            {/* Tabs */}
            <ul className="nav nav-tabs nav-justified mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Ingresar
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Registrarse
                </button>
              </li>
            </ul>

            {/* Login form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Tu contraseña"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3 text-end">
                  <a href="#" className="link-forgot">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" className="btn btn-primary-giraffe w-100">INGRESAR</button>
              </form>
            )}

            {/* Register form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tu nombre"
                    value={regData.nombre}
                    onChange={(e) => setRegData({ ...regData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono (opcional)</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+56 9 1234 5678"
                    value={regData.telefono}
                    onChange={(e) => setRegData({ ...regData, telefono: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mínimo 8 caracteres"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <button type="submit" className="btn btn-primary-giraffe w-100">CREAR CUENTA</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
