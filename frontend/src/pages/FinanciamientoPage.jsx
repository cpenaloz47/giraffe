import { useState, useMemo, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import '../css/financiamiento.css';

/* ── Datos mock ── */
const condiciones = [
  { icon: 'bi-percent', titulo: 'TASAS COMPETITIVAS', desc: 'Desde 7.99% anual en pesos' },
  { icon: 'bi-calendar3', titulo: 'PLAZOS FLEXIBLES', desc: 'De 12 a 84 meses para pagar' },
  { icon: 'bi-cash-coin', titulo: 'ENGANCHE DESDE', desc: '20% del valor del vehículo' },
  { icon: 'bi-clock', titulo: 'APROBACIÓN RÁPIDA', desc: 'Respuesta en menos de 24 horas' },
  { icon: 'bi-check-circle', titulo: 'SIN PENALIZACIÓN', desc: 'por pagos anticipados o liquidación' },
];

const valoresAuto = [
  { value: '50000', label: 'USD 50,000' },
  { value: '100000', label: 'USD 100,000' },
  { value: '150000', label: 'USD 150,000' },
  { value: '200000', label: 'USD 200,000' },
  { value: '250000', label: 'USD 250,000' },
  { value: '300000', label: 'USD 300,000' },
  { value: '400000', label: 'USD 400,000' },
  { value: '500000', label: 'USD 500,000' },
];

const engancheOpciones = [
  { value: '20', label: '20%' },
  { value: '30', label: '30%' },
  { value: '40', label: '40%' },
  { value: '50', label: '50%' },
];

const plazoOpciones = [
  { value: '12', label: '12 meses' },
  { value: '24', label: '24 meses' },
  { value: '36', label: '36 meses' },
  { value: '48', label: '48 meses' },
  { value: '60', label: '60 meses' },
  { value: '72', label: '72 meses' },
  { value: '84', label: '84 meses' },
];

const monedas = [
  { value: 'USD', label: 'USD - Dólares' },
  { value: 'CLP', label: 'CLP - Pesos chilenos' },
];

export default function FinanciamientoPage() {
  const [form, setForm] = useState({
    valor: '', enganche: '', plazo: '', moneda: 'USD',
  });
  const [resultado, setResultado] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setResultado(null);
  }, []);

  const canCalculate = useMemo(() => {
    return form.valor && form.enganche && form.plazo;
  }, [form.valor, form.enganche, form.plazo]);

  const calcular = useCallback(() => {
    if (!canCalculate) return;

    const valor = parseFloat(form.valor);
    const enganchePct = parseFloat(form.enganche) / 100;
    const plazo = parseInt(form.plazo);
    const tasaAnual = 7.99 / 100;
    const tasaMensual = tasaAnual / 12;

    const montoFinanciar = valor * (1 - enganchePct);
    const engancheValor = valor * enganchePct;

    // Fórmula de amortización francesa
    const cuota = montoFinanciar *
      (tasaMensual * Math.pow(1 + tasaMensual, plazo)) /
      (Math.pow(1 + tasaMensual, plazo) - 1);

    const totalPagar = cuota * plazo;
    const totalIntereses = totalPagar - montoFinanciar;

    setResultado({
      cuota,
      montoFinanciar,
      engancheValor,
      totalPagar,
      totalIntereses,
      plazo,
      tasa: 7.99,
      moneda: form.moneda,
    });
  }, [form, canCalculate]);

  const fmt = (n) => {
    const currency = form.moneda === 'CLP' ? 'CLP' : 'USD';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency', currency, maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <div className="financiamiento-page">
      <div className="container">
        <PageHeader
          title="FINANCIAMIENTO A TU MEDIDA"
          subtitle="Te ofrecemos las mejores opciones de financiamiento con tasas competitivas y procesos simples y rápidos."
        />

        {/* ── Condiciones ── */}
        <section className="fin-section">
          <h2 className="fin-section-title">NUESTRAS CONDICIONES DE FINANCIAMIENTO</h2>
          <div className="condiciones-grid">
            {condiciones.map((item) => (
              <CondicionCard key={item.titulo} {...item} />
            ))}
          </div>
        </section>

        {/* ── Simulador ── */}
        <section className="fin-section">
          <h2 className="fin-section-title">SIMULA TU FINANCIAMIENTO</h2>
          <div className="simulador">
            <div className="row g-0">
              {/* Formulario */}
              <div className="col-lg-6 sim-form-col">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">VALOR DEL AUTO ({form.moneda})</label>
                    <select className="form-select" name="valor" value={form.valor} onChange={handleChange}>
                      <option value="" disabled>Seleccionar</option>
                      {valoresAuto.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">ENGANCHE (%)</label>
                    <select className="form-select" name="enganche" value={form.enganche} onChange={handleChange}>
                      <option value="" disabled>Seleccionar</option>
                      {engancheOpciones.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">PLAZO (MESES)</label>
                    <select className="form-select" name="plazo" value={form.plazo} onChange={handleChange}>
                      <option value="" disabled>Seleccionar</option>
                      {plazoOpciones.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">MONEDA</label>
                    <select className="form-select" name="moneda" value={form.moneda} onChange={handleChange}>
                      {monedas.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className={`btn btn-calcular ${!canCalculate ? 'disabled' : ''}`}
                  onClick={calcular}
                  disabled={!canCalculate}
                >
                  CALCULAR
                </button>
              </div>

              {/* Resultado */}
              <div className="col-lg-6 sim-result-col">
                {resultado ? (
                  <ResultadoSimulacion resultado={resultado} fmt={fmt} />
                ) : (
                  <div className="sim-placeholder">
                    <i className="bi bi-calculator" />
                    <p className="sim-placeholder-title">Tu mensualidad estimada será mostrada aquí</p>
                    <p className="sim-placeholder-desc">Completa los datos para obtener una simulación personalizada.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Instituciones aliadas ── */}
        <section className="fin-section">
          <div className="instituciones-image">
            <img src="/bancos.png" alt="Bancos aliados" />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Sub-componentes ── */

function CondicionCard({ icon, titulo, desc }) {
  return (
    <div className="condicion-card">
      <div className="condicion-icon">
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <h3 className="condicion-titulo">{titulo}</h3>
        <p className="condicion-desc">{desc}</p>
      </div>
    </div>
  );
}

function ResultadoSimulacion({ resultado, fmt }) {
  return (
    <div className="sim-resultado">
      <div className="sim-cuota-label">TU CUOTA MENSUAL ESTIMADA</div>
      <div className="sim-cuota-valor">{fmt(resultado.cuota)}</div>
      <div className="sim-cuota-plazo">durante {resultado.plazo} meses</div>

      <div className="sim-desglose">
        <div className="sim-desglose-row">
          <span>Monto a financiar</span>
          <span>{fmt(resultado.montoFinanciar)}</span>
        </div>
        <div className="sim-desglose-row">
          <span>Enganche</span>
          <span>{fmt(resultado.engancheValor)}</span>
        </div>
        <div className="sim-desglose-row">
          <span>Tasa anual</span>
          <span>{resultado.tasa}%</span>
        </div>
        <div className="sim-desglose-row">
          <span>Total intereses</span>
          <span>{fmt(resultado.totalIntereses)}</span>
        </div>
        <div className="sim-desglose-row sim-desglose-total">
          <span>Total a pagar</span>
          <span>{fmt(resultado.totalPagar)}</span>
        </div>
      </div>
    </div>
  );
}
