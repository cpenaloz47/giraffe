import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { getBrands, getCars, getCarById, deleteCar, createCar } from '../services/api';
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
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [autos, setAutos] = useState([]);
  const [brands, setBrands] = useState([{ value: 'todas', label: 'Todas las marcas' }]);
  const [loading, setLoading] = useState(true);
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewCarModal, setShowNewCarModal] = useState(false);
  const [newCar, setNewCar] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    tipoCarroceria: '',
    transmision: '',
    combustible: '',
    kilometraje: '',
    descripcion: '',
    estado: 'nuevo',
    imagenUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const { isAdmin } = useAuth();

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

  const handleNewCarChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const openNewCarModal = useCallback(() => {
    setNewCar({
      marca: '',
      modelo: '',
      anio: '',
      precio: '',
      tipoCarroceria: '',
      transmision: '',
      combustible: '',
      kilometraje: '',
      descripcion: '',
      estado: 'nuevo',
      imagenUrl: '',
    });
    setFormErrors({});
    setShowNewCarModal(true);
  }, []);

  const closeNewCarModal = useCallback(() => {
    setShowNewCarModal(false);
    setFormErrors({});
  }, []);

  const validateNewCar = useCallback(() => {
    const errors = {};

    if (!newCar.marca.trim()) errors.marca = 'Marca es requerida';
    if (!newCar.modelo.trim()) errors.modelo = 'Modelo es requerido';
    if (!newCar.anio) errors.anio = 'Año es requerido';
    if (!newCar.precio) errors.precio = 'Precio es requerido';
    if (!newCar.tipoCarroceria) errors.tipoCarroceria = 'Tipo de carrocería es requerido';
    if (!newCar.transmision) errors.transmision = 'Transmisión es requerida';
    if (!newCar.combustible) errors.combustible = 'Combustible es requerido';
    if (!newCar.descripcion.trim()) errors.descripcion = 'Descripción es requerida';

    return errors;
  }, [newCar]);

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

  const handleCreateCar = useCallback(async (e) => {
    e.preventDefault();
    const errors = validateNewCar();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await createCar({
        marca: newCar.marca,
        modelo: newCar.modelo,
        anio: Number(newCar.anio),
        precio: Number(newCar.precio),
        tipoCarroceria: newCar.tipoCarroceria,
        transmision: newCar.transmision,
        combustible: newCar.combustible,
        kilometraje: Number(newCar.kilometraje) || 0,
        descripcion: newCar.descripcion,
        estado: newCar.estado,
        imagenUrl: newCar.imagenUrl,
      });
      closeNewCarModal();
      loadCars();
    } catch (err) {
      setError(err.message || 'Error creando nuevo auto');
    }
  }, [closeNewCarModal, loadCars, newCar, validateNewCar]);

  const handleDeleteCar = useCallback(async (id) => {
    if (!window.confirm('¿Marcar auto como vendido y eliminar registro?')) return;

    try {
      await deleteCar(id);
      if (selectedAuto?.id === id) {
        closeModal();
      }
      loadCars();
    } catch (err) {
      setError(err.message || 'Error eliminando auto');
    }
  }, [closeModal, loadCars, selectedAuto]);

  useEffect(() => {
    loadBrands();
    loadCars();
  }, [loadBrands, loadCars]);

  /*
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
  }, [autos]);*/

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
              {isAdmin && (
                <button type="button" className="btn btn-add-product" onClick={openNewCarModal}>
                  AGREGAR NUEVO PRODUCTO
                </button>
              )}
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
                      <div className="catalogo-card-actions">
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn-card btn-sold"
                            onClick={() => handleDeleteCar(auto.id)}
                          >
                            VENDIDO
                          </button>
                        )}
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
                  {(() => {
                    const imgs = (selectedAuto.imagenes || selectedAuto.galeria || []).map((img) => img.url || img);
                    const portada = selectedAuto.imagenPortada || selectedAuto.imagen || '';
                    const lista = imgs.length > 0 ? imgs : (portada ? [portada] : []);
                    return lista.map((src, index) => (
                      <div
                        key={index}
                        className="catalogo-details-gallery-image"
                        style={{ backgroundImage: `url('/autos/${src}')` }}
                      />
                    ));
                  })()}
                </div>
              </section>
            </div>

            <div className="catalogo-details-actions">
              <button
                type="button"
                className="btn-detail-action btn-detail-credito"
                onClick={() => { closeModal(); navigate('/financiamiento', { state: { auto: selectedAuto } }); }}
              >
                CALCULAR CRÉDITO
              </button>
              <button
                type="button"
                className="btn-detail-action btn-detail-contactar"
                onClick={() => { closeModal(); navigate('/contacto', { state: { auto: selectedAuto } }); }}
              >
                CONTACTAR
              </button>
              <button
                type="button"
                className="btn-detail-action btn-detail-negociar"
                onClick={() => { closeModal(); navigate('/compra', { state: { auto: selectedAuto } }); }}
              >
                NEGOCIAR
              </button>
              <button
                type="button"
                className="btn-detail-action btn-detail-agendar"
                onClick={() => { closeModal(); navigate('/agenda', { state: { auto: selectedAuto } }); }}
              >
                AGENDAR
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewCarModal && (
        <div className="catalogo-details-modal-backdrop" onClick={closeNewCarModal}>
          <div className="catalogo-details-modal catalogo-newcar-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="catalogo-details-close" onClick={closeNewCarModal} aria-label="Cerrar">
              ×
            </button>
            <div className="catalogo-details-header">
              <div>
                <h3>Agregar nuevo producto</h3>
                <p className="catalogo-details-subtitle">Completa los datos del nuevo auto para agregarlo al catálogo.</p>
              </div>
            </div>

            <form className="catalogo-newcar-form" onSubmit={handleCreateCar}>
              <div className="catalogo-form-grid">
                <div className="catalogo-field">
                  <label>Marca</label>
                  <input type="text" name="marca" value={newCar.marca} onChange={handleNewCarChange} />
                  {formErrors.marca && <span className="error-text">{formErrors.marca}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Modelo</label>
                  <input type="text" name="modelo" value={newCar.modelo} onChange={handleNewCarChange} />
                  {formErrors.modelo && <span className="error-text">{formErrors.modelo}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Año</label>
                  <input type="number" name="anio" value={newCar.anio} onChange={handleNewCarChange} />
                  {formErrors.anio && <span className="error-text">{formErrors.anio}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Precio</label>
                  <input type="number" name="precio" value={newCar.precio} onChange={handleNewCarChange} />
                  {formErrors.precio && <span className="error-text">{formErrors.precio}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Tipo de carrocería</label>
                  <select name="tipoCarroceria" value={newCar.tipoCarroceria} onChange={handleNewCarChange}>
                    <option value="">Selecciona un tipo</option>
                    {tiposCarroceria.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                  {formErrors.tipoCarroceria && <span className="error-text">{formErrors.tipoCarroceria}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Transmisión</label>
                  <select name="transmision" value={newCar.transmision} onChange={handleNewCarChange}>
                    <option value="">Selecciona una transmisión</option>
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                  </select>
                  {formErrors.transmision && <span className="error-text">{formErrors.transmision}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Combustible</label>
                  <select name="combustible" value={newCar.combustible} onChange={handleNewCarChange}>
                    <option value="">Selecciona combustible</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                  {formErrors.combustible && <span className="error-text">{formErrors.combustible}</span>}
                </div>
                <div className="catalogo-field">
                  <label>Kilometraje</label>
                  <input type="number" name="kilometraje" value={newCar.kilometraje} onChange={handleNewCarChange} />
                </div>
                <div className="catalogo-field">
                  <label>Estado</label>
                  <select name="estado" value={newCar.estado} onChange={handleNewCarChange}>
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                  </select>
                </div>
                <div className="catalogo-field catalogo-field-full">
                  <label>Imagen URL</label>
                  <input type="text" name="imagenUrl" value={newCar.imagenUrl} onChange={handleNewCarChange} />
                </div>
                <div className="catalogo-field catalogo-field-full">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={newCar.descripcion} onChange={handleNewCarChange} rows="4" />
                  {formErrors.descripcion && <span className="error-text">{formErrors.descripcion}</span>}
                </div>
              </div>

              <div className="catalogo-newcar-actions">
                <button type="button" className="btn btn-buscar btn-buscar--ghost" onClick={closeNewCarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary-giraffe btn-buscar">
                  GUARDAR PRODUCTO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
