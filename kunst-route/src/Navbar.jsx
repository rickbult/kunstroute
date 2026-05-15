import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/Kunstroute logo.png";
import { getCurrentUser } from '../Utils/auth';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [ingelogd, setIngelogd] = useState(false);

  useEffect(() => {
    setIngelogd(!!getCurrentUser());
  }, [location]);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Kunst Route Noordwest Veluwe" className="logo-img" />
      </Link>

      <ul className="nav-links">
        <li><Link to="/kaart">Kaart</Link></li>
        <li><Link to="/kunstwerken">Kunstwerken</Link></li>
        <li><Link to="/kunstenaars">Kunstenaars</Link></li>
        <li><Link to="/info-agenda">Info & Agenda</Link></li>
        <li>
          <Link to={ingelogd ? '/profiel' : '/login'} className="btn-inloggen">
            {ingelogd ? 'Mijn profiel' : 'Inloggen'}
          </Link>
        </li>
      </ul>
    </nav>
  );
}






