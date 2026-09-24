import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
    window.location.reload();
  };

  return (
    <nav className="site-nav">
      <Link to="/" className="brand-mark" aria-label="Poojan Dave home">
        <span>PD</span>
        <strong>Poojan Dave</strong>
      </Link>

      <div className="site-links">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/tasks">Workspace</Link>
      </div>

      <div className="nav-actions">
        {token ? (
          <>
            {user && <span className="nav-email">{user.email}</span>}
            <button onClick={handleLogout} className="nav-button nav-button-muted">
              Log out
            </button>
          </>
        ) : (
          <Link to="/auth" className="nav-button">Log in <span aria-hidden="true">↗</span></Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;