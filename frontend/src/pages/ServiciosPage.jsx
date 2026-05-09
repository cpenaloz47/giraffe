import PageHeader from '../components/ui/PageHeader';
import '../css/servicios.css';

export default function ServiciosPage() {
  return (
    <div className="servicios-page">
      <div className="container">
        <PageHeader
          title="NUESTROS SERVICIOS PROFESIONALES"
          subtitle="Todo lo que necesitas para comprar, mantener y disfrutar tu descapotable de lujo."
        />
      </div>

      {/* Banner de servicios */}
      <section className="servicios-banner">
        <div className="servicios-banner-inner">
          <img
            src="/servicios.png"
            alt="Servicios Giraffe Roadster — Informe vehicular, transferencia en línea, inspección, garantía, financiamiento, GPS, TAG y seguros"
            className="servicios-img"
          />
        </div>
      </section>

      {/* CTA inferior */}
      <section className="servicios-cta">
        <div className="container text-center">
          <p className="servicios-cta-text">
            ¿Tienes dudas sobre nuestros servicios?
          </p>
          <a href="/contacto" className="btn btn-primary-giraffe">CONTÁCTANOS</a>
        </div>
      </section>
    </div>
  );
}
