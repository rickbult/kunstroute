import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fotoMetFallback, placeholderFoto } from "../utils/images";
import "./ArtistDetail.css";

export const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [isLaden, setIsLaden] = useState(true);

  const kaartSlug = id;

  useEffect(() => {
    let actief = true;

    fetch(`/api/artists/${encodeURIComponent(id)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Artist HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (actief) setArtist(data || null);
      })
      .catch(() => {
        if (actief) setArtist(null);
      })
      .finally(() => {
        if (actief) setIsLaden(false);
      });

    return () => {
      actief = false;
    };
  }, [id]);

  if (isLaden) {
    return (
      <div className="detail-wrapper">
        <p>Kunstenaar laden...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="detail-wrapper">
        <p>Kunstenaar niet gevonden.</p>
        <Link to="/" className="back-link">← Terug naar kunstenaars</Link>
      </div>
    );
  }

  const navigatieKnoppen = (
    <div className="artist-action-row">
      <Link to={`/kaart?artist=${encodeURIComponent(kaartSlug)}`} className="artist-action-button artist-action-button-primary">
        Bekijk kunstenaar op de kaart
      </Link>
      <Link to="/kunstenaars" className="artist-action-button artist-action-button-secondary">
        Bekijk overzicht van alle kunstenaars
      </Link>
    </div>
  );

  const openDagen = [
    artist.openZaterdag && 'Zaterdag',
    artist.openZondag && 'Zondag',
  ].filter(Boolean).join(' & ');

  return (
    <div className="detail-wrapper">
      <div className="artist-hero">
        <div className="artist-image">
          <img
            src={fotoMetFallback(artist.imgSrc, artist.title)}
            alt={artist.imgAlt}
            onError={(e) => {
              const fallback = placeholderFoto(artist.title);
              if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
          />
        </div>
        <div className="artist-info">
          <h1 className="artist-name">{artist.title}</h1>
          <div className="artist-tags">
            <span className="tag tag-location">{artist.location}</span>
            {openDagen && <span className="tag tag-days">{openDagen}</span>}
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
              <h3>Toegankelijkheid</h3>
              {artist.rolstoeltoegankelijk && <p>Rolstoel: {artist.rolstoeltoegankelijk}</p>}
              {openDagen && <p>Open: {openDagen}</p>}
            </div>
          </div>
          {navigatieKnoppen}
        </div>
      </div>

      {artist.kunstFoto && (
        <div className="artist-kunstwerk-sectie">
          <h2>Kunstwerk</h2>
          <img
            src={fotoMetFallback(artist.kunstFoto, artist.title)}
            alt={`Kunstwerk van ${artist.title}`}
            className="artist-kunstwerk-foto"
            onError={(e) => {
              const fallback = placeholderFoto(artist.title);
              if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
          />
        </div>
      )}
    </div>
  );
};
