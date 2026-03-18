import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "/src/assets/kunstroutelogo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Kunst Route Noordwest Veluwe" className="logo-img" />
      </Link>

      <ul className="nav-links">
        <li><Link to="/src/pages/map.jsx" className="tekst-groen">Kaart</Link></li>
        <li><Link to="/src/pages/Artwork.jsx" className="tekst-roze">Kunstwerken</Link></li>
        <li><Link to="/src/pages/Artists.jsx" className="tekst-geel">Kunstenaars</Link></li>
        <li><Link to="/src/pages/Info-agenda.jsx" className="tekst-blauw">Info & Agenda</Link></li>
        <li>
          <Link to="/inschrijven" className="btn-inschrijven">Inschrijven</Link>
        </li>
      </ul>
    </nav>
  );
}

