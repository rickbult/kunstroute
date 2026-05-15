import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initUsers, login, getCurrentUser } from '../../Utils/auth';
import kunstrouteLogo from '../assets/Kunstroute logo.png';
import './Login.css';

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
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">E-mailadres</label>
              <input
                id="login-email"
                type="email"
                className={`login-input${fout ? ' has-error' : ''}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setFout(''); }}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-wachtwoord" className="login-label">Wachtwoord</label>
              <input
                id="login-wachtwoord"
                type="password"
                className={`login-input${fout ? ' has-error' : ''}`}
                value={wachtwoord}
                onChange={e => { setWachtwoord(e.target.value); setFout(''); }}
                autoComplete="current-password"
              />
            </div>

            {fout && (
              <div className="toast-notification">
                <div className="toast-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div className="toast-content">
                  <p>{fout}</p>
                </div>
                <button type="button" onClick={() => setFout('')} className="toast-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

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
