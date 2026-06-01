import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser, logout } from "../utils/auth";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bewerken, setBewerken] = useState(true);
  const [form, setForm] = useState({});
  const [succes, setSucces] = useState("");
  const [fout, setFout] = useState("");
  const [adresCheck, setAdresCheck] = useState(null);

  useEffect(function () {
    async function loadUser() {
      const current = await getCurrentUser();

      if (!current) {
        navigate("/login");
        return;
      }

      setUser(current);
      setForm(current);
    }

    loadUser();
  }, [navigate]);

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const type = e.target.type;
    const files = e.target.files;

    if (['adres', 'postcode', 'woonplaats'].includes(name)) {
      setAdresCheck(null);
    }

    setForm(function (prev) {
      return {
        ...prev,
        [name]: type === "file" ? (files && files[0] ? files[0] : null) : value,
      };
    });
  }

  async function controleerAdres() {
    if (!form.adres && !form.woonplaats) return;
    setAdresCheck('loading');

    const basis = { format: 'json', limit: 1, countrycodes: 'nl' };
    const pogingen = [
      form.adres && form.woonplaats && { street: form.adres, postalcode: form.postcode, city: form.woonplaats, ...basis },
      form.adres && form.woonplaats && { street: form.adres, city: form.woonplaats, ...basis },
      form.woonplaats               && { city: form.woonplaats, ...basis },
    ].filter(Boolean);

    for (const params of pogingen) {
      const qs = new URLSearchParams(params).toString();
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`);
        const data = await res.json();
        if (data?.[0]) {
          setAdresCheck({ gevonden: true, display: data[0].display_name });
          return;
        }
      } catch {}
    }
    setAdresCheck({ gevonden: false });
  }

  async function handleOpslaan(e) {
    e.preventDefault();
    setFout("");
    setSucces("");

    if (
      !form.voornaam ||
      !form.voornaam.trim() ||
      !form.achternaam ||
      !form.achternaam.trim() ||
      !form.telefoon ||
      !form.telefoon.trim()
    ) {
      setFout("Voornaam, achternaam en telefoonnummer zijn verplicht.");
      return;
    }

    const formData = new FormData();
    formData.append("voornaam", form.voornaam || "");
    formData.append("achternaam", form.achternaam || "");
    formData.append("telefoon", form.telefoon || "");
    formData.append("kunstrichting", form.kunstrichting || "");
    formData.append("bio", form.bio || "");
    formData.append("website", form.website || "");
    formData.append("facebook", form.facebook || "");
    formData.append("instagram", form.instagram || "");
    formData.append("adres", form.adres || "");
    formData.append("postcode", form.postcode || "");
    formData.append("woonplaats", form.woonplaats || "");
    formData.append("openZaterdag",         form.openZaterdag         ? "true" : "false");
    formData.append("openZondag",           form.openZondag           ? "true" : "false");
    formData.append("rolstoeltoegankelijk", form.rolstoeltoegankelijk || "");

    if (form.profielfoto && typeof form.profielfoto !== "string") {
      formData.append("profielfoto", form.profielfoto);
    }

    if (form.kunstFoto && typeof form.kunstFoto !== "string") {
      formData.append("kunstFoto", form.kunstFoto);
    }

    const result = await updateCurrentUser(formData);

    if (!result.success) {
      setFout(result.error || "Opslaan mislukt.");
      return;
    }

    setUser(result.user);
    setForm(result.user);
    setBewerken(false);
    setSucces("Gegevens zijn opgeslagen!");

    setTimeout(function () {
      setSucces("");
    }, 3000);
  }

  function handleUitloggen() {
    logout();
    navigate("/login");
  }

  if (!user) {
    return null;
  }

  var voorletter = user.voornaam && user.voornaam.length > 0 ? user.voornaam[0] : "";
  var achternaamletter = user.achternaam && user.achternaam.length > 0 ? user.achternaam[0] : "";
  var initialen = (voorletter + achternaamletter).toUpperCase();

  return (
    <div className="page profiel-page">
      <div className="profiel-inner">
      <div className="profiel-header">
        {user.profielfoto ? (
          <img
            src={user.profielfoto}
            alt="Profielfoto"
            className="profiel-avatar-image"
          />
        ) : (
          <div className="profiel-avatar">{initialen}</div>
        )}

        <div className="profiel-header-info">
          <h1 className="profiel-naam">
            {user.voornaam} {user.achternaam}
          </h1>
          <p className="profiel-email">{user.email}</p>
          {user.kunstrichting ? (
            <p className="profiel-kunstrichting">{user.kunstrichting}</p>
          ) : null}
        </div>

      </div>

      {succes ? <div className="profiel-melding profiel-succes">{succes}</div> : null}
      {fout ? <div className="profiel-melding profiel-fout">{fout}</div> : null}

      {!bewerken ? (
        <div>
          <div className="profiel-sectie">
            <h2>Persoonlijke gegevens</h2>
            <div className="profiel-grid">
              <div>
                <span className="profiel-key">Voornaam</span>
                <span>{user.voornaam}</span>
              </div>
              <div>
                <span className="profiel-key">Achternaam</span>
                <span>{user.achternaam}</span>
              </div>
              <div>
                <span className="profiel-key">Telefoon</span>
                <span>{user.telefoon || "—"}</span>
              </div>
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Kunstenaars informatie</h2>
            <div className="profiel-grid profiel-grid-wide">
              <div>
                <span className="profiel-key">Kunstrichting</span>
                <span>{user.kunstrichting || "—"}</span>
              </div>
              <div>
                <span className="profiel-key">Website</span>
                <span>{user.website || "—"}</span>
              </div>
              <div>
                <span className="profiel-key">Facebook</span>
                <span>{user.facebook || "—"}</span>
              </div>
              <div>
                <span className="profiel-key">Instagram</span>
                <span>{user.instagram || "—"}</span>
              </div>

              {user.bio ? (
                <div className="profiel-grid-full">
                  <span className="profiel-key">Biografie</span>
                  <span>{user.bio}</span>
                </div>
              ) : null}

              <div className="profiel-grid-full">
                <span className="profiel-key">Profielfoto</span>
                <span>
                  {user.profielfoto ? (
                    <img
                      src={user.profielfoto}
                      alt="Profielfoto"
                      className="profiel-foto"
                    />
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <div className="profiel-grid-full">
                <span className="profiel-key">Kunstwerk foto</span>
                <span>
                  {user.kunstFoto ? (
                    <img
                      src={user.kunstFoto}
                      alt="Kunstwerk"
                      className="profiel-foto"
                    />
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Open dagen kunstroute</h2>
            <div className="profiel-open-dagen">
              <span className={`profiel-dag-badge ${user.openZaterdag ? 'actief' : ''}`}>Zaterdag</span>
              <span className={`profiel-dag-badge ${user.openZondag   ? 'actief' : ''}`}>Zondag</span>
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Rolstoeltoegankelijkheid</h2>
            <span className={`profiel-dag-badge ${user.rolstoeltoegankelijk === 'Ja' ? 'actief' : user.rolstoeltoegankelijk === 'Gedeeltelijk' ? 'gedeeltelijk' : ''}`}>
              ♿ {user.rolstoeltoegankelijk || '—'}
            </span>
          </div>

          <div className="profiel-sectie">
            <h2>Adres</h2>
            <div className="profiel-grid">
              <div>
                <span className="profiel-key">Adres</span>
                <span>{user.adres || "—"}</span>
              </div>
              <div>
                <span className="profiel-key">Postcode</span>
                <span>{user.postcode || "—"}</span>
              </div>
              <div>
                <span className="profiel-key">Woonplaats</span>
                <span>{user.woonplaats || "—"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="profiel-bewerk-btn"
            onClick={function () {
              setBewerken(true);
              setFout("");
              setSucces("");
            }}
          >
            Gegevens aanpassen
          </button>
        </div>
      ) : (
        <form onSubmit={handleOpslaan} noValidate>
          <div className="profiel-sectie">
            <h2>Persoonlijke gegevens aanpassen</h2>

            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Voornaam *</label>
                <input
                  className="reg-input"
                  name="voornaam"
                  value={form.voornaam || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">Achternaam *</label>
                <input
                  className="reg-input"
                  name="achternaam"
                  value={form.achternaam || ""}
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
                value={form.telefoon || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Kunstenaars informatie</h2>

            <div className="reg-field">
              <label className="reg-label">Kunstrichting / discipline</label>
              <input
                className="reg-input"
                name="kunstrichting"
                value={form.kunstrichting || ""}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Biografie / beschrijving</label>
              <textarea
                className="reg-input reg-textarea"
                name="bio"
                value={form.bio || ""}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Profielfoto</label>
              <input
                className="reg-input"
                type="file"
                name="profielfoto"
                accept="image/*"
                onChange={handleChange}
              />
              <p className="reg-info">
                {form.profielfoto && typeof form.profielfoto !== "string"
                  ? form.profielfoto.name
                  : user.profielfoto
                  ? "Huidige profielfoto aanwezig"
                  : "Geen bestand gekozen"}
              </p>
            </div>

            <div className="reg-field">
              <label className="reg-label">Foto van kunstwerk</label>
              <input
                className="reg-input"
                type="file"
                name="kunstFoto"
                accept="image/*"
                onChange={handleChange}
              />
              <p className="reg-info">
                {form.kunstFoto && typeof form.kunstFoto !== "string"
                  ? form.kunstFoto.name
                  : user.kunstFoto
                  ? "Huidige kunstfoto aanwezig"
                  : "Geen bestand gekozen"}
              </p>
            </div>

            <div className="reg-field">
              <label className="reg-label">Website</label>
              <input
                className="reg-input"
                name="website"
                value={form.website || ""}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Facebook</label>
              <input
                className="reg-input"
                name="facebook"
                value={form.facebook || ""}
                onChange={handleChange}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Instagram</label>
              <input
                className="reg-input"
                name="instagram"
                value={form.instagram || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Open dagen kunstroute</h2>
            <p className="reg-info" style={{ marginBottom: '12px' }}>Geef aan op welke dagen je open bent tijdens de kunstroute.</p>
            <div className="profiel-open-dagen">
              <label className="profiel-dag-label">
                <input
                  type="checkbox"
                  name="openZaterdag"
                  checked={!!form.openZaterdag}
                  onChange={(e) => setForm(prev => ({ ...prev, openZaterdag: e.target.checked }))}
                />
                Zaterdag
              </label>
              <label className="profiel-dag-label">
                <input
                  type="checkbox"
                  name="openZondag"
                  checked={!!form.openZondag}
                  onChange={(e) => setForm(prev => ({ ...prev, openZondag: e.target.checked }))}
                />
                Zondag
              </label>
            </div>
          </div>

          <div className="profiel-sectie">
            <h2>Rolstoeltoegankelijkheid</h2>
            <select
              className="reg-input"
              name="rolstoeltoegankelijk"
              value={form.rolstoeltoegankelijk || ""}
              onChange={(e) => setForm(prev => ({ ...prev, rolstoeltoegankelijk: e.target.value }))}
            >
              <option value="">— Kies een optie —</option>
              <option value="Ja">Ja</option>
              <option value="Gedeeltelijk">Gedeeltelijk</option>
              <option value="Nee">Nee</option>
            </select>
          </div>

          <div className="profiel-sectie">
            <h2>Adres</h2>

            <div className="reg-field">
              <label className="reg-label">Adres met huisnummer</label>
              <input
                className="reg-input"
                name="adres"
                value={form.adres || ""}
                onChange={handleChange}
              />
            </div>

            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Postcode</label>
                <input
                  className="reg-input"
                  name="postcode"
                  value={form.postcode || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">Woonplaats</label>
                <input
                  className="reg-input"
                  name="woonplaats"
                  value={form.woonplaats || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-adres-check-row">
                <button
                  type="button"
                  className="reg-btn-adres-check"
                  onClick={controleerAdres}
                  disabled={adresCheck === 'loading' || (!form.adres && !form.woonplaats)}
                >
                  {adresCheck === 'loading' ? 'Opzoeken...' : 'Controleer adres op kaart'}
                </button>

                {adresCheck && adresCheck !== 'loading' && (
                  <div className={`reg-adres-result ${adresCheck.gevonden ? 'gevonden' : 'niet-gevonden'}`}>
                    {adresCheck.gevonden ? (
                      <>
                        <span className="reg-adres-icon">✓</span>
                        <span>Gevonden: <strong>{adresCheck.display}</strong></span>
                      </>
                    ) : (
                      <>
                        <span className="reg-adres-icon">✗</span>
                        <span>Adres niet gevonden — controleer je spelling of gebruik een bekende plaatsnaam.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="profiel-form-actions">
            <button
              type="button"
              className="reg-btn-sec"
              onClick={function () {
                setBewerken(false);
                setForm(user);
                setFout("");
                setSucces("");
              }}
            >
              Annuleren
            </button>

            <button type="submit" className="reg-btn">
              Opslaan
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}