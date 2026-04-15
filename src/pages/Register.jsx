import { useState } from "react";
import { useNavigate } from "react-router-dom";
import kunstrouteLogo from "../assets/kunstroutelogo.png";
import { register } from "../utils/auth";
import "./Register.css";

const LEEG = {
  voornaam: "",
  achternaam: "",
  email: "",
  wachtwoord: "",
  wachtwoordBevestig: "",
  telefoon: "",
  kunstrichting: "",
  bio: "",
  website: "",
  facebook: "",
  instagram: "",
  adres: "",
  postcode: "",
  woonplaats: "",
  voorwaarden: false,
};

export default function Registreren() {
  const navigate = useNavigate();
  const [form, setForm] = useState(LEEG);
  const [fout, setFout] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFout("");

    const verplicht = [
      "voornaam",
      "achternaam",
      "email",
      "wachtwoord",
      "telefoon",
      "kunstrichting",
      "adres",
      "postcode",
      "woonplaats",
    ];

    for (const veld of verplicht) {
      if (!form[veld].trim()) {
        setFout("Vul alle verplichte velden in (*).");
        return;
      }
    }

    if (form.wachtwoord.length < 8) {
      setFout("Wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    if (form.wachtwoord !== form.wachtwoordBevestig) {
      setFout("De wachtwoorden komen niet overeen.");
      return;
    }

    if (!form.voorwaarden) {
      setFout("Accepteer de deelname voorwaarden om door te gaan.");
      return;
    }

    const payload = {
      voornaam: form.voornaam,
      achternaam: form.achternaam,
      email: form.email,
      password: form.wachtwoord,
      telefoon: form.telefoon,
      kunstrichting: form.kunstrichting,
      bio: form.bio,
      website: form.website,
      facebook: form.facebook,
      instagram: form.instagram,
      adres: form.adres,
      postcode: form.postcode,
      woonplaats: form.woonplaats,
    };

    setLoading(true);
    const result = await register(payload);
    setLoading(false);

    if (!result.success) {
      setFout(result.error);
      return;
    }

    navigate("/profile");
  }

  return (
    <div className="reg-bg">
      <div className="reg-container">
        <header className="reg-header">
          <img src={kunstrouteLogo} alt="Kunstroute" className="reg-logo" />
          <div>
            <h1 className="reg-title">Aanmelden als kunstenaar</h1>
            <p className="reg-subtitle">Kunstroute Noordwest Veluwe</p>
          </div>
        </header>

        {fout && <div className="reg-fout">{fout}</div>}

        <form onSubmit={handleSubmit} className="reg-form" noValidate>
          <section className="reg-section">
            <h2 className="reg-section-title">Persoonlijke gegevens</h2>

            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Voornaam *</label>
                <input
                  className="reg-input"
                  name="voornaam"
                  value={form.voornaam}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">Achternaam *</label>
                <input
                  className="reg-input"
                  name="achternaam"
                  value={form.achternaam}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label">E-mailadres *</label>
              <input
                className="reg-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Wachtwoord * (min. 8 tekens)</label>
                <input
                  className="reg-input"
                  type="password"
                  name="wachtwoord"
                  value={form.wachtwoord}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">Bevestig wachtwoord *</label>
                <input
                  className="reg-input"
                  type="password"
                  name="wachtwoordBevestig"
                  value={form.wachtwoordBevestig}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label">Telefoonnummer *</label>
              <input
                className="reg-input"
                type="tel"
                name="telefoon"
                value={form.telefoon}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="reg-section">
            <h2 className="reg-section-title">Kunstenaars informatie</h2>

            <div className="reg-field">
              <label className="reg-label">Kunstrichting / discipline *</label>
              <input
                className="reg-input"
                name="kunstrichting"
                value={form.kunstrichting}
                onChange={handleChange}
                placeholder="bijv. Schilderijen, Beeldhouwen, Fotografie..."
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Biografie / beschrijving</label>
              <textarea
                className="reg-input reg-textarea"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Vertel iets over jezelf als kunstenaar..."
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Website</label>
              <input
                className="reg-input"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="www.jouwsite.nl"
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Facebook</label>
              <input
                className="reg-input"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Instagram</label>
              <input
                className="reg-input"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="reg-section">
            <h2 className="reg-section-title">Adres (voor ballotage)</h2>
            <p className="reg-info">
              Doe je voor het eerst mee of heb je in 2022 of eerder voor het laatst meegedaan aan de kunstroute, dan vindt er een ballotage plaats. Vul dan hieronder het adres in waar we jou kunnen balloteren:
            </p>

            <div className="reg-field">
              <label className="reg-label">
                Adres met huisnummer en (eventueel) toevoeging: *
              </label>
              <input
                className="reg-input"
                name="adres"
                value={form.adres}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Postcode *</label>
              <input
                className="reg-input"
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Woonplaats *</label>
              <input
                className="reg-input"
                name="woonplaats"
                value={form.woonplaats}
                onChange={handleChange}
              />
            </div>
          </section>

          <div className="reg-checkbox-group">
            <input
              type="checkbox"
              id="voorwaarden"
              name="voorwaarden"
              checked={form.voorwaarden}
              onChange={handleChange}
            />
            <label htmlFor="voorwaarden" className="reg-checkbox-label">
              Ik heb de deelname voorwaarden gedownload en gelezen!
            </label>
          </div>

          <p className="reg-info">
            P.S. De voorwaarden worden als bijlage in de mail meegestuurd.
          </p>

          <div className="reg-submit-row">
            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? "Verzenden..." : "Verzenden"}
            </button>

            <button
              type="button"
              className="reg-btn-sec"
              onClick={() => navigate("/login")}
            >
              Al een account? Inloggen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}