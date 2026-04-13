import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "/src/assets/kunstroutelogo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <img
          src={logo}
          alt="Kunst Route Noordwest Veluwe"
          className="logo-img"
        />
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? "tekst-groen active-link" : "tekst-groen"
            }
          >
            Kaart
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/artwork"
            className={({ isActive }) =>
              isActive ? "tekst-roze active-link" : "tekst-roze"
            }
          >
            Kunstwerken
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/artists"
            className={({ isActive }) =>
              isActive ? "tekst-geel active-link" : "tekst-geel"
            }
          >
            Kunstenaars
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/info-agenda"
            className={({ isActive }) =>
              isActive ? "tekst-blauw active-link" : "tekst-blauw"
            }
          >
            Info & Agenda
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? "btn-inschrijven active-link" : "btn-inschrijven"
            }
          >
            Inloggen
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}