import { Link } from 'react-router-dom';
import kunstrouteLogo from '../assets/Kunstroute logo.png';
import './Registreren.css'; // Reuse registration styles

export default function Inschrijven() {
  return (
    <div className="reg-bg">
      <div className="reg-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <img src={kunstrouteLogo} alt="Kunstroute" className="reg-logo" style={{ margin: '0 auto 2rem' }} />
        <h1 className="reg-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Inschrijven</h1>
        <p className="reg-subtitle" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Leuk dat je wilt meedoen aan de Kunstroute Noordwest Veluwe!
        </p>
        
        <Link to="/registreren" className="reg-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Maak een kunstenaar account aan
        </Link>
      </div>
    </div>
  );
}

