const socialLinks = [
  { icon: 'bi-facebook', label: 'Facebook', url: '#' },
  { icon: 'bi-instagram', label: 'Instagram', url: '#' },
  { icon: 'bi-youtube', label: 'YouTube', url: '#' },
  { icon: 'bi-linkedin', label: 'LinkedIn', url: '#' },
];

export default function Footer({ year = 2026 }) {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-social">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="social-link"
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`bi ${link.icon}`} />
            </a>
          ))}
        </div>
        <p className="footer-copy">
          &copy; {year} Giraffe Roadster. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
