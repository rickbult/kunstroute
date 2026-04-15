import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Kunstroute Noord West - Veluwe © 2026</p>

      <ul>
        <li><Link to="/register">Account aanmaken</Link></li>
        <li><Link to="/login">Inloggen</Link></li>
        <li><Link to="/Profile">Profile</Link></li>
      </ul>
    </footer>
  );
};

export default Footer;