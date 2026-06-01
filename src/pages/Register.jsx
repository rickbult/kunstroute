import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';
import kunstrouteLogo from '../assets/kunstroutelogo.png';
import './Register.css';

const LEEG = {
  voornaam: '',
  achternaam: '',
  email: '',
  wachtwoord: '',
  wachtwoordBevestig: '',
  telefoon: '',
  kunstrichting: '',
  bio: '',
  website: '',
  facebook: '',
  instagram: '',
  adres: '',
  postcode: '',
  woonplaats: '',
  uitleg_kunstwerken: '',
  openZaterdag: false,
  openZondag: false,
};

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(LEEG);
  const [fout, setFout] = useState('');
  const [loading, setLoading] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [profielfoto, setProfielfoto] = useState(null);
  const [adresCheck, setAdresCheck] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (['adres', 'postcode', 'woonplaats'].includes(name)) setAdresCheck(null);
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function controleerAdres() {
    if (!form.adres && !form.woonplaats) return;
    setAdresCheck('loading');
    const basis = { format: 'json', limit: 1, countrycodes: 'nl' };
    const pogingen = [
      form.adres && form.woonplaats && { street: form.adres, postalcode: form.postcode, city: form.woonplaats, ...basis },
      form.adres && form.woonplaats && { street: form.adres, city: form.woonplaats, ...basis },
      form.woonplaats               && { city: form.woonplaats, ...basis },
    ].filter(Boolean);
    for (const params of pogingen) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${new URLSearchParams(params)}`);
        const data = await res.json();
        if (data?.[0]) { setAdresCheck({ gevonden: true, display: data[0].display_name }); return; }
      } catch {}
    }
    setAdresCheck({ gevonden: false });
  }

  function handleArtworkUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newArtworks = files.map(file => ({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setArtworks(prev => [...prev, ...newArtworks]);
    }
  }

  function removeArtwork(index) {
    setArtworks(prev => prev.filter((_, i) => i !== index));
  }

  function nextStep() {
    setFout('');
    if (step === 1) {
      const verplicht = ['voornaam', 'achternaam', 'email', 'wachtwoord', 'telefoon'];
      for (const veld of verplicht) {
        if (!form[veld].trim()) { setFout('Vul alle verplichte velden in (*).'); return; }
      }
      if (form.wachtwoord.length < 8) { setFout('Wachtwoord moet minimaal 8 tekens bevatten.'); return; }
      if (form.wachtwoord !== form.wachtwoordBevestig) { setFout('Wachtwoorden komen niet overeen.'); return; }
    }
    if (step === 2) {
      const verplicht = ['kunstrichting', 'adres', 'postcode', 'woonplaats'];
      for (const veld of verplicht) {
        if (!form[veld].trim()) { setFout('Vul alle verplichte velden in (*).'); return; }
      }
      if (!form.openZaterdag && !form.openZondag) {
        setFout('Selecteer minimaal één open dag (zaterdag en/of zondag).');
        return;
      }
    }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevStep() {
    setFout('');
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFout('');
    setLoading(true);

    const formData = new FormData();
    formData.append('voornaam', form.voornaam);
    formData.append('achternaam', form.achternaam);
    formData.append('email', form.email);
    formData.append('password', form.wachtwoord);
    formData.append('telefoon', form.telefoon);
    formData.append('kunstrichting', form.kunstrichting);
    formData.append('bio', form.bio || '');
    formData.append('website', form.website || '');
    formData.append('facebook', form.facebook || '');
    formData.append('instagram', form.instagram || '');
    formData.append('adres', form.adres);
    formData.append('postcode', form.postcode);
    formData.append('woonplaats', form.woonplaats);
    formData.append('uitleg_kunstwerken', form.uitleg_kunstwerken || '');
    formData.append('openZaterdag', form.openZaterdag);
    formData.append('openZondag', form.openZondag);

    if (profielfoto) formData.append('profielfoto', profielfoto);
    if (artworks.length > 0) formData.append('kunstFoto', artworks[0].file);

    try {
      const result = await register(formData);
      if (!result.success) { setFout(result.error || 'Registreren mislukt.'); return; }
      navigate('/profile');
    } catch {
      setFout('Er ging iets mis. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  const stepTitles = ['Persoonlijk', 'Informatie', 'Uploaden', 'Voorwaarden'];

  return (
    <div className="reg-bg">
      <div className="reg-container">
        <header className="reg-header">
          <img src={kunstrouteLogo} alt="Kunstroute" className="reg-logo" />
          <div>
            <h1 className="reg-title">Aanmelden als kunstenaar</h1>
            <p className="reg-subtitle">Stap {step} van 4</p>
          </div>
        </header>

        {fout && (
          <div className="toast-notification">
            <div className="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="toast-content"><p>{fout}</p></div>
            <button type="button" onClick={() => setFout('')} className="toast-close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}

        <div className="reg-progress-bar">
          {stepTitles.map((t, idx) => (
            <div key={idx} className={`reg-progress-step ${step > idx ? 'active' : ''}`} title={t} />
          ))}
        </div>

        <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()} className="reg-form" noValidate>

          {step === 1 && (
            <section className="reg-section slide-in">
              <h2 className="reg-section-title">Persoonlijke gegevens</h2>
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Voornaam *</label>
                  <input className="reg-input" name="voornaam" value={form.voornaam} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Achternaam *</label>
                  <input className="reg-input" name="achternaam" value={form.achternaam} onChange={handleChange} />
                </div>
              </div>
              <div className="reg-field">
                <label className="reg-label">E-mailadres *</label>
                <input className="reg-input" type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Wachtwoord * (min. 8 tekens)</label>
                  <input className="reg-input" type="password" name="wachtwoord" value={form.wachtwoord} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Bevestig wachtwoord *</label>
                  <input className="reg-input" type="password" name="wachtwoordBevestig" value={form.wachtwoordBevestig} onChange={handleChange} />
                </div>
              </div>
              <div className="reg-field">
                <label className="reg-label">Telefoonnummer *</label>
                <input className="reg-input" type="tel" name="telefoon" value={form.telefoon} onChange={handleChange} />
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="reg-section slide-in">
              <h2 className="reg-section-title">Kunstenaars informatie & Adres</h2>
              <div className="reg-field">
                <label className="reg-label">Kunstrichting / discipline *</label>
                <input className="reg-input" name="kunstrichting" value={form.kunstrichting} onChange={handleChange} placeholder="bijv. Schilderijen, Beeldhouwen, Fotografie..." />
              </div>
              <div className="reg-field">
                <label className="reg-label">Biografie / beschrijving</label>
                <textarea className="reg-input reg-textarea" name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Vertel iets over jezelf als kunstenaar..." />
              </div>
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Website</label>
                  <input className="reg-input" name="website" value={form.website} onChange={handleChange} placeholder="www.jouwsite.nl" />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Instagram</label>
                  <input className="reg-input" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@gebruikersnaam" />
                </div>
              </div>
              <div className="reg-field">
                <label className="reg-label">Facebook</label>
                <input className="reg-input" name="facebook" value={form.facebook} onChange={handleChange} />
              </div>
              <h3 className="reg-subsection-title">Open dagen *</h3>
              <p className="reg-info">Selecteer op welke dag(en) je open bent tijdens de kunstroute.</p>
              <div className="reg-open-dagen">
                <label className="reg-dag-label">
                  <input type="checkbox" name="openZaterdag" checked={form.openZaterdag} onChange={handleChange} />
                  Zaterdag
                </label>
                <label className="reg-dag-label">
                  <input type="checkbox" name="openZondag" checked={form.openZondag} onChange={handleChange} />
                  Zondag
                </label>
              </div>

              <h3 className="reg-subsection-title">Adres (voor ballotage)</h3>
              <p className="reg-info">Vul hieronder het adres in waar we jou kunnen balloteren indien van toepassing.</p>
              <div className="reg-field">
                <label className="reg-label">Adres met huisnummer *</label>
                <input className="reg-input" name="adres" value={form.adres} onChange={handleChange} />
              </div>
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Postcode *</label>
                  <input className="reg-input" name="postcode" value={form.postcode} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Woonplaats *</label>
                  <input className="reg-input" name="woonplaats" value={form.woonplaats} onChange={handleChange} />
                </div>
              </div>
              <div className="reg-adres-check-row">
                <button
                  type="button"
                  className="reg-btn-adres-check"
                  onClick={controleerAdres}
                  disabled={adresCheck === 'loading' || (!form.adres && !form.woonplaats)}
                >
                  {adresCheck === 'loading' ? 'Opzoeken...' : 'Controleer adres op kaart'}
                </button>
                {adresCheck && adresCheck !== 'loading' && (
                  <div className={`reg-adres-result ${adresCheck.gevonden ? 'gevonden' : 'niet-gevonden'}`}>
                    <span className="reg-adres-icon">{adresCheck.gevonden ? '✓' : '✗'}</span>
                    <span>{adresCheck.gevonden ? adresCheck.display : 'Adres niet gevonden — controleer je spelling.'}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="reg-section slide-in">
              <h2 className="reg-section-title">Foto&apos;s uploaden</h2>
              <p className="reg-info">Voeg een profielfoto en foto's van je kunstwerken toe (optioneel).</p>

              <div className="reg-field">
                <label className="reg-label">Profielfoto</label>
                <input className="reg-input" type="file" accept="image/*" onChange={e => setProfielfoto(e.target.files[0] || null)} />
              </div>

              <div className="upload-area">
                <input type="file" id="artwork-upload" multiple accept="image/*" onChange={handleArtworkUpload} className="upload-input-hidden" />
                <label htmlFor="artwork-upload" className="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Selecteer kunstwerk foto&apos;s
                </label>
              </div>

              {artworks.length > 0 && (
                <div className="artworks-preview-grid">
                  {artworks.map((art, index) => (
                    <div key={index} className="artwork-preview-item">
                      <img src={art.url} alt={`Artwork ${index + 1}`} />
                      <button type="button" onClick={() => removeArtwork(index)} className="artwork-remove-btn">&times;</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="reg-field" style={{marginTop: '2rem'}}>
                <label className="reg-label">Korte uitleg over de kunstwerken</label>
                <textarea className="reg-input reg-textarea" name="uitleg_kunstwerken" value={form.uitleg_kunstwerken} onChange={handleChange} rows={4} placeholder="Vertel kort wat deze kunstwerken inhouden..." />
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="reg-section slide-in">
              <h2 className="reg-section-title">Voorwaarden</h2>
              <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1rem', color: 'var(--color-text)', fontSize: '0.95rem'}}>
                <p>Om deel te nemen aan de Kunstroute moet aan een aantal voorwaarden worden voldaan.</p>
                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Professionaliteit</h3>
                <p>Je bent op een professionele manier werkzaam als kunstenaar en je kunt voldoende werk tonen.</p>
                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Atelier</h3>
                <p>Je atelier/expositieruimte ligt binnen de gemeenten Oldebroek, Elburg, Nunspeet, Harderwijk, Ermelo en Putten, is goed bereikbaar en is geschikt om bezoekers te ontvangen.</p>
                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Ballotage</h3>
                <p>Bij nieuwe deelnemers vindt ballotage plaats. De ballotagecommissie brengt altijd een bezoek aan de kandidaat-deelnemers.</p>
                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Privacy</h3>
                <p>De kunstenaar geeft toestemming voor het opslaan van relevante persoonsgegevens en voor het plaatsen van identificeerbare foto&apos;s op de website of sociale media.</p>
                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Inschrijfgeld</h3>
                <p>Het inschrijfgeld bedraagt € 100,–</p>
              </div>
              <div className="reg-field" style={{marginTop: '1rem'}}>
                <label className="reg-checkbox-label" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <input type="checkbox" required />
                  Ik ga akkoord met de voorwaarden voor deelname
                </label>
              </div>
            </section>
          )}

          <div className="reg-wizard-actions">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="reg-btn-sec">&larr; Vorige</button>
            ) : (
              <button type="button" onClick={() => navigate('/login')} className="reg-btn-link">
                Al een account? Inloggen
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="reg-btn-prim">Volgende &rarr;</button>
            ) : (
              <button type="submit" className="reg-btn-prim" disabled={loading}>
                {loading ? 'Bezig...' : 'Ik ga akkoord en maak account aan'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
