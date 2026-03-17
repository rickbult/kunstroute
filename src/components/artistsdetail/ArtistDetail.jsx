import React from "react";
import { useParams, Link } from "react-router-dom";
import artists from "../data/artists.json";
import "./artiestDetail.css";

export const ArtistDetail = () => {
  const { id } = useParams();
  const artist = artists.find((a) => a.link === id);

  if (!artist) {
    return (
      <div className="detail-wrapper">
        <p>Kunstenaar niet gevonden.</p>
        <Link to="/" className="back-link">← Terug naar kunstenaars</Link>
      </div>
    );
  }

  return (
    <div className="detail-wrapper">
      <Link to="/" className="back-link">← Terug naar kunstenaars</Link>

      <div className="artist-hero">
        <div className="artist-image">
          <img src={artist.imgSrc} alt={artist.imgAlt} />
        </div>
        <div className="artist-info">
          <h1 className="artist-name">{artist.title}</h1>
          <div className="artist-tags">
            <span className="tag tag-location"> {artist.location}</span>
            <span className="tag tag-days">{artist.days}</span>
          </div>
          <p className="artist-bio">{artist.description}</p>

          <div className="artist-contact-card">
            <div className="contact-section">
              <h3>Bezoekadres</h3>
              <p>{artist.address || "Straatnaam/Huisnummer"}</p>
              <p>{artist.postcode || "Postcode/Locatie"}</p>
              <a href="#" className="map-link">Bekijk op kaart</a>
            </div>
            <div className="contact-section">
              <h3>Contact</h3>
              <p> {artist.phone || "Telefoon nummer"}</p>
              <p> {artist.email || "Email"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="artist-works">
        <h2>Werken van Kunstenaar</h2>
        <hr />
        <div className="works-grid">
          {(artist.artworks || []).map((work, index) => (
            <div key={index} className="work-card">
              <div className="work-image">
                <img src={work.imgSrc} alt={work.name} />
              </div>
              <div className="work-info">
                <div className="work-header">
                  <span className="work-name">{work.name}</span>
                  <span className="work-year">{work.year}</span>
                </div>
                <p className="work-bio">{work.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
