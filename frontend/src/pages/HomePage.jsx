import BrandCard from '../components/ui/BrandCard';
import { brands } from '../data/mock';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="container position-relative hero-container">
          <div className="hero-image" />
          <div className="hero-overlay" />
        </div>
      </section>

      {/* Quiénes somos + Marcas */}
      <section className="about-brands-section" id="nosotros">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <h2 className="section-title">¿QUIÉNES SOMOS?</h2>
              <div className="section-divider" />
              <p className="about-text">
                Somos una empresa especializada en la compra, venta y
                asesoría de autos de lujo. Trabajamos con las marcas
                más exclusivas del mundo para ofrecerte vehículos que
                combinan diseño, performance y prestigio.
              </p>
              <p className="about-text">
                Nuestro compromiso es brindar una experiencia
                premium, transparente y personalizada.
              </p>
            </div>
            <div className="col-lg-7">
              <h2 className="section-title text-lg-end">MARCAS CON LAS QUE TRABAJAMOS</h2>
              <div className="section-divider ms-lg-auto" />
              <div className="brands-grid">
                {brands.map((brand) => (
                  <BrandCard key={brand.nombre} nombre={brand.nombre} color={brand.color} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
