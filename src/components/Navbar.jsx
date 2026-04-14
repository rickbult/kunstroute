import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/kunstroutelogo.png";  // Fix pad

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Kunst Route Noordwest Veluwe" className="logo-img" />
      </Link>

      <ul className="nav-links">
        <li><Link to="/kaart" className="tekst-groen">Kaart</Link></li>
        <li><Link to="/kunstwerken" className="tekst-roze">Kunstwerken</Link></li>
        <li><Link to="/kunstenaars" className="tekst-geel">Kunstenaars</Link></li>
        <li><Link to="/info-agenda" className="tekst-blauw">Info & Agenda</Link></li>
        <li>
          <Link to="/signup" className="btn-inschrijven">Inschrijven</Link>  
        </li>
      </ul>
    </nav>
  );
}