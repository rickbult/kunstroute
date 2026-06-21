import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateCurrentUser, logout } from '../../Utils/auth';
import Toast from '../components/Toast';
import './Registreren.css';
import './Profiel.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editStep, setEditStep] = useState(1);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate('/login');
      return;
    }
    setUser(current);
    setForm(current);
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!form.voornaam?.trim() || !form.achternaam?.trim() || !form.telefoon?.trim()) {
      setError('Voornaam, achternaam en telefoonnummer zijn verplicht.');
      return;
    }
    const result = updateCurrentUser(form);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setUser({ ...form });
    setEditing(false);
    setEditStep(1);
    setSuccess('Gegevens succesvol opgeslagen!');
    setTimeout(() => setSuccess(''), 3000);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const initials = `${user.voornaam?.[0] ?? ''}${user.achternaam?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="profiel-bg">
      <div className="profiel-page">

        <div className="profiel-header">
          <div className="profiel-avatar">{initials}</div>
          <div className="profiel-header-info">
            <h1 className="profiel-naam">{user.voornaam} {user.achternaam}</h1>
            <p className="profiel-email">{user.email}</p>
            {user.kunstrichting && (
              <p className="profiel-kunstrichting">{user.kunstrichting}</p>
            )}
          </div>
          <button type="button" className="profiel-uitloggen" onClick={handleLogout}>
            Uitloggen
          </button>
        </div>

        <Toast message={error} type="error" onClose={() => setError('')} />
        <Toast message={success} type="success" onClose={() => setSuccess('')} />

        {!editing ? (
          <>
            {user.paymentStatus === 'paid' ? (
              <div className="profiel-melding profiel-succes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Status: Inschrijfgeld betaald
              </div>
            ) : (
              <div className="profiel-melding" style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Let op: Je moet de betaling nog voltooien of doorgeven via de betaalpagina.
              </div>
            )}

            <div className="profiel-sectie">
              <h2>Persoonlijke Informatie</h2>
              <div className="profiel-grid">
                <div><span className="profiel-key">Voornaam</span><span>{user.voornaam || '—'}</span></div>
                <div><span className="profiel-key">Achternaam</span><span>{user.achternaam || '—'}</span></div>
                <div><span className="profiel-key">Telefoon</span><span>{user.telefoon || '—'}</span></div>
              </div>
            </div>

            <div className="profiel-sectie">
              <h2>Kunstenaarsinformatie</h2>
              <div className="profiel-grid profiel-grid-wide">
                <div><span className="profiel-key">Kunstrichting</span><span>{user.kunstrichting || '—'}</span></div>
                <div><span className="profiel-key">Website</span><span>{user.website || '—'}</span></div>
                <div><span className="profiel-key">Facebook</span><span>{user.facebook || '—'}</span></div>
                <div><span className="profiel-key">Instagram</span><span>{user.instagram || '—'}</span></div>
                {user.bio && (
                  <div className="profiel-grid-full"><span className="profiel-key">Biografie</span><span>{user.bio}</span></div>
                )}
              </div>
            </div>

            <div className="profiel-sectie">
              <h2>Adres</h2>
              <div className="profiel-grid">
                <div><span className="profiel-key">Adres</span><span>{user.adres || '—'}</span></div>
                <div><span className="profiel-key">Postcode</span><span>{user.postcode || '—'}</span></div>
                <div><span className="profiel-key">Plaats</span><span>{user.woonplaats || '—'}</span></div>
              </div>
            </div>

            <div className="profiel-actions-row">
              <button
                type="button"
                className="profiel-bewerk-btn"
                onClick={() => { setEditing(true); setEditStep(1); setError(''); }}
              >
                Gegevens bewerken
              </button>
              <button
                type="button"
                className="profiel-bewerk-btn btn-payment"
                onClick={() => navigate('/payment')}
              >
                Ga naar betaalpagina
              </button>
            </div>
          </>
        ) : (
          
          <form onSubmit={handleSave} noValidate>
            <div className="reg-progress-bar" style={{marginBottom: '2rem'}}>
                {['Persoonlijk', 'Informatie', 'Adres'].map((t, idx) => (
                  <div 
                    key={idx} 
                    className={`reg-progress-step ${editStep > idx ? 'active' : ''}`}
                    title={t}
                  />
                ))}
            </div>

            {editStep === 1 && (
              <div className="profiel-sectie slide-in">
                <h2>Persoonlijke Informatie Bewerken</h2>
                <div className="reg-row">
                  <div className="reg-field">
                    <label className="reg-label">Voornaam *</label>
                    <input className="reg-input" name="voornaam" value={form.voornaam || ''} onChange={handleChange} />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Achternaam *</label>
                    <input className="reg-input" name="achternaam" value={form.achternaam || ''} onChange={handleChange} />
                  </div>
                </div>
                <div className="reg-field">
                  <label className="reg-label">Telefoonnummer *</label>
                  <input className="reg-input" type="tel" name="telefoon" value={form.telefoon || ''} onChange={handleChange} />
                </div>
              </div>
            )}

            {editStep === 2 && (
              <div className="profiel-sectie slide-in">
                <h2>Kunstenaarsinformatie</h2>
                <div className="reg-field">
                  <label className="reg-label">Kunststijl / Discipline</label>
                  <input className="reg-input" name="kunstrichting" value={form.kunstrichting || ''} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Biografie / Beschrijving</label>
                  <textarea
                    className="reg-input reg-textarea"
                    name="bio"
                    value={form.bio || ''}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Website</label>
                  <input className="reg-input" name="website" value={form.website || ''} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Facebook</label>
                  <input className="reg-input" name="facebook" value={form.facebook || ''} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Instagram</label>
                  <input className="reg-input" name="instagram" value={form.instagram || ''} onChange={handleChange} />
                </div>
              </div>
            )}

            {editStep === 3 && (
              <div className="profiel-sectie slide-in">
                <h2>Adres</h2>
                <div className="reg-field">
                  <label className="reg-label">Adres inclusief huisnummer</label>
                  <input className="reg-input" name="adres" value={form.adres || ''} onChange={handleChange} />
                </div>
                <div className="reg-row">
                  <div className="reg-field">
                    <label className="reg-label">Postcode</label>
                    <input className="reg-input" name="postcode" value={form.postcode || ''} onChange={handleChange} />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Plaats</label>
                    <input className="reg-input" name="woonplaats" value={form.woonplaats || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            <div className="reg-wizard-actions" style={{marginTop: '2rem'}}>
              {editStep > 1 ? (
                <button type="button" onClick={() => setEditStep(s => s - 1)} className="reg-btn-sec">
                  &larr; Vorige
                </button>
              ) : (
                <button type="button" className="reg-btn-sec" onClick={() => { setEditing(false); setForm(user); setError(''); }}>
                  Annuleren
                </button>
              )}

              {editStep < 3 ? (
                <button type="button" onClick={() => setEditStep(s => s + 1)} className="reg-btn-prim">
                  Volgende &rarr;
                </button>
              ) : (
                <button type="submit" className="reg-btn-prim">
                  Opslaan
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}