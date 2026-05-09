export default function InfoBlock({ title, lines = [] }) {
  return (
    <div className="info-block">
      <h3 className="info-block-title">{title}</h3>
      <div className="info-block-divider" />
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}
