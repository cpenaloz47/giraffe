export default function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header text-center">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}
