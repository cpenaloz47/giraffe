import { useState, useCallback } from 'react';
import { useForm } from '../hooks/useForm';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/ui/PageHeader';
import InfoBlock from '../components/ui/InfoBlock';
import { ciudades, motivosContacto, contactInfo } from '../data/mock';
import '../css/contacto.css';

const initialValues = {
  nombre: '', telefono: '', email: '', ciudad: '',
  preferencia: 'telefono', motivo: '', detalle: '', privacidad: false,
};

const validate = (values) => {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'Nombre es requerido';
  if (!values.telefono.trim()) errors.telefono = 'Teléfono es requerido';
  if (!values.email.trim()) errors.email = 'Email es requerido';
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email no válido';
  if (!values.ciudad) errors.ciudad = 'Selecciona una ciudad';
  if (!values.motivo) errors.motivo = 'Selecciona un motivo';
  if (!values.privacidad) errors.privacidad = 'Debes aceptar la política';
  return errors;
};

export default function ContactoPage() {
  const { values, errors, handleChange, handleSubmit } = useForm(initialValues, validate);
  const { showToast } = useToast();
  const [success, setSuccess] = useState(false);

  const onSubmit = useCallback((data) => {
    console.log('📧 Datos del formulario (mock):', data);
    setSuccess(true);
    showToast('Mensaje enviado correctamente');
  }, [showToast]);

  if (success) {
    return (
      <div className="contact-page">
        <div className="container">
          <div className="contact-form">
            <div className="contact-success">
              <div className="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="#C2A76E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2>¡Mensaje enviado!</h2>
              <p>Gracias {values.nombre.split(' ')[0]}, hemos recibido tu consulta.
                Un ejecutivo se pondrá en contacto contigo a la brevedad.</p>
            </div>
          </div>
          <div className="contact-info-image">
            <img src="/contactos.png" alt="Información de contacto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="container">
        <PageHeader
          title="¡ESTAMOS PARA AYUDARTE!"
          subtitle="Completa el formulario y uno de nuestros ejecutivos se pondrá en contacto contigo a la brevedad."
        />

        <form className="contact-forms-wrapper" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Tarjeta 1: Tus datos */}
          <div className="contact-form contact-form-left">
            <h2 className="form-col-title">TUS DATOS</h2>

            <div className="mb-3">
              <label className="form-label">NOMBRE COMPLETO *</label>
              <input
                type="text" name="nombre"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                placeholder="Ingresa tu nombre completo"
                value={values.nombre} onChange={handleChange}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label">TELÉFONO *</label>
                <input
                  type="tel" name="telefono"
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu número de teléfono"
                  value={values.telefono} onChange={handleChange}
                />
              </div>
              <div className="col-sm-6">
                <label className="form-label">CORREO ELECTRÓNICO *</label>
                <input
                  type="email" name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu correo electrónico"
                  value={values.email} onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">CIUDAD *</label>
              <select
                name="ciudad"
                className={`form-select ${errors.ciudad ? 'is-invalid' : ''}`}
                value={values.ciudad} onChange={handleChange}
              >
                <option value="" disabled>Selecciona tu ciudad</option>
                {ciudades.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">¿CÓMO PREFIERES QUE TE CONTACTEMOS? *</label>
              <div className="contact-preference">
                {['telefono', 'correo', 'whatsapp'].map((opt) => (
                  <div className="form-check" key={opt}>
                    <input
                      className="form-check-input" type="radio"
                      name="preferencia" id={`pref-${opt}`} value={opt}
                      checked={values.preferencia === opt} onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={`pref-${opt}`}>
                      {opt === 'telefono' ? 'Teléfono' : opt === 'correo' ? 'Correo electrónico' : 'WhatsApp'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <p className="campos-obligatorios">* Campos obligatorios</p>
          </div>

          {/* Tarjeta 2: Motivo de contacto */}
          <div className="contact-form contact-form-right">
            <h2 className="form-col-title">MOTIVO DE CONTACTO</h2>

            <div className="mb-3">
              <label className="form-label">¿EN QUÉ PODEMOS AYUDARTE? *</label>
              <select
                name="motivo"
                className={`form-select ${errors.motivo ? 'is-invalid' : ''}`}
                value={values.motivo} onChange={handleChange}
              >
                <option value="" disabled>Selecciona el motivo de tu consulta</option>
                {motivosContacto.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">DETALLE DE TU CONSULTA</label>
              <textarea
                name="detalle" className="form-control" rows="5" maxLength="500"
                placeholder="Cuéntanos más sobre tu consulta o lo que necesitas..."
                value={values.detalle} onChange={handleChange}
              />
              <div className="char-counter">{values.detalle.length}/500 caracteres</div>
            </div>

            <div className={`form-check privacidad-check ${errors.privacidad ? 'is-invalid' : ''}`}>
              <input
                className={`form-check-input ${errors.privacidad ? 'is-invalid' : ''}`}
                type="checkbox" name="privacidad" id="contactPrivacidad"
                checked={values.privacidad} onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="contactPrivacidad">
                Autorizo el tratamiento de mis datos personales de acuerdo con la{' '}
                <a href="#" className="link-privacidad">Política de Privacidad</a>.
              </label>
            </div>
          </div>

          <div className="submit-wrapper">
            <button type="submit" className="btn btn-enviar">ENVIAR CONSULTA</button>
          </div>
        </form>

        <div className="submit-wrapper">
          <div className="contact-info-image">
            <img src="/contactos.png" alt="Información de contacto" />
          </div>
        </div>
      </div>
    </div>
  );
}
