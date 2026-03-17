import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-top">KUNST ROUTE</span>
        <span className="logo-bottom">NOORDWEST VELUWE</span>
      </Link>

      <ul className="nav-links">
        <li><Link to="/kaart" className="tekst-groen">Kaart</Link></li>
        <li><Link to="/kunstwerken" className="tekst-roze">Kunstwerken</Link></li>
        <li><Link to="/kunstenaars" className="tekst-geel">Kunstenaars</Link></li>
        <li><Link to="/info-agenda" className="tekst-blauw">Info & Agenda</Link></li>
        <li>
          <Link to="/inschrijven" className="btn-inschrijven">Inschrijven</Link>
        </li>
      </ul>
    </nav>
  );
}





