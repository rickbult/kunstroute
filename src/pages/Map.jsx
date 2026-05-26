import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';

const haalInitialenOp = (naam) =>
  naam
    .split(' ')
    .filter((w) => w.length > 0)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

const maakProfielfotoMarker = (fotoUrl, naamKunstenaar, isSelected) => {
  const html = fotoUrl
    ? `<div class="profiel-marker ${isSelected ? 'selected' : ''}"><img src="${fotoUrl}" alt="${naamKunstenaar}" class="profiel-foto"/></div>`
    : `<div class="profiel-marker profiel-initialen ${isSelected ? 'selected' : ''}"><span class="initialen-text">${haalInitialenOp(
        naamKunstenaar
      )}</span></div>`;

  return L.divIcon({
    html,
    className: `custom-div-icon${isSelected ? ' selected' : ''}`,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
  });
};

// Component die de kaart eenmaal op de punten afstemt
function MapController({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      try {
        map.fitBounds(bounds, { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] });
      } catch (e) {}
    }
  }, [bounds, map]);

  return null;
}

export default function KaartComponent() {
  const [kaartPuntenLijst, stelKaartPuntenLijstIn] = useState([]);
  const [geselecteerdeLocatie, stelGeselecteerdeLocatieIn] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    fetch('/api/map-punten')
      .then((r) => r.json())
      .then((data) =>
        stelKaartPuntenLijstIn(
          data.filter((d) => Number.isFinite(d.breedtegraad) && Number.isFinite(d.lengtegraad))
        )
      )
      .catch((e) => console.error('Fout bij ophalen kaartpunten:', e));
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
          dragging={false}
          zoomControl={false}
          keyboard={false}
          minZoom={10}
          {...(kaartBounds
            ? { bounds: kaartBounds, boundsOptions: { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] } }
            : { center: defaultCenter, zoom: 10 })}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {kaartPuntenLijst.map((kaartPunt) => {
            const fotoUrl = kaartPunt.fotoUrl || null;
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
            const fotoUrl = kaartPunt.fotoUrl || null;
            const kaartpuntLink = kaartPunt.detailPaginaUrl;
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
      </aside>
    </div>
  );
}