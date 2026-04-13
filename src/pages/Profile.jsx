import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateCurrentUser, logout } from '../utils/auth';
import './Profile.css';

export default function Profiel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bewerken, setBewerken] = useState(false);
  const [form, setForm] = useState({});
  const [succes, setSucces] = useState('');
  const [fout, setFout] = useState('');

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

  function handleOpslaan(e) {
    e.preventDefault();
    setFout('');
    if (!form.voornaam?.trim() || !form.achternaam?.trim() || !form.telefoon?.trim()) {
      setFout('Voornaam, achternaam en telefoonnummer zijn verplicht.');
      return;
    }
    const result = updateCurrentUser(form);
    if (!result.success) {
      setFout(result.error);
      return;
    }
    setUser({ ...form });
    setBewerken(false);
    setSucces('Gegevens zijn opgeslagen!');
    setTimeout(() => setSucces(''), 3000);
  }

  function handleUitloggen() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const initialen = `${user.voornaam?.[0] ?? ''}${user.achternaam?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="page profiel-page">

      
      <div className="profiel-header">
        <div className="profiel-avatar">{initialen}</div>
        <div className="profiel-header-info">
          <h1 className="profiel-naam">{user.voornaam} {user.achternaam}</h1>
          <p className="profiel-email">{user.email}</p>
          {user.kunstrichting && (
            <p className="profiel-kunstrichting">{user.kunstrichting}</p>
          )}
        </div>
        <button type="button" className="profiel-uitloggen" onClick={handleUitloggen}>
          Uitloggen
        </button>
      </div>

      {succes && <div className="profiel-melding profiel-succes">{succes}</div>}
      {fout && <div className="profiel-melding profiel-fout">{fout}</div>}

      
      {!bewerken ? (
        <>
          <div className="profiel-sectie">
            <h2>Persoonlijke gegevens</h2>
            <div className="profiel-grid">
              <div><span className="profiel-key">Voornaam</span><span>{user.voornaam}</span></div>
              <div><span className="profiel-key">Achternaam</span><span>{user.achternaam}</span></div>
              <div><span className="profiel-key">Telefoon</span><span>{user.telefoon || '—'}</span></div>
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Kunstenaars informatie</h2>
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
              <div><span className="profiel-key">Woonplaats</span><span>{user.woonplaats || '—'}</span></div>
            </div>
          </div>

          <button
            type="button"
            className="profiel-bewerk-btn"
            onClick={() => { setBewerken(true); setFout(''); }}
          >
            Gegevens aanpassen
          </button>
        </>
      ) : (
        
        <form onSubmit={handleOpslaan} noValidate>

          <div className="profiel-sectie">
            <h2>Persoonlijke gegevens aanpassen</h2>
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

          <div className="profiel-sectie">
            <h2>Kunstenaars informatie</h2>
            <div className="reg-field">
              <label className="reg-label">Kunstrichting / discipline</label>
              <input className="reg-input" name="kunstrichting" value={form.kunstrichting || ''} onChange={handleChange} />
            </div>
            <div className="reg-field">
              <label className="reg-label">Biografie / beschrijving</label>
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

          <div className="profiel-sectie">
            <h2>Adres</h2>
            <div className="reg-field">
              <label className="reg-label">Adres met huisnummer</label>
              <input className="reg-input" name="adres" value={form.adres || ''} onChange={handleChange} />
            </div>
            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Postcode</label>
                <input className="reg-input" name="postcode" value={form.postcode || ''} onChange={handleChange} />
              </div>
              <div className="reg-field">
                <label className="reg-label">Woonplaats</label>
                <input className="reg-input" name="woonplaats" value={form.woonplaats || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="profiel-form-actions">
            <button
              type="button"
              className="reg-btn-sec"
              onClick={() => { setBewerken(false); setForm(user); setFout(''); }}
            >
              Annuleren
            </button>
            <button type="submit" className="reg-btn">Opslaan</button>
          </div>

        </form>
      )}
    </div>
  );
}