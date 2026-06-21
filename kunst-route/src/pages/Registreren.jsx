import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../Utils/auth';
import Toast from '../components/Toast';
import kunstrouteLogo from '../assets/Kunstroute logo.png';
import './Registreren.css';

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
};

export default function Registreren() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(LEEG);
  const [fout, setFout] = useState('');
  const [succes, setSucces] = useState('');
  const [artworks, setArtworks] = useState([]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleArtworkUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newArtworks = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
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
        if (!form[veld].trim()) {
          setFout('Vul alle verplichte velden in (*).');
          return;
        }
      }
      if (form.wachtwoord.length < 8) {
        setFout('Wachtwoord moet minimaal 8 tekens bevatten.');
        return;
      }
      if (form.wachtwoord !== form.wachtwoordBevestig) {
        setFout('Wachtwoorden komen niet overeen.');
        return;
      }
    }
    if (step === 2) {
      const verplicht = ['kunstrichting', 'adres', 'postcode', 'woonplaats'];
      for (const veld of verplicht) {
        if (!form[veld].trim()) {
          setFout('Vul alle verplichte velden in (*).');
          return;
        }
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

  function handleSubmit(e) {
    e.preventDefault();
    setFout('');
    setSucces('');

    if (!form.voorwaardenAkkoord) {
      setFout('Je moet akkoord gaan met de voorwaarden om een account aan te maken.');
      return;
    }

    const result = register(form);
    if (!result.success) {
      setFout(result.error);
      return;
    }

    setSucces('Account succesvol aangemaakt. Je wordt over 3 seconden doorgestuurd naar de betaalpagina.');
    setTimeout(() => {
      navigate('/payment');
    }, 3000);
  }

  const stepTitles = ['Persoonlijk', 'Informatie', 'Uploaden', 'Voorwaarden'];

  function handleTermsChange(e) {
    setForm(prev => ({
      ...prev,
      voorwaardenAkkoord: e.target.checked,
    }));
  }

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

        <Toast message={fout} type="error" onClose={() => setFout('')} />
        <Toast message={succes} type="success" onClose={() => setSucces('')} />

        <div className="reg-progress-bar">
            {stepTitles.map((t, idx) => (
              <div 
                key={idx} 
                className={`reg-progress-step ${step > idx ? 'active' : ''}`}
                title={t}
              />
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
                <input
                  className="reg-input"
                  name="kunstrichting"
                  value={form.kunstrichting}
                  onChange={handleChange}
                  placeholder="bijv. Schilderijen, Beeldhouwen, Fotografie..."
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">Biografie / beschrijving</label>
                <textarea
                  className="reg-input reg-textarea"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Vertel iets over jezelf als kunstenaar..."
                />
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

              <h3 className="reg-subsection-title">Adres (voor ballotage)</h3>
              <p className="reg-info">
                Vul hieronder het adres in waar we jou kunnen balloteren indien van toepassing.
              </p>

              <div className="reg-field">
                <label className="reg-label">Adres met huisnummer en (eventueel) toevoeging *</label>
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
            </section>
          )}

          {step === 3 && (
            <section className="reg-section slide-in">
              <h2 className="reg-section-title">Kunstwerken Uploaden</h2>
              <p className="reg-info">Voeg enkele foto's toe van je beste werken (optioneel). Deze kunnen we gebruiken op de website.</p>
              
              <div className="upload-area">
                 <input 
                   type="file" 
                   id="artwork-upload" 
                   multiple 
                   accept="image/*" 
                   onChange={handleArtworkUpload} 
                   className="upload-input-hidden"
                 />
                 <label htmlFor="artwork-upload" className="upload-btn">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                   Selecteer afbeeldingen
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
                <textarea
                  className="reg-input reg-textarea"
                  name="uitleg_kunstwerken"
                  value={form.uitleg_kunstwerken}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Vertel kort wat deze kunstwerken inhouden en hoe ze zijn gemaakt..."
                />
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="reg-section slide-in">
              <h2 className="reg-section-title">Voorwaarden</h2>
              <div className="voorwaarden-content-scroll" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1rem', color: 'var(--color-text)', fontSize: '0.95rem'}}>
                <p>Om deel te nemen aan de Kunstroute moet aan een aantal voorwaarden worden voldaan.</p>

                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Professionaliteit</h3>
                <p>Je bent op een professionele manier werkzaam als kunstenaar en je kunt voldoende werk tonen.</p>

                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Atelier</h3>
                <p>Je atelier/expositieruimte ligt binnen de gemeenten Oldebroek, Elburg, Nunspeet, Harderwijk, Ermelo en Putten, is goed bereikbaar, heeft een professionele uitstraling en is geschikt om aantallen bezoekers te ontvangen of je exposeert bij een collega kunstenaar in één van genoemde gemeenten.</p>
                <p>Je ontvangt bezoekers en geeft hen, indien mogelijk, een indruk van je werkwijze door middel van demonstraties. Daarnaast houd je een bezoekersregistratie bij.</p>

                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Ballotage</h3>
                <p>Bij nieuwe deelnemers vindt ballotage plaats. De ballotagecommissie brengt altijd een bezoek aan de kandidaat-deelnemers.</p>

                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Privacy</h3>
                <p>De kunstenaar geeft toestemming voor het opslaan van relevante persoonsgegevens en voor het plaatsen van identificeerbare foto’s op de website of sociale media.</p>

                <h3 style={{marginTop: '1rem', color: 'var(--color-primary)'}}>Inschrijfgeld</h3>
                <p>Het inschrijfgeld bedraagt € 100,–</p>
              </div>

              <div className="reg-field" style={{marginTop: '1rem'}}>
                <label className="reg-checkbox-label" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <input
                    type="checkbox"
                    checked={form.voorwaardenAkkoord || false}
                    onChange={handleTermsChange}
                    required
                  />
                  Ik ga akkoord met de voorwaarden voor deelname
                </label>
              </div>
            </section>
          )}

          <div className="reg-wizard-actions">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="reg-btn-sec">
                &larr; Vorige
              </button>
            ) : (
              <button type="button" onClick={() => navigate('/login')} className="reg-btn-link">
                Al een account? Inloggen
              </button>
            )}

            {step < 4 ? (
              <button type="button" onClick={nextStep} className="reg-btn-prim">
                Volgende &rarr;
              </button>
            ) : (
              <button type="submit" className="reg-btn-prim">
                Ik ga akkoord en maak account aan
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
