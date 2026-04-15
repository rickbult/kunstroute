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
  profielfoto: null,
  kunstFoto: null,
};

export default function Registreren() {
  const navigate = useNavigate();
  const [form, setForm] = useState(LEEG);
  const [fout, setFout] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files && files[0]
            ? files[0]
            : null
          : value,
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
      if (!String(form[veld] || "").trim()) {
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

    const formData = new FormData();
    formData.append("voornaam", form.voornaam);
    formData.append("achternaam", form.achternaam);
    formData.append("email", form.email);
    formData.append("password", form.wachtwoord);
    formData.append("telefoon", form.telefoon);
    formData.append("kunstrichting", form.kunstrichting);
    formData.append("bio", form.bio || "");
    formData.append("website", form.website || "");
    formData.append("facebook", form.facebook || "");
    formData.append("instagram", form.instagram || "");
    formData.append("adres", form.adres);
    formData.append("postcode", form.postcode);
    formData.append("woonplaats", form.woonplaats);

    if (form.profielfoto) {
      formData.append("profielfoto", form.profielfoto);
    }

    if (form.kunstFoto) {
      formData.append("kunstFoto", form.kunstFoto);
    }

    try {
      setLoading(true);
      const result = await register(formData);

      if (!result.success) {
        setFout(result.error || "Registreren mislukt.");
        return;
      }

      navigate("/profile");
    } catch (error) {
      setFout("Er ging iets mis bij het registreren.");
    } finally {
      setLoading(false);
    }
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
                <label className="reg-label" htmlFor="voornaam">Voornaam *</label>
                <input
                  id="voornaam"
                  className="reg-input"
                  name="voornaam"
                  value={form.voornaam}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label" htmlFor="achternaam">Achternaam *</label>
                <input
                  id="achternaam"
                  className="reg-input"
                  name="achternaam"
                  value={form.achternaam}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="email">E-mailadres *</label>
              <input
                id="email"
                className="reg-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label" htmlFor="wachtwoord">
                  Wachtwoord * (min. 8 tekens)
                </label>
                <input
                  id="wachtwoord"
                  className="reg-input"
                  type="password"
                  name="wachtwoord"
                  value={form.wachtwoord}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label" htmlFor="wachtwoordBevestig">
                  Bevestig wachtwoord *
                </label>
                <input
                  id="wachtwoordBevestig"
                  className="reg-input"
                  type="password"
                  name="wachtwoordBevestig"
                  value={form.wachtwoordBevestig}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="telefoon">Telefoonnummer *</label>
              <input
                id="telefoon"
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
              <label className="reg-label" htmlFor="kunstrichting">
                Kunstrichting / discipline *
              </label>
              <input
                id="kunstrichting"
                className="reg-input"
                name="kunstrichting"
                value={form.kunstrichting}
                onChange={handleChange}
                placeholder="bijv. Schilderijen, Beeldhouwen, Fotografie..."
              />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="bio">Biografie / beschrijving</label>
              <textarea
                id="bio"
                className="reg-input reg-textarea"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Vertel iets over jezelf als kunstenaar..."
              />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="profielfoto">Profielfoto</label>
              <input
                id="profielfoto"
                className="reg-input"
                type="file"
                name="profielfoto"
                accept="image/*"
                onChange={handleChange}
              />
              <p className="reg-info">
                {form.profielfoto ? form.profielfoto.name : "Geen bestand gekozen"}
              </p>
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="kunstFoto">Foto van kunstwerk</label>
              <input
                id="kunstFoto"
                className="reg-input"
                type="file"
                name="kunstFoto"
                accept="image/*"
                onChange={handleChange}
              />
              <p className="reg-info">
                {form.kunstFoto ? form.kunstFoto.name : "Geen bestand gekozen"}
              </p>
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="website">Website</label>
              <input
                id="website"
                className="reg-input"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="www.jouwsite.nl"
              />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="facebook">Facebook</label>
              <input
                id="facebook"
                className="reg-input"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
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
              <label className="reg-label" htmlFor="adres">
                Adres met huisnummer en (eventueel) toevoeging: *
              </label>
              <input
                id="adres"
                className="reg-input"
                name="adres"
                value={form.adres}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="postcode">Postcode *</label>
              <input
                id="postcode"
                className="reg-input"
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="woonplaats">Woonplaats *</label>
              <input
                id="woonplaats"
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