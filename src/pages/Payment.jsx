import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateCurrentUser } from '../utils/auth';
import Toast from '../components/Toast';
import kunstrouteLogo from '../assets/kunstroutelogo.png';
import './Payment.css';

export default function Payment() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  function handlePaid() {
    setError('');
    setSuccess('Je hebt aangegeven dat je hebt betaald. Je ontvangt een bevestiging per e-mail. Je kunt je status bekijken in je profiel.');

    const user = getCurrentUser();
    if (user) {
      updateCurrentUser({ ...user, paymentStatus: 'paid' });
    }

    setTimeout(() => {
      navigate('/profile');
    }, 4000);
  }

  function handlePayLater() {
    setSuccess('');
    setError('Let op: dit moet voor een bepaalde datum gebeuren, ga hiervoor naar info en agenda in de navigatiebalk. Je kunt niet deelnemen als het bedrag niet is ontvangen.');

    const user = getCurrentUser();
    if (user) {
      updateCurrentUser({ ...user, paymentStatus: 'later' });
    }
  }

  return (
    <div className="betaling-bg">
      <div className="betaling-container">

        <div className="betaling-card">
          <img src={kunstrouteLogo} alt="Kunstroute" className="betaling-logo" />

          <h1 className="betaling-title">Betaalinstructies</h1>
          <p className="betaling-subtitle">
            Bedankt voor je aanmelding. Hieronder vind je de factuur met betaalinstructies.
          </p>

          <div className="betaling-invoice">
            <div className="invoice-row">
              <div className="invoice-col">
                <span className="invoice-label">Factuurnummer</span>
                <span className="invoice-value">KR-2026-K4FHGW</span>
              </div>
              <div className="invoice-col text-right">
                <span className="invoice-label">Datum</span>
                <span className="invoice-value">{dateString}</span>
              </div>
            </div>

            <div className="invoice-row">
              <div className="invoice-col">
                <span className="invoice-label">Naam</span>
                <span className="invoice-value">Naam Bezoeker</span>
              </div>
            </div>

            <div className="invoice-row invoice-border-bottom">
              <div className="invoice-col">
                <span className="invoice-label">Beschrijving</span>
                <span className="invoice-value">Deelname Kunstroute 2026</span>
              </div>
            </div>

            <div className="invoice-row price-row">
              <div className="invoice-col">
                <span className="invoice-label">Bedrag</span>
              </div>
              <div className="invoice-col text-right">
                <span className="invoice-price">€ 100.00</span>
              </div>
            </div>

            <div className="invoice-details-box">
              <h3 className="invoice-details-title">Betaalgegevens</h3>
              <div className="details-grid">
                <span>IBAN:</span>
                <span className="text-right fw-bold">NL91 ABNA 0417 1643 00</span>

                <span>Ten name van:</span>
                <span className="text-right fw-bold">Stichting Kunstroute</span>

                <span>Betalingskenmerk:</span>
                <span className="text-right fw-bold text-accent">KR-2026-K4FHGW</span>
              </div>
              <p className="invoice-warning">
                ⚠️ Vermeld altijd het betalingskenmerk en je volledige naam in de omschrijving bij je overboeking
              </p>
            </div>
          </div>
        </div>

        <Toast message={error} type="error" onClose={() => setError('')} />
        <Toast message={success} type="success" onClose={() => setSuccess('')} />

        <div className="betaling-actions">
          <button type="button" className="btn-betaald" onClick={handlePaid}>
            Ik heb de factuur bekeken / Betaald
          </button>

          <button type="button" className="btn-later" onClick={handlePayLater}>
            Later betalen
          </button>
        </div>

        <p className="betaling-footer-text">
          Bekijk of download eerst de factuur om door te gaan
        </p>
      </div>
    </div>
  );
}
