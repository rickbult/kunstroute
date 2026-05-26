import { useNavigate } from 'react-router-dom';
import heroBackground from '../assets/home-hero-bg2.png';
import imagineImg from '../assets/homepage-imagine.png';
import tijdlijnImg from '../assets/homepage-tijdlijn.png';
import aardeImg from '../assets/homepage-aarde.png';
import duivenImg from '../assets/bakje-rode-duiven.png';
import libraryImg from '../assets/library-i.png';
import './HomePage.css';

const featuredWorks = [
  { title: 'Aarde',             artist: 'Stasja van Grootheest', city: 'Harderwijk', image: aardeImg },
  { title: 'Bakje rode duiven', artist: 'Miranda Adam',          city: 'Ermelo',     image: duivenImg },
  { title: 'Imagine',           artist: 'Jan Schaafsma',         city: 'Nunspeet',   image: imagineImg },
  { title: 'Library I',         artist: 'Wim Bakker',            city: 'Nunspeet',   image: libraryImg },
  { title: 'Tijdlijn',          artist: 'Herma Rikkers',         city: 'Elspeet',    image: tijdlijnImg },
];

export default function HomePage() {
  const navigate = useNavigate();

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
        <div className="featured-grid">
          {featuredWorks.map((work) => (
            <article key={work.title} className="featured-card">
              <img src={work.image} alt={work.title} />
              <h3>{work.title}</h3>
              <p className="artist-name">{work.artist}</p>
              <p className="city-name">{work.city}</p>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
