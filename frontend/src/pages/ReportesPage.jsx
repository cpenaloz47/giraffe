import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { getUsuarios, getNegociaciones, getCitas, getContactMessages } from '../services/api';

const TABS = [
  { key: 'citas',          label: 'CITAS' },
  { key: 'negociaciones',  label: 'NEGOCIACIONES' },
  { key: 'contactos',      label: 'CONTACTOS' },
  { key: 'usuarios',       label: 'USUARIOS' },
];

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function Badge({ value }) {
  const isAdmin = value === 'ADMIN';
  return (
    <span className={`reporte-badge ${isAdmin ? 'reporte-badge--admin' : 'reporte-badge--user'}`}>
      {value}
    </span>
  );
}

function EmptyRow({ cols }) {
  return (
    <tr>
      <td colSpan={cols} className="reporte-empty-row">Sin registros</td>
    </tr>
  );
}

export default function ReportesPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('citas');
  const [data, setData] = useState({ citas: [], negociaciones: [], contactos: [], usuarios: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const loadData = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (tab === 'citas')         result = await getCitas();
      if (tab === 'negociaciones') result = await getNegociaciones();
      if (tab === 'contactos')     result = await getContactMessages();
      if (tab === 'usuarios')      result = await getUsuarios();
      setData((prev) => ({ ...prev, [tab]: result?.data || [] }));
    } catch (err) {
      setError(err.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const rows = data[activeTab] || [];

  return (
    <div className="reportes-page">
      <div className="container">
        <PageHeader
          title="REPORTES"
          subtitle="Panel de administración — visualiza citas, negociaciones, contactos y usuarios."
        />

        <div className="reporte-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`reporte-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTab(tab.key)}
            >
              {tab.label}
              {data[tab.key]?.length > 0 && (
                <span className="reporte-tab-count">{data[tab.key].length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="reporte-content">
          {loading && <div className="reporte-loading">Cargando...</div>}
          {error && <div className="reporte-error">{error}</div>}

          {!loading && !error && (
            <div className="reporte-table-wrap">

              {activeTab === 'citas' && (
                <table className="reporte-table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Email</th><th>Teléfono</th>
                      <th>Auto</th><th>Fecha</th><th>Hora</th><th>Comentario</th><th>Registrado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? <EmptyRow cols={8} /> : rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.nombre}</td>
                        <td>{r.email}</td>
                        <td>{r.telefono || '—'}</td>
                        <td>{r.auto_marca && r.auto_modelo ? `${r.auto_marca} ${r.auto_modelo}` : '—'}</td>
                        <td>{formatDate(r.fecha)}</td>
                        <td>{r.hora}</td>
                        <td className="reporte-td-wrap">{r.comentario || '—'}</td>
                        <td>{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'negociaciones' && (
                <table className="reporte-table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Email</th><th>Teléfono</th>
                      <th>Auto</th><th>Precio publicado</th><th>Oferta</th><th>Mensaje</th><th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? <EmptyRow cols={8} /> : rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.nombre}</td>
                        <td>{r.email}</td>
                        <td>{r.telefono || '—'}</td>
                        <td>{r.auto_marca && r.auto_modelo ? `${r.auto_marca} ${r.auto_modelo}` : '—'}</td>
                        <td>{r.auto_precio ? `USD ${Number(r.auto_precio).toLocaleString()}` : '—'}</td>
                        <td className="reporte-precio">USD {Number(r.oferta).toLocaleString()}</td>
                        <td className="reporte-td-wrap">{r.mensaje || '—'}</td>
                        <td>{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'contactos' && (
                <table className="reporte-table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Email</th><th>Teléfono</th>
                      <th>Motivo</th><th>Mensaje</th><th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? <EmptyRow cols={6} /> : rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.nombre}</td>
                        <td>{r.email}</td>
                        <td>{r.telefono || '—'}</td>
                        <td><span className="reporte-motivo">{r.motivo}</span></td>
                        <td className="reporte-td-wrap">{r.mensaje}</td>
                        <td>{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'usuarios' && (
                <table className="reporte-table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Email</th><th>Teléfono</th>
                      <th>Rol</th><th>Activo</th><th>Registrado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? <EmptyRow cols={6} /> : rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.nombre}</td>
                        <td>{r.email}</td>
                        <td>{r.telefono || '—'}</td>
                        <td><Badge value={r.rol} /></td>
                        <td>{r.activo ? '✓' : '✗'}</td>
                        <td>{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
