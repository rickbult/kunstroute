import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/kunstroutelogo.png";
import { logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ingelogd, setIngelogd] = useState(!!localStorage.getItem('token'));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIngelogd(!!localStorage.getItem('token'));
    window.addEventListener('storage', check);
    window.addEventListener('authchange', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('authchange', check);
    };
  }, []);

  // Sluit het mobiele hamburgermenu zodra er naar een andere pagina genavigeerd wordt
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleUitloggen() {
    logout();
    setIngelogd(false);
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="Kunstroute Noordwest Veluwe" className="navbar-logo-img" />
      </Link>

      <button
        type="button"
        className="navbar-hamburger"
        aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((waarde) => !waarde)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
        <li>
          <Link to="/kaart" className="nav-link route-link">
            <span>Route</span>
            <span className="badge-nieuw">NIEUW!</span>
          </Link>
        </li>
        <li><Link to="/kunstwerken" className="nav-link">Kunstwerken</Link></li>
        <li><Link to="/kunstenaars" className="nav-link">Kunstenaars</Link></li>
        <li><Link to="/info" className="nav-link">Info</Link></li>
        <li><Link to="/agenda" className="nav-link">Agenda</Link></li>
        {ingelogd ? (
          <>
            <li><Link to="/profile" className="navbar-btn">Mijn account</Link></li>
            <li><button className="navbar-btn-uitloggen" onClick={handleUitloggen}>Uitloggen</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="navbar-btn-outline">Inloggen</Link></li>
            <li><Link to="/register" className="navbar-btn">Inschrijven</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
