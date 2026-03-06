export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="site-title">Kunst Route</a>
      <ul>
        <li className="active"><a href="#">Kaart</a></li>
        <li className="active"><a href="#">Kunstwerken</a></li>
        <li className="active"><a href="#">Kunstenaars</a></li>
        <li className="active"><a href="#">Info & Agenda</a></li>
        <li className="active"><a href="#">Inschrijven</a></li>
      </ul>
    </nav>
  );
}
