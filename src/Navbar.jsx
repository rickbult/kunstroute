import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/kaart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Kaart
        </NavLink>
        <NavLink to="/kunstwerken" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Kunstwerken
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Kunstenaars
        </NavLink>
        <NavLink to="/info" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Info
        </NavLink>
        <NavLink to="/agenda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Agenda
        </NavLink>
        <NavLink to="/inschrijven" className="navbar-btn">
          Inschrijven
        </NavLink>
      </div>
      
    </nav>
  );
};
