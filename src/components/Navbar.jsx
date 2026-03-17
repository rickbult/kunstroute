import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img 
          src="/src/assets/kunstroutelogo.png" 
          alt="Kunst Route Noordwest Veluwe" 
          className="logo-img"
        />
      </Link>
      <ul>
        <li><Link to="/">🗺️ Kaart</Link></li>
        <li><Link to="/">🎨 Kunstwerken</Link></li>
        <li><Link to="/">👤 Kunstenaars</Link></li>
        <li><Link to="/">ℹ️ Info & Agenda</Link></li>
        <li><Link to="/">📝 Inschrijven</Link></li>
      </ul>
    </nav>
  );
}
