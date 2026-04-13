import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initUsers, login, getCurrentUser } from "../utils/auth.js";
import kunstrouteLogo from "../assets/kunstroutelogo.png";
import './Signup.css';


export default function Login() {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [fout, setFout] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    initUsers();
    if (getCurrentUser()) navigate('/profiel');
  }, [navigate]);

  function handleInloggen(e) {
    e.preventDefault();
    setFout('');
    const result = login(email.trim(), wachtwoord);
    if (!result.success) {
      setFout(result.error);
      return;
    }
    navigate('/profiel');
  }

  return (
    <div className="login-bg">
      <main className="login-main">
        <div className="login-card">
          <img src={kunstrouteLogo} alt="Kunstroute Noordwest Veluwe" className="login-logo" />
          <h1 className="login-heading">Inloggen</h1>
          <p className="login-subtitle">met je Kunstroute account om door te gaan</p>

          <form onSubmit={handleInloggen} noValidate>
            <div className="floating-group">
              <input
                id="login-email"
                type="email"
                className={`floating-input${fout ? ' has-error' : ''}`}
                placeholder=" "
                value={email}
                onChange={e => { setEmail(e.target.value); setFout(''); }}
                autoComplete="email"
                autoFocus
              />
              <label htmlFor="login-email" className="floating-label">E-mailadres</label>
            </div>

            <div className="floating-group">
              <input
                id="login-wachtwoord"
                type="password"
                className={`floating-input${fout ? ' has-error' : ''}`}
                placeholder=" "
                value={wachtwoord}
                onChange={e => { setWachtwoord(e.target.value); setFout(''); }}
                autoComplete="current-password"
              />
              <label htmlFor="login-wachtwoord" className="floating-label">Wachtwoord</label>
            </div>

            {fout && <p className="login-fout">{fout}</p>}

            <div className="login-actions">
              <button
                type="button"
                className="login-btn-sec"
                onClick={() => navigate('/registreren')}
              >
                Account maken
              </button>
              <button type="submit" className="login-btn-prim">Inloggen</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}