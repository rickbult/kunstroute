import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/kunstroutelogo.png";
import { logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [ingelogd, setIngelogd] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const check = () => setIngelogd(!!localStorage.getItem('token'));
    window.addEventListener('storage', check);
    window.addEventListener('authchange', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('authchange', check);
    };
  }, []);

  function handleUitloggen() {
    logout();
    setIngelogd(false);
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo">
        <img src={logo} alt="Kunstroute Noordwest Veluwe" className="navbar-logo-img" />
      </Link>

      <ul className="navbar-links">
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
            <li><button className="navbar-btn-outline" onClick={handleUitloggen}>Uitloggen</button></li>
          </>
        ) : (
          <li><Link to="/register" className="navbar-btn">Inschrijven</Link></li>
        )}
      </ul>
    </nav>
  );
}
