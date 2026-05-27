import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navLinks } from '../../data/mock';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
          <svg className="brand-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="4" fill="var(--color-accent)" />
            <text x="20" y="26" textAnchor="middle" fill="var(--color-dark)"
              fontFamily="Cormorant Garamond" fontWeight="700" fontSize="18">G</text>
          </svg>
          <div className="brand-text">
            <span className="brand-name">GIRAFFE</span>
            <span className="brand-tagline">ROADSTER</span>
          </div>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to={link.path}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link nav-link-reportes ${isActive ? 'active' : ''}`}
                  to="/reportes"
                  onClick={closeMenu}
                >
                  REPORTES
                </NavLink>
              </li>
            )}
            <li className="nav-item ms-lg-3">
              {isAuthenticated ? (
                <button className="btn btn-ingreso" onClick={logout}>
                  {user.nombre.split(' ')[0].toUpperCase()}
                  <i className="bi bi-box-arrow-right ms-2" style={{ fontSize: '0.7rem' }} />
                </button>
              ) : (
                <button
                  className="btn btn-ingreso"
                  onClick={() => {
                    navigate('/ingreso');
                    closeMenu();
                  }}
                >
                  INGRESO
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
