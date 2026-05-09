import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CatalogoPage from './pages/CatalogoPage';
import ServiciosPage from './pages/ServiciosPage';
import FinanciamientoPage from './pages/FinanciamientoPage';
import ContactoPage from './pages/ContactoPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/financiamiento" element={<FinanciamientoPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/ingreso" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
