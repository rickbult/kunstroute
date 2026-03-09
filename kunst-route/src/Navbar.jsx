export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <span className="logo-top">KUNST ROUTE</span>
        <span className="logo-bottom">NOORDWEST VELUWE</span>
      </a>

      <ul className="nav-links">
        <li><a href="#">Kaart</a></li>
        <li><a href="#">Kunstwerken</a></li>
        <li><a href="#">Kunstenaars</a></li>
        <li><a href="#">Info & Agenda</a></li>
        <li>
          <a href="#" className="btn-inschrijven">Inschrijven</a>
        </li>
      </ul>
    </nav>
  );
}





