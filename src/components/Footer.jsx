import { Link } from 'react-router-dom';
import logoImg from '../assets/kunstroutelogo.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-strip">
        <span className="green" />
        <span className="yellow" />
        <span className="pink" />
        <span className="purple" />
      </div>
      <div className="footer-content">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <img src={logoImg} alt="Kunstroute Noordwest Veluwe" className="footer-logo-img" />
          </Link>
          <p>Ontdek de verborgen parels van de Veluwe. Bezoek ateliers en kunstenaars in hun creatieve omgeving.</p>
        </div>
        <div className="footer-col">
          <h4>Snel naar</h4>
          <Link to="/kaart">Interactieve Kaart</Link>
          <Link to="/kunstwerken">Kunstwerken</Link>
          <Link to="/kunstenaars">Kunstenaars</Link>
          <Link to="/register">Inschrijven</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>info@kunstroute-nw-veluwe.nl</p>
          <p>0341-123456</p>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Stichting Kunstroute NW-Veluwe</div>
    </footer>
  );
}
