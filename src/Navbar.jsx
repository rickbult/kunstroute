import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logoImg from "./assets/logo.png";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="brand-logo" aria-label="Kunstroute Noordwest Veluwe">
        <img src={logoImg} alt="Kunstroute Noordwest Veluwe" className="navbar-logo-img" />
      </a>
      <div className="navbar-links">
        <NavLink to="/kaart" className="nav-link">
          Kaart
        </NavLink>
        <NavLink to="/kunstwerken" className="nav-link">
          Kunstwerken
        </NavLink>
        <NavLink to="/kunstenaars" className="nav-link">
          Kunstenaars
        </NavLink>
        <NavLink to="/info" className="nav-link">
          Info
        </NavLink>
        <NavLink to="/agenda" className="nav-link">
          Agenda
        </NavLink>
        <NavLink to="/inschrijven" className="navbar-btn">
          Inloggen
        </NavLink>
      </div>
    </nav>
  );
};
