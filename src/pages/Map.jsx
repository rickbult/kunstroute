import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';
import mapArtistPhotos from '../data/mapArtistPhotos.json';
import fallbackKaartpunten from '../../server/kaartpuntenFallback.json';

const maakSlug = (waarde) =>
  (waarde || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/https?:\/\/[^/]+\//, '')
    .replace(/\/+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Functie om initialen uit naam te halen
const haalInitialenOp = (naam) =>
  naam
    .split(' ')
    .filter((w) => w.length > 0)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

const zoekKunstenaarFoto = (naamKunstenaar) => mapArtistPhotos[maakSlug(naamKunstenaar)] || null;

const zoekKaartpuntLink = (kaartPunt) => {
  if (kaartPunt?.detailPaginaUrl) {
    try {
      const url = new URL(kaartPunt.detailPaginaUrl);
      const slug = url.pathname.split('/').filter(Boolean).pop();
      return slug || maakSlug(kaartPunt.naamKunstenaar);
    } catch (e) {
      return maakSlug(kaartPunt.naamKunstenaar);
    }
  }
  return maakSlug(kaartPunt?.naamKunstenaar);
};

const filterGeldigeKaartpunten = (kaartpunten) =>
  kaartpunten.filter((d) => Number.isFinite(d.breedtegraad) && Number.isFinite(d.lengtegraad));

const maakProfielfotoMarker = (fotoUrl, naamKunstenaar, isSelected) => {
  const html = fotoUrl
    ? `<div class="profiel-marker ${isSelected ? 'selected' : ''}"><div class="profiel-marker-body"><img src="${fotoUrl}" alt="${naamKunstenaar}" class="profiel-foto"/></div><div class="profiel-marker-tail"></div></div>`
    : `<div class="profiel-marker profiel-initialen ${isSelected ? 'selected' : ''}"><div class="profiel-marker-body"><span class="initialen-text">${haalInitialenOp(
        naamKunstenaar
      )}</span></div><div class="profiel-marker-tail"></div></div>`;

  return L.divIcon({
    html,
    className: `custom-div-icon${isSelected ? ' selected' : ''}`,
    iconSize: [50, 66],
    iconAnchor: [25, 66],
    popupAnchor: [0, -58],
  });
};

// Component die de kaart eenmaal op de punten afstemt
function MapController({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      try {
        map.setMaxBounds(bounds);
        map.fitBounds(bounds, { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] });
        map.once('moveend', () => {
          map.setMinZoom(map.getZoom());
        });
      } catch (e) {}
    }
  }, [bounds, map]);

  return null;
}

export default function KaartComponent() {
  const [kaartPuntenLijst, stelKaartPuntenLijstIn] = useState(() => filterGeldigeKaartpunten(fallbackKaartpunten));
  const [geselecteerdeLocatie, stelGeselecteerdeLocatieIn] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const huidigJaar = new Date().getFullYear();

  useEffect(() => {
    let actief = true;

    fetch('/api/kaartpunten')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (!actief || !Array.isArray(data)) {
          return;
        }

        const geldigePunten = filterGeldigeKaartpunten(data);
        if (geldigePunten.length > 0) {
          stelKaartPuntenLijstIn(geldigePunten);
        }
      })
      .catch((e) => {
        console.warn('Fout bij ophalen kaartpunten, fallback wordt gebruikt:', e.message);
      });

    return () => {
      actief = false;
    };
  }, []);

  // Scroll sidebar to selected card when selection changes
  useEffect(() => {
    if (!geselecteerdeLocatie) return;
    const key = geselecteerdeLocatie.detailPaginaUrl || geselecteerdeLocatie.naamKunstenaar;
    const el = cardRefs.current[key];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [geselecteerdeLocatie]);

  // voorkom keyboard navigation (extra safety)
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const coordinaatLijst = kaartPuntenLijst.map((p) => [p.breedtegraad, p.lengtegraad]);
  let kaartBounds = null;
  if (coordinaatLijst.length > 0) {
    const latitudes = coordinaatLijst.map((c) => c[0]);
    const longitudes = coordinaatLijst.map((c) => c[1]);
    kaartBounds = [
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ];
  }
  const defaultCenter = [52.35, 5.6];

  return (
    <div className="kaart-container">
      <div className={`kaart-wrapper ${geselecteerdeLocatie ? 'has-selection' : ''}`} ref={containerRef} tabIndex={0}>
        {/* Gebruik center/zoom totdat bounds beschikbaar is to avoid blank map */}
        <MapContainer
          className="kaart-canvas"
          dragging={true}
          zoomControl={true}
          keyboard={false}
          minZoom={11.25}
          {...(kaartBounds
            ? {
                bounds: kaartBounds,
                boundsOptions: { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] },
                maxBounds: kaartBounds,
                maxBoundsViscosity: 1.0,
              }
            : { center: defaultCenter, zoom: 11 })}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {kaartPuntenLijst.map((kaartPunt) => {
            const fotoUrl = zoekKunstenaarFoto(kaartPunt.naamKunstenaar);
            const isSelected = geselecteerdeLocatie?.detailPaginaUrl === kaartPunt.detailPaginaUrl;
            const markerIcon = maakProfielfotoMarker(fotoUrl, kaartPunt.naamKunstenaar, isSelected);

            return (
              <Marker
                key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
                position={[kaartPunt.breedtegraad, kaartPunt.lengtegraad]}
                icon={markerIcon}
                eventHandlers={{ click: () => stelGeselecteerdeLocatieIn(kaartPunt) }}
              />
            );
          })}
              {/* Map controller to fit the available points once */}
              <MapController bounds={kaartBounds} />
        </MapContainer>
      </div>

      <aside className="kaart-sidebar">
        <div className="sidebar-content">
          {kaartPuntenLijst.map((kaartPunt) => {
            const isSelected = geselecteerdeLocatie?.detailPaginaUrl === kaartPunt.detailPaginaUrl;
            const fotoUrl = zoekKunstenaarFoto(kaartPunt.naamKunstenaar);
            const kaartpuntLink = zoekKaartpuntLink(kaartPunt);
            const key = kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar;
            return (
              <div
                key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
                  ref={(el) => (cardRefs.current[key] = el)}
                  className={`locatie-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => stelGeselecteerdeLocatieIn(kaartPunt)}
              >
                  {isSelected && (
                    <button
                      className="card-close"
                      aria-label={`Sluit ${kaartPunt.naamKunstenaar}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        stelGeselecteerdeLocatieIn(null);
                      }}
                    >
                      ×
                    </button>
                  )}
                <div className="card-foto">
                  {fotoUrl ? <img src={fotoUrl} alt={kaartPunt.naamKunstenaar} /> : <div className="card-initialen"><span>{haalInitialenOp(kaartPunt.naamKunstenaar)}</span></div>}
                </div>
                <div className="card-info">
                  <h3>{kaartPunt.naamKunstenaar}</h3>
                  <p className="card-address">{kaartPunt.volledigAdres}</p>
                  <p className="card-days"><strong>Open:</strong> {kaartPunt.openDagenKunstroute2026}</p>
                  <p className="card-accessibility"><strong>Toegankelijk:</strong> {kaartPunt.rolstoeltoegankelijkheid}</p>
                  <Link to={`/artist/${kaartpuntLink}`} className="card-link">
                    Detailpagina →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="kaart-sidebar-note">ⓒ KunstRoute Noord-West Veluwe - {huidigJaar}</div>
      </aside>
    </div>
  );
}