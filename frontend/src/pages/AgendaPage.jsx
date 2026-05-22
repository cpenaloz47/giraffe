import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';

const horasDisponibles = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  fecha: '',
  hora: '',
  comentario: '',
};

export default function AgendaPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auto = state?.auto || null;
  const [form, setForm] = useState(initialForm);
  const [enviado, setEnviado] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="agenda-page">
      <div className="container">
        <PageHeader
          title="AGENDAR VISITA"
          subtitle="Elige el día y hora para visitar nuestra sala de exhibición y conocer tu auto en persona."
        />

        <div className="compra-layout">
          {auto && (
            <aside className="compra-auto-card">
              <h3>Auto a visitar</h3>
              <div className="compra-auto-info">
                <p className="compra-auto-nombre">{auto.marca} {auto.modelo}</p>
                <p className="compra-auto-detalle">{auto.anio} · {auto.tipoCarroceria} · {auto.transmision}</p>
                <p className="compra-auto-precio">USD {Number(auto.precio).toLocaleString()}</p>
              </div>
              <div className="agenda-horario-info">
                <p><strong>Horario de atención</strong></p>
                <p>Lunes a Viernes: 09:00 – 18:00</p>
                <p>Sábado: 09:00 – 13:00</p>
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
                <h2>¡Visita agendada!</h2>
                <p>
                  Tu visita está confirmada para el <strong>{form.fecha}</strong> a las <strong>{form.hora}</strong>.
                  Recibirás una confirmación en {form.email}.
                </p>
                <button
                  type="button"
                  className="btn-detail-action btn-detail-agendar"
                  onClick={() => navigate('/catalogo')}
                >
                  VOLVER AL CATÁLOGO
                </button>
              </div>
            ) : (
              <form className="compra-form" onSubmit={handleSubmit}>
                <h3>Reserva tu hora</h3>

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
                    <label htmlFor="fecha">Fecha de visita</label>
                    <input
                      id="fecha"
                      type="date"
                      name="fecha"
                      value={form.fecha}
                      min={today}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="compra-field compra-field-full">
                    <label>Hora disponible</label>
                    <div className="agenda-horas-grid">
                      {horasDisponibles.map((hora) => (
                        <button
                          key={hora}
                          type="button"
                          className={`agenda-hora-btn ${form.hora === hora ? 'selected' : ''}`}
                          onClick={() => setForm((prev) => ({ ...prev, hora }))}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                    {!form.hora && <input type="hidden" name="hora" required />}
                  </div>
                  <div className="compra-field compra-field-full">
                    <label htmlFor="comentario">Comentarios adicionales</label>
                    <textarea
                      id="comentario"
                      name="comentario"
                      value={form.comentario}
                      onChange={handleChange}
                      rows="3"
                      placeholder="¿Hay algo específico que quieras ver o probar durante la visita?"
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
                  <button
                    type="submit"
                    className="btn-detail-action btn-detail-agendar"
                    disabled={!form.hora}
                  >
                    CONFIRMAR VISITA
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
