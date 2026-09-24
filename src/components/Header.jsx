function Header({ name }) {
  return (
    <header className="hero-header">
      <div className="hero-copy">
        <span className="eyebrow">COMPUTER ENGINEERING / 2026</span>
        <h1>{name}</h1>
        <p>Frontend-focused developer turning curious ideas into useful digital experiences.</p>
        <div className="hero-actions">
          <a href="#about" className="primary-action">Explore my work <span aria-hidden="true">↓</span></a>
          <a href="mailto:poojandave09@gmail.com" className="text-action">Let's connect <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="hero-badge" aria-label="Available for learning and collaboration">
        <span className="status-dot" />
        <strong>Available</strong>
        <small>for collaboration</small>
      </div>
    </header>
  );
}

export default Header;