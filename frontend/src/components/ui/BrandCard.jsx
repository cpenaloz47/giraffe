export default function BrandCard({ nombre, color = '#44403C' }) {
  return (
    <div className="brand-card">
      <span style={{ color }}>{nombre}</span>
    </div>
  );
}
