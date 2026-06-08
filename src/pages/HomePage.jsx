import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBackground from '../assets/home-hero-bg2.png';
import { fotoMetFallback, placeholderFoto } from '../utils/images';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [uitgelicht, setUitgelicht] = useState([]);

  useEffect(() => {
    fetch('/api/artists')
      .then(r => r.json())
      .then(data => setUitgelicht(data.filter(a => a.kunstFoto)))
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay" />
        <img className="hero-bg" src={heroBackground} alt="Kunstroute Noordwest Veluwe" />
        <div className="hero-content">
          <span className="edition-badge">23STE EDITIE · 2026</span>
          <h1>Kunstroute Noordwest Veluwe</h1>
          <p>Ontdek de ateliers, ontmoet de kunstenaars en laat je inspireren door de kunst op de Veluwe.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/kaart')}>Bekijk de route</button>
            <button className="btn-secondary" onClick={() => navigate('/kunstwerken')}>Ontdek kunstwerken</button>
          </div>
        </div>
      </section>

      <div className="color-strip">
        <span className="green" />
        <span className="yellow" />
        <span className="pink" />
        <span className="purple" />
      </div>

      <section className="history-section">
        <p className="history-label">ONZE GESCHIEDENIS</p>
        <h2>Een traditie van 23 jaar</h2>
        <p className="history-text">
          Sinds het begin van de jaren 2000 brengt de Kunstroute Noordwest Veluwe kunst buiten de museummuren.
          Wat begon als een klein initiatief van enthousiaste kunstenaars is uitgegroeid tot een geliefd jaarlijks
          evenement met meer dan 25 deelnemers. Elk jaar openen professionele kunstenaars hun ateliers in Elspeet,
          Ermelo, Harderwijk, Hulshorst, Nunspeet, Oldebroek en Speuld voor het publiek.
        </p>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2>Uitgelichte Werken</h2>
            <p>Een voorproefje van wat er te zien is.</p>
          </div>
          <a href="/kunstwerken">Bekijk alles →</a>
        </div>
        {uitgelicht.length === 0 ? (
          <p className="featured-empty">Nog geen kunstwerken ingeschreven.</p>
        ) : (
          <div className="featured-grid">
            {uitgelicht.map((artist) => (
              <article key={artist.link} className="featured-card" onClick={() => navigate(`/kunstenaars/${artist.link}`)} style={{cursor: 'pointer'}}>
                <img
                  src={fotoMetFallback(artist.kunstFoto, artist.title)}
                  alt={`Kunstwerk van ${artist.title}`}
                  onError={(e) => {
                    const fallback = placeholderFoto(artist.title);
                    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                  }}
                />
                <h3>{artist.discipline || 'Kunstwerk'}</h3>
                <p className="artist-name">{artist.title}</p>
                <p className="city-name">{artist.location}</p>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
