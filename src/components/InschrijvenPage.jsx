import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./InschrijvenPage.css";

const emptyArtwork = () => ({ image: null, name: "", year: "", bio: "" });

export const InschrijvenPage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [days, setDays] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [artworks, setArtworks] = useState([
    emptyArtwork(),
    emptyArtwork(),
    emptyArtwork(),
    emptyArtwork(),
  ]);
  const [saved, setSaved] = useState(false);

  const profileInputRef = useRef();

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleAddArtwork = () => {
    setArtworks([...artworks, emptyArtwork()]);
  };

  const handleArtworkChange = (index, field, value) => {
    const updated = [...artworks];
    updated[index] = { ...updated[index], [field]: value };
    setArtworks(updated);
  };

  const handleArtworkImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...artworks];
      updated[index] = { ...updated[index], image: URL.createObjectURL(file) };
      setArtworks(updated);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="inschrijven-wrapper">
      <Link to="/" className="back-link">← Terug naar kunstenaars</Link>

      <div className="inschrijven-hero">
        <div
          className="inschrijven-image-upload"
          onClick={() => profileInputRef.current.click()}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profielfoto" />
          ) : (
            <span className="upload-placeholder">Klik om profielfoto te uploaden</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={handleProfileImageChange}
            style={{ display: "none" }}
          />
        </div>

        
        <div className="inschrijven-info">
          <input
            className="inschrijven-name-input"
            type="text"
            placeholder="Naam Kunstenaar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="inschrijven-location-row">
            <span className="location-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <input
              className="inschrijven-location-input"
              type="text"
              placeholder="Locatie"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              className="inschrijven-days-input"
              type="text"
              placeholder="Dagen aanwezig"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <label className="bio-label">Persoonlijke bio</label>
          <textarea
            className="inschrijven-bio-input"
            placeholder="Schrijf hier uw biografie..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />

          <div className="inschrijven-contact-card">
            <div className="contact-col">
              <h3>Bezoekadres</h3>
              <input
                type="text"
                placeholder="Straatnaam/Huisnummer"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Postcode/Locatie"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
              <a href="#" className="map-link">Bekijk op kaart</a>
            </div>
            <div className="contact-col">
              <h3>Contact</h3>
              <div className="contact-input-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
                </svg>
                <input
                  type="tel"
                  placeholder="Telefoon nummer"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="contact-input-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="inschrijven-works">
        <div className="works-header">
          <h2>Werken van Kunstenaar</h2>
          <button className="add-artwork-btn" onClick={handleAddArtwork}>
            + Kunstwerk Toevoegen
          </button>
        </div>
        <div className="inschrijven-works-grid">
          {artworks.map((work, index) => {
            const artworkInputId = `artwork-input-${index}`;
            return (
              <div key={index} className="inschrijven-work-card">
                <div
                  className="work-image-upload"
                  onClick={() => document.getElementById(artworkInputId).click()}
                >
                  {work.image ? (
                    <img src={work.image} alt={work.name || "Kunstwerk"} />
                  ) : (
                    <span className="upload-placeholder">Upload afbeelding</span>
                  )}
                  <input
                    id={artworkInputId}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleArtworkImageChange(index, e)}
                  />
                </div>
                <div className="work-fields">
                  <input
                    type="text"
                    className="work-field-name"
                    placeholder="Naam Kunstwerk"
                    value={work.name}
                    onChange={(e) => handleArtworkChange(index, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    className="work-field-year"
                    placeholder="Jaartal"
                    value={work.year}
                    onChange={(e) => handleArtworkChange(index, "year", e.target.value)}
                  />
                  <input
                    type="text"
                    className="work-field-bio"
                    placeholder="Korte Bio"
                    value={work.bio}
                    onChange={(e) => handleArtworkChange(index, "bio", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="save-bar">
        {saved && <span className="save-feedback">✓ Profiel opgeslagen!</span>}
        <button className="save-btn" onClick={handleSave}>
          Opslaan
        </button>
      </div>
    </div>
  );
};
