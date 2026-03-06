import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <img src="/src/assets/kunstroutelogo.png" 
          alt="Kunst Route Noordwest Veluwe" 
          className="logo-img"
        />
      </a>
      <ul>
        <li className="active"><a href="#">🗺️ Kaart</a></li>
        <li className="active"><a href="#">🎨 Kunstwerken</a></li>
        <li className="active"><a href="#">👤 Kunstenaars</a></li>
        <li className="active"><a href="#">ℹ️ Info & Agenda</a></li>
        <li className="active"><a href="#">📝 Inschrijven</a></li>
      </ul>
    </nav>
  );
}
