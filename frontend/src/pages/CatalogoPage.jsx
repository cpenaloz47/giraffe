import { useMemo, useState, useCallback, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { getBrands, getCars, getCarById } from '../services/api';
import { modelos, tiposCarroceria } from '../data/mock';

const ordenOpciones = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio-asc', label: 'Precio más bajo' },
  { value: 'precio-desc', label: 'Precio más alto' },
];

const initialFilters = {
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
};

export default function CatalogoPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [autos, setAutos] = useState([]);
  const [brands, setBrands] = useState([{ value: 'todas', label: 'Todas las marcas' }]);
  const [loading, setLoading] = useState(true);
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  const closeModal = useCallback(() => {
    setSelectedAuto(null);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const getQueryParams = useCallback((currentFilters) => {
    const params = {};
    if (currentFilters.marca && currentFilters.marca !== 'todas') params.marca = currentFilters.marca;
    if (currentFilters.modelo && currentFilters.modelo !== 'Todos los modelos') params.modelo = currentFilters.modelo;
    if (currentFilters.tipo && currentFilters.tipo !== 'todos') params.tipo = currentFilters.tipo;
    if (currentFilters.transmision && currentFilters.transmision !== 'Todas') params.transmision = currentFilters.transmision;
    if (currentFilters.combustible && currentFilters.combustible !== 'Todos') params.combustible = currentFilters.combustible;
    if (currentFilters.precioDesde) params.minPrice = currentFilters.precioDesde;
    if (currentFilters.precioHasta) params.maxPrice = currentFilters.precioHasta;
    if (currentFilters.anioDesde) params.minYear = currentFilters.anioDesde;
    if (currentFilters.anioHasta) params.maxYear = currentFilters.anioHasta;
    if (currentFilters.estado) params.estado = currentFilters.estado;

    if (currentFilters.orden === 'precio-asc') {
      params.sortBy = 'precio';
      params.sortOrder = 'asc';
    } else if (currentFilters.orden === 'precio-desc') {
      params.sortBy = 'precio';
      params.sortOrder = 'desc';
    } else {
      params.sortBy = 'created_at';
      params.sortOrder = 'desc';
    }

    return params;
  }, []);

  const loadBrands = useCallback(async () => {
    try {
      const result = await getBrands();
      const items = result.data || [];
      setBrands([{ value: 'todas', label: 'Todas las marcas' }, ...items.map((brand) => ({ value: brand.nombre, label: brand.nombre }))]);
    } catch (err) {
      console.error('Error cargando marcas:', err);
    }
  }, []);

  const loadCars = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = getQueryParams(currentFilters);
      const result = await getCars(params);
      setAutos(result.data || []);
    } catch (err) {
      setError(err.message || 'Error cargando autos');
      setAutos([]);
    } finally {
      setLoading(false);
    }
  }, [filters, getQueryParams]);

  const loadCarDetails = useCallback(async (id) => {
    setDetailLoading(true);
    try {
      const car = await getCarById(id);
      setSelectedAuto(car);
    } catch (err) {
      console.error('Error cargando detalle de auto:', err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
    loadCars();
  }, [loadBrands, loadCars]);

  const autosFiltrados = useMemo(() => {
    return autos.map((auto) => ({
      ...auto,
      precio: Number(auto.precio),
      galeria: auto.galeria || [],
      imagenPortada: auto.imagenPortada || auto.imagen || '',
    }));
  }, [autos]);

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
                  {brands.map((marca) => (
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

              <button type="button" className="btn btn-primary-giraffe btn-buscar" onClick={() => loadCars(filters)}>
                BUSCAR AUTOS
              </button>
              <button type="button" className="btn btn-buscar btn-buscar--ghost" onClick={() => { handleClear(); loadCars(initialFilters); }}>
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

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="catalogo-loading">Cargando autos...</div>}

            <div className="catalogo-grid">
              {!loading && autosFiltrados.length === 0 && (
                <div className="catalogo-empty">No se encontraron autos con esos filtros.</div>
              )}

              {autosFiltrados.map((auto) => (
                <div className="catalogo-card" key={auto.id}>
                  <div className="catalogo-card-image" style={{ backgroundImage: `url('/autos/${auto.imagenPortada || auto.galeria?.[0] || '/default-car.png'}')` }} />
                  <div className="catalogo-card-body">
                    <div className="catalogo-card-top">
                      <span className="catalogo-card-brand">{auto.marca}</span>
                      <span className="catalogo-card-favorite"><i className="bi bi-heart" /></span>
                    </div>
                    <h4>{auto.modelo}</h4>
                    <p>{auto.anio} · {auto.tipoCarroceria}</p>
                    <div className="catalogo-card-details">
                      <span>{auto.transmision}</span>
                      <span>{auto.combustible}</span>
                    </div>
                    <div className="catalogo-card-footer">
                      <span className="catalogo-card-price">USD {auto.precio.toLocaleString()}</span>
                      <button
                        type="button"
                        className="btn btn-card"
                        onClick={() => loadCarDetails(auto.id)}
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
                <p className="catalogo-details-subtitle">{selectedAuto.anio} · {selectedAuto.tipoCarroceria} · {selectedAuto.transmision}</p>
              </div>
              <span className="catalogo-card-price">USD {Number(selectedAuto.precio).toLocaleString()}</span>
            </div>

            <div className="catalogo-details-grid">
              <section className="catalogo-details-section">
                <h4>Descripción</h4>
                <p>{selectedAuto.descripcion}</p>
                <ul className="catalogo-details-specs">
                  <li><strong>Kilometraje:</strong> {Number(selectedAuto.kilometraje).toLocaleString()} km</li>
                  <li><strong>Combustible:</strong> {selectedAuto.combustible}</li>
                  <li><strong>Transmisión:</strong> {selectedAuto.transmision}</li>
                </ul>
              </section>

              <section className="catalogo-details-section">
                <h4>Vistas del auto</h4>
                <div className="catalogo-details-gallery">
                  {((selectedAuto.imagenes || selectedAuto.galeria) || []).map((imagen, index) => (
                    <div
                      key={index}
                      className="catalogo-details-gallery-image"
                      style={{ backgroundImage: `url('${imagen.url || imagen}')` }}
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
