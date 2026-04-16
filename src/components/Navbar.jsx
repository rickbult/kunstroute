import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/kunstroutelogo.png"; // adjust if needed

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
            to="/info"
            className={({ isActive }) =>
              isActive ? "tekst-blauw active-link" : "tekst-blauw"
            }
          >
            Info
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              isActive ? "tekst-blauw active-link" : "tekst-blauw"
            }
          >
            Agenda
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "btn-inschrijven active-link" : "btn-inschrijven"
            }
          >
            Account
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}