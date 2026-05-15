import { Link } from 'react-router-dom';
import logo from "../assets/Kunstroute logo.png";
import './Home.css';

export default function Home() {
  const artworks = [
    {
      id: 1,
      title: "Verandering",
      artist: "Marjolein Douma",
      city: "Harderwijk",
      image: "/uitgelicht-1.jpg",
      link: "/kunstwerken"
    },
    {
      id: 2,
      title: "Awakening",
      artist: "Annemarie Griek",
      city: "Ermelo",
      image: "/uitgelicht-2.jpg",
      link: "/kunstwerken"
    },
    {
      id: 3,
      title: "Something Got Me Started",
      artist: "Dido de Beer",
      city: "Nunspeet",
      image: "/uitgelicht-3.jpg",
      link: "/kunstwerken"
    },
    {
      id: 4,
      title: "Gesprek",
      artist: "Relinde Kattenberg",
      city: "Oldebroek",
      image: "/uitgelicht-4.jpg",
      link: "/kunstwerken"
    },
    {
      id: 5,
      title: "De Boom",
      artist: "Fineke ten Napel",
      city: "Elspeet",
      image: "/uitgelicht-5.jpg",
      link: "/kunstwerken"
    }
  ];

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-content">
          <div className="hero-pill">23STE EDITIE - 2026</div>
          <h1 className="hero-title">Kunstroute<br />Noordwest Veluwe</h1>
          <p className="hero-description">
            Ontdek de ateliers, ontmoet de kunstenaars en laat je inspireren door de kunst op de Veluwe.
          </p>
          <div className="hero-buttons">
            <Link to="/kaart" className="btn-hero-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>
              Bekijk de route
            </Link>
            <Link to="/kunstwerken" className="btn-hero-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.15 1.096.111 1.229-.045.094-.11.084-.38-.043-1.013A7 7 0 1 0 8 15"/></svg>
              Ontdek kunstwerken
            </Link>
          </div>
        </div>
      </div>

      <div className="color-stripe"></div>

      <div className="home-history">
        <div className="history-subtitle">ONZE GESCHIEDENIS</div>
        <h2 className="history-title">Een traditie van 23 jaar</h2>
        <p className="history-text">
          Sinds het begin van de jaren 2000 brengt de Kunstroute Noordwest Veluwe kunst buiten de museummuren. Wat begon als een klein initiatief van enthousiaste kunstenaars is uitgegroeid tot een geliefd jaarlijks evenement met meer dan 25 deelnemers. Elk jaar openen professionele kunstenaars hun ateliers in Elspeet, Ermelo, Harderwijk, Hulshorst, Nunspeet, Oldebroek en Speuld voor het publiek.
        </p>
      </div>

      <div className="home-featured">
        <div className="home-featured-header">
          <div className="home-featured-title-area">
            <h2>Uitgelichte Werken</h2>
            <p>Een voorproefje van wat er te zien is.</p>
          </div>
          <Link to="/kunstwerken" className="home-link">Bekijk alles &rarr;</Link>
        </div>

        <div className="home-artworks-grid">
          {artworks.map((artwork) => (
            <Link key={artwork.id} to={artwork.link} className="artwork-card-link">
              <div className="artwork-card">
                <img src={artwork.image} alt={artwork.title} className="artwork-image" />
                <div className="artwork-info">
                  <h3>{artwork.title}</h3>
                  <p className="artwork-artist">{artwork.artist}</p>
                  <p className="artwork-city">{artwork.city}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="color-stripe"></div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-col brand-col">
            <img src={logo} alt="Kunst Route Noordwest Veluwe" className="footer-logo" />
            <p>Ontdek de verborgen parels van de Veluwe. Bezoek ateliers en kunstenaars in hun creatieve omgeving.</p>
          </div>
          
          <div className="footer-col links-col">
            <h4>Snel naar</h4>
            <ul>
              <li><Link to="/kaart">Interactieve Kaart</Link></li>
              <li><Link to="/kunstwerken">Kunstwerken</Link></li>
              <li><Link to="/kunstenaars">Kunstenaars</Link></li>
              <li><Link to="/inschrijven">Inschrijven</Link></li>
            </ul>
          </div>
          
          <div className="footer-col contact-col">
            <h4>Contact</h4>
            <p><a href="mailto:info@kunstroute-nw-veluwe.nl">info@kunstroute-nw-veluwe.nl</a></p>
            <p><a href="tel:0341123456">0341 123456</a></p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Stichting Kunstroute NW-Veluwe</p>
        </div>
      </footer>
    </div>
  );
}
