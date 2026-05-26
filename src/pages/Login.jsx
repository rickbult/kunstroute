import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fout, setFout] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFout('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setFout(result.error || 'Inloggen mislukt.');
        return;
      }
      window.dispatchEvent(new Event('authchange'));
      navigate('/profile');
    } catch (err) {
      setFout('Er ging iets mis. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Bezig...' : 'Inloggen'}
        </button>
      </form>
      {fout && <p className="error">{fout}</p>}
      <div className="signup-link">
        <Link to="/register">Nog geen account? Registreer hier</Link>
      </div>
    </div>
  );
};

export default Login;
