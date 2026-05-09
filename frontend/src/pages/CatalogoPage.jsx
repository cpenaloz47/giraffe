import { useMemo, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { autos, marcas, modelos, tiposCarroceria } from '../data/mock';

const ordenOpciones = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio-asc', label: 'Precio más bajo' },
  { value: 'precio-desc', label: 'Precio más alto' },
];

export default function CatalogoPage() {
  const [filters, setFilters] = useState({
    estado: 'nuevo',
    marca: 'todas',
    modelo: 'Todos los modelos',
    anioDesde: '',
    anioHasta: '',
    precioDesde: '',
    precioHasta: '',
    tipo: 'todos',
    transmision: 'Todas',
    combustible: 'Todos',
    orden: 'recientes',
  });
  const [selectedAuto, setSelectedAuto] = useState(null);

  const closeModal = useCallback(() => {
    setSelectedAuto(null);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters({
      estado: 'nuevo',
      marca: 'todas',
      modelo: 'Todos los modelos',
      anioDesde: '',
      anioHasta: '',
      precioDesde: '',
      precioHasta: '',
      tipo: 'todos',
      transmision: 'Todas',
      combustible: 'Todos',
      orden: 'recientes',
    });
  }, []);

  const autosFiltrados = useMemo(() => {
    return autos
      .filter((auto) => {
        if (filters.estado && auto.estado !== filters.estado) return false;
        if (filters.marca !== 'todas' && auto.marca.toLowerCase() !== filters.marca) return false;
        if (filters.modelo !== 'Todos los modelos' && auto.modelo !== filters.modelo) return false;
        if (filters.tipo !== 'todos' && auto.tipoCarroceria !== filters.tipo) return false;
        if (filters.transmision !== 'Todas' && auto.transmision !== filters.transmision) return false;
        if (filters.combustible !== 'Todos' && auto.combustible !== filters.combustible) return false;
        if (filters.anioDesde && auto.año < Number(filters.anioDesde)) return false;
        if (filters.anioHasta && auto.año > Number(filters.anioHasta)) return false;
        if (filters.precioDesde && auto.precio < Number(filters.precioDesde)) return false;
        if (filters.precioHasta && auto.precio > Number(filters.precioHasta)) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.orden === 'precio-asc') return a.precio - b.precio;
        if (filters.orden === 'precio-desc') return b.precio - a.precio;
        return b.año - a.año;
      });
  }, [filters]);

  return (
    <div className="catalogo-page">
      <div className="container">
        <PageHeader
          title="CATÁLOGO DE AUTOS"
          subtitle="Explora nuestra colección exclusiva de autos de lujo, nuevos y usados."
        />

        <div className="catalogo-layout">
          <aside className="catalogo-sidebar">
            <div className="catalogo-sidebar-card">
              <h3>BUSCA TU AUTO</h3>
              <div className="catalogo-tabs">
                <button
                  type="button"
                  className={`catalogo-tab ${filters.estado === 'nuevo' ? 'active' : ''}`}
                  onClick={() => setFilters((prev) => ({ ...prev, estado: 'nuevo' }))}
                >
                  NUEVOS
                </button>
                <button
                  type="button"
                  className={`catalogo-tab ${filters.estado === 'usado' ? 'active' : ''}`}
                  onClick={() => setFilters((prev) => ({ ...prev, estado: 'usado' }))}
                >
                  USADOS
                </button>
              </div>

              <div className="catalogo-field">
                <label>MARCA</label>
                <select name="marca" value={filters.marca} onChange={handleChange}>
                  {marcas.map((marca) => (
                    <option key={marca.value} value={marca.value}>{marca.label}</option>
                  ))}
                </select>
              </div>

              <div className="catalogo-field">
                <label>MODELO</label>
                <select name="modelo" value={filters.modelo} onChange={handleChange}>
                  {modelos.map((modelo) => (
                    <option key={modelo} value={modelo}>{modelo}</option>
                  ))}
                </select>
              </div>

              <div className="catalogo-row">
                <div className="catalogo-field">
                  <label>AÑO DESDE</label>
                  <input type="number" name="anioDesde" value={filters.anioDesde} onChange={handleChange} />
                </div>
                <div className="catalogo-field">
                  <label>AÑO HASTA</label>
                  <input type="number" name="anioHasta" value={filters.anioHasta} onChange={handleChange} />
                </div>
              </div>

              <div className="catalogo-row">
                <div className="catalogo-field">
                  <label>PRECIO DESDE</label>
                  <input type="number" name="precioDesde" value={filters.precioDesde} onChange={handleChange} />
                </div>
                <div className="catalogo-field">
                  <label>PRECIO HASTA</label>
                  <input type="number" name="precioHasta" value={filters.precioHasta} onChange={handleChange} />
                </div>
              </div>

              <div className="catalogo-field">
                <label>TIPO DE CARROCERÍA</label>
                <select name="tipo" value={filters.tipo} onChange={handleChange}>
                  {tiposCarroceria.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="catalogo-field">
                <label>TRANSMISIÓN</label>
                <select name="transmision" value={filters.transmision} onChange={handleChange}>
                  <option value="Todas">Todas</option>
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div className="catalogo-field">
                <label>COMBUSTIBLE</label>
                <select name="combustible" value={filters.combustible} onChange={handleChange}>
                  <option value="Todos">Todos</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <button type="button" className="btn btn-primary-giraffe btn-buscar" onClick={() => {}}>
                BUSCAR AUTOS
              </button>
              <button type="button" className="btn btn-buscar btn-buscar--ghost" onClick={handleClear}>
                LIMPIAR FILTROS
              </button>
            </div>
          </aside>

          <main className="catalogo-content">
            <div className="catalogo-head">
              <div>
                <span className="catalogo-results-label">RESULTADOS:</span>
                <span className="catalogo-results-count">{autosFiltrados.length} AUTOS</span>
              </div>
              <div className="catalogo-sort">
                <label>ORDENAR POR</label>
                <select name="orden" value={filters.orden} onChange={handleChange}>
                  {ordenOpciones.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="catalogo-grid">
              {autosFiltrados.map((auto) => (
                <div className="catalogo-card" key={auto.id}>
                  <div className="catalogo-card-image" style={{ backgroundImage: `url('${auto.imagen}')` }} />
                  <div className="catalogo-card-body">
                    <div className="catalogo-card-top">
                      <span className="catalogo-card-brand">{auto.marca}</span>
                      <span className="catalogo-card-favorite"><i className="bi bi-heart" /></span>
                    </div>
                    <h4>{auto.modelo}</h4>
                    <p>{auto.año} · {auto.tipoCarroceria}</p>
                    <div className="catalogo-card-details">
                      <span>{auto.transmision}</span>
                      <span>{auto.combustible}</span>
                    </div>
                    <div className="catalogo-card-footer">
                      <span className="catalogo-card-price">USD {auto.precio.toLocaleString()}</span>
                      <button
                        type="button"
                        className="btn btn-card"
                        onClick={() => setSelectedAuto(auto)}
                      >
                        VER DETALLES
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {selectedAuto && (
        <div className="catalogo-details-modal-backdrop" onClick={closeModal}>
          <div className="catalogo-details-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="catalogo-details-close" onClick={closeModal} aria-label="Cerrar">
              ×
            </button>
            <div className="catalogo-details-header">
              <div>
                <h3>{selectedAuto.marca} {selectedAuto.modelo}</h3>
                <p className="catalogo-details-subtitle">{selectedAuto.año} · {selectedAuto.tipoCarroceria} · {selectedAuto.transmision}</p>
              </div>
              <span className="catalogo-card-price">USD {selectedAuto.precio.toLocaleString()}</span>
            </div>

            <div className="catalogo-details-grid">
              <section className="catalogo-details-section">
                <h4>Descripción</h4>
                <p>{selectedAuto.descripcion}</p>
                <ul className="catalogo-details-specs">
                  <li><strong>Kilometraje:</strong> {selectedAuto.kilometraje.toLocaleString()} km</li>
                  <li><strong>Combustible:</strong> {selectedAuto.combustible}</li>
                  <li><strong>Transmisión:</strong> {selectedAuto.transmision}</li>
                </ul>
              </section>

              <section className="catalogo-details-section">
                <h4>Vistas del auto</h4>
                <div className="catalogo-details-gallery">
                  {selectedAuto.galeria.map((imagen, index) => (
                    <div
                      key={index}
                      className="catalogo-details-gallery-image"
                      style={{ backgroundImage: `url('${imagen}')` }}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
