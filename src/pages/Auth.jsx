import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.message || 'Something went wrong');
        return;
      }

      // Store token and user info
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));

      // Navigate to tasks page
      navigate('/tasks');
      window.location.reload(); // refresh so NavBar re-reads auth state
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-mark">PD</div>
          <span className="auth-kicker">POOJAN DAVE</span>
          <h1>Build. Learn.<br />Make an impact.</h1>
          <p>Your portfolio, projects, and daily momentum in one focused workspace.</p>
          <div className="auth-orbit orbit-one" />
          <div className="auth-orbit orbit-two" />
          <div className="auth-visual-footer">DESIGN / CODE / GROW</div>
        </aside>

        <section className="auth-panel">
          <div className="auth-intro">
            <span className="auth-kicker">YOUR WORKSPACE</span>
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome back' : 'Start creating'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in to continue where you left off.'
                : 'Create an account and make progress visible.'}
            </p>
          </div>

          <div className="auth-mode" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === 'login' ? 'auth-mode-active' : ''}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Log in
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'auth-mode-active' : ''}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="auth-input"
          />

          <label className="auth-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength="6"
            className="auth-input"
          />

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Register'}
          </button>
        </form>

        <p className="auth-note">
          <span className="auth-note-dot" /> Secure access to your task workspace
        </p>
        </section>
      </div>
    </main>
  );
}

export default Auth;
