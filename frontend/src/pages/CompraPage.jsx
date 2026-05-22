import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  oferta: '',
  mensaje: '',
};

export default function CompraPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auto = state?.auto || null;
  const [form, setForm] = useState(initialForm);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="compra-page">
      <div className="container">
        <PageHeader
          title="NEGOCIAR COMPRA"
          subtitle="Haz tu oferta y nos pondremos en contacto contigo para cerrar el trato."
        />

        <div className="compra-layout">
          {auto && (
            <aside className="compra-auto-card">
              <h3>Auto seleccionado</h3>
              <div className="compra-auto-info">
                <p className="compra-auto-nombre">{auto.marca} {auto.modelo}</p>
                <p className="compra-auto-detalle">{auto.anio} · {auto.tipoCarroceria} · {auto.transmision}</p>
                <p className="compra-auto-precio">USD {Number(auto.precio).toLocaleString()}</p>
              </div>
              <button
                type="button"
                className="btn-compra-volver"
                onClick={() => navigate('/catalogo')}
              >
                ← Volver al catálogo
              </button>
            </aside>
          )}

          <main className="compra-form-container">
            {enviado ? (
              <div className="compra-success">
                <div className="compra-success-icon">✓</div>
                <h2>¡Oferta enviada!</h2>
                <p>Hemos recibido tu propuesta. Un ejecutivo de ventas te contactará en menos de 24 horas para continuar la negociación.</p>
                <button
                  type="button"
                  className="btn-detail-action btn-detail-negociar"
                  onClick={() => navigate('/catalogo')}
                >
                  VOLVER AL CATÁLOGO
                </button>
              </div>
            ) : (
              <form className="compra-form" onSubmit={handleSubmit}>
                <h3>Tu propuesta</h3>

                <div className="compra-form-grid">
                  <div className="compra-field">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                  <div className="compra-field">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                  </div>
                  <div className="compra-field">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      id="telefono"
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div className="compra-field">
                    <label htmlFor="oferta">Tu oferta (USD)</label>
                    <input
                      id="oferta"
                      type="number"
                      name="oferta"
                      value={form.oferta}
                      onChange={handleChange}
                      placeholder={auto ? `Precio publicado: USD ${Number(auto.precio).toLocaleString()}` : 'Ingresa tu oferta'}
                      required
                    />
                  </div>
                  <div className="compra-field compra-field-full">
                    <label htmlFor="mensaje">Mensaje adicional</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Cuéntanos más sobre tu propuesta o condiciones..."
                    />
                  </div>
                </div>

                <div className="compra-form-actions">
                  <button
                    type="button"
                    className="btn-compra-volver"
                    onClick={() => navigate('/catalogo')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-detail-action btn-detail-negociar">
                    ENVIAR OFERTA
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
