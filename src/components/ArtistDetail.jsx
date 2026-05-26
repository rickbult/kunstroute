import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ArtistDetail.css";

export const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [kaartpunt, setKaartpunt] = useState(null);
  const [isLaden, setIsLaden] = useState(true);

  const kaartSlug = id;

  useEffect(() => {
    let actief = true;

    Promise.all([fetch("/api/artists"), fetch("/api/kaartpunten")])
      .then(async ([artistsResponse, kaartpuntenResponse]) => {
        if (!artistsResponse.ok) {
          throw new Error(`Artists HTTP ${artistsResponse.status}`);
        }
        if (!kaartpuntenResponse.ok) {
          throw new Error(`Kaartpunten HTTP ${kaartpuntenResponse.status}`);
        }

        const [artistsData, kaartpuntenData] = await Promise.all([
          artistsResponse.json(),
          kaartpuntenResponse.json(),
        ]);

        if (!actief) {
          return;
        }

        setArtist(Array.isArray(artistsData) ? artistsData.find((item) => item.link === id) || null : null);
        setKaartpunt(
          Array.isArray(kaartpuntenData)
            ? kaartpuntenData.find((punt) => {
                try {
                  const urlSlug = new URL(punt.detailPaginaUrl).pathname.split("/").filter(Boolean).pop() || "";
                  const naamSlug = (punt.naamKunstenaar || "")
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/https?:\/\/[^/]+\//, "")
                    .replace(/\/+$/, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                  return naamSlug === id || urlSlug === id;
                } catch (e) {
                  return false;
                }
              }) || null
            : null,
        );
      })
      .catch(() => {
        if (actief) {
          setArtist(null);
          setKaartpunt(null);
        }
      })
      .finally(() => {
        if (actief) {
          setIsLaden(false);
        }
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

  if (!artist && !kaartpunt) {
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

  if (kaartpunt) {
    return (
      <div className="detail-wrapper">
        <div className="artist-hero">
          {kaartpunt.fotoUrl && (
            <div className="artist-image">
              <img src={kaartpunt.fotoUrl} alt={kaartpunt.naamKunstenaar} />
            </div>
          )}
          <div className="artist-info" style={{ width: '100%' }}>
            <h1 className="artist-name">{kaartpunt.naamKunstenaar}</h1>
            <div className="artist-tags">
              <span className="tag tag-location">{kaartpunt.stad}</span>
              <span className="tag tag-days">{kaartpunt.openDagenKunstroute2026}</span>
            </div>
            <p className="artist-bio">{kaartpunt.titelWerk || kaartpunt.volledigAdres}</p>

            <div className="artist-contact-card">
              <div className="contact-section">
                <h3>Bezoekadres</h3>
                <p>{kaartpunt.volledigAdres}</p>
                <p>{kaartpunt.stad}</p>
                <a href={kaartpunt.googleMapsUrl || "#"} className="map-link" target="_blank" rel="noreferrer">Bekijk op kaart</a>
              </div>
              <div className="contact-section">
                <h3>Toegankelijkheid</h3>
                <p>{kaartpunt.rolstoeltoegankelijkheid}</p>
                <p>{kaartpunt.openDagenKunstroute2026}</p>
              </div>
            </div>
            {navigatieKnoppen}
          </div>
        </div>
      </div>
    );
  }

  const openDagen = [
    artist.openZaterdag && 'Zaterdag',
    artist.openZondag && 'Zondag',
  ].filter(Boolean).join(' & ');

  return (
    <div className="detail-wrapper">
      <div className="artist-hero">
        <div className="artist-image">
          <img src={artist.imgSrc} alt={artist.imgAlt} />
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
