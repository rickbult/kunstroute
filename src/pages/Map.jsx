import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';
import fallbackKaartpunten from '../../server/kaartpuntenFallback.json';
import { FilterBalk } from '../components/filter.jsx';

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
function MapController({ bounds, sidebarIngeklapt }) {
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize({ animate: false });
      if (bounds) {
        map.fitBounds(bounds, { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] });
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [sidebarIngeklapt, bounds, map]);

  return null;
}

export default function KaartComponent() {
  const location = useLocation();
  const [kaartPuntenLijst, stelKaartPuntenLijstIn] = useState(() => filterGeldigeKaartpunten(fallbackKaartpunten));
  const [geselecteerdeLocatie, stelGeselecteerdeLocatieIn] = useState(null);
  const [sidebarIngeklapt, zetSidebarIngeklapt] = useState(false);
  const [zoekterm, setZoekterm] = useState('');
  const [geselecteerdeFilters, setGeselecteerdeFilters] = useState({});
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const huidigJaar = new Date().getFullYear();

  const selecteerLocatie = (kaartPunt) => {
    zetSidebarIngeklapt(false);
    stelGeselecteerdeLocatieIn(kaartPunt);
  };

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

  useEffect(() => {
    const artistId = new URLSearchParams(location.search).get('artist');
    if (!artistId || kaartPuntenLijst.length === 0) {
      return;
    }

    const gevondenPunt = kaartPuntenLijst.find((kaartPunt) => zoekKaartpuntLink(kaartPunt) === artistId);
    if (gevondenPunt) {
      selecteerLocatie(gevondenPunt);
    }
  }, [location.search, kaartPuntenLijst]);

  const filterOpties = useMemo(() => {
    const uniekeOpeningsdagen = new Set();
    const uniekePlaatsen = new Set();
    const uniekeKunstvormen = new Set();
    const uniekeRolstoelNiveaus = new Set();

    kaartPuntenLijst.forEach((kaartPunt) => {
      const dagMatches = kaartPunt.openDagenKunstroute2026?.match(/[A-Za-zÀ-ÿ]+dag/g) || [];
      dagMatches.forEach((dag) => uniekeOpeningsdagen.add(dag));

      const plaats = kaartPunt.volledigAdres?.split(',').pop()?.trim() || kaartPunt.stad?.trim();
      if (plaats) {
        uniekePlaatsen.add(plaats);
      }

      if (kaartPunt.titelWerk) {
        uniekeKunstvormen.add(kaartPunt.titelWerk);
      }

      if (kaartPunt.rolstoeltoegankelijkheid) {
        uniekeRolstoelNiveaus.add(kaartPunt.rolstoeltoegankelijkheid);
      }
    });

    const opNederlands = (a, b) => a.localeCompare(b, 'nl');

    return {
      openingsdagen: Array.from(uniekeOpeningsdagen).sort(opNederlands),
      plaatsen: Array.from(uniekePlaatsen).sort(opNederlands),
      kunstvormen: Array.from(uniekeKunstvormen).sort(opNederlands),
      rolstoelNiveaus: Array.from(uniekeRolstoelNiveaus).sort(opNederlands),
    };
  }, [kaartPuntenLijst]);

  const gefilterdeKaartPunten = useMemo(() => {
    const term = zoekterm.trim().toLowerCase();

    let resultaten = kaartPuntenLijst.filter((kaartPunt) => {
      const voldoetAanZoekterm =
        term.length === 0 ||
        [
          kaartPunt.naamKunstenaar,
          kaartPunt.volledigAdres,
          kaartPunt.stad,
          kaartPunt.titelWerk,
          kaartPunt.openDagenKunstroute2026,
        ]
          .filter(Boolean)
          .some((waarde) => waarde.toString().toLowerCase().includes(term));

      const rolstoelFilter = geselecteerdeFilters.rolstoelToegang || [];
      const voldoetAanRolstoel =
        rolstoelFilter.length === 0 ||
        rolstoelFilter.includes(kaartPunt.rolstoeltoegankelijkheid);

      const plaatsFilter = geselecteerdeFilters.plaats || [];
      const voldoetAanPlaats =
        plaatsFilter.length === 0 ||
        plaatsFilter.some((plaats) =>
          [kaartPunt.volledigAdres, kaartPunt.stad].filter(Boolean).some((waarde) => waarde.includes(plaats))
        );

      const kunstvormFilter = geselecteerdeFilters.kunstvorm || [];
      const voldoetAanKunstvorm =
        kunstvormFilter.length === 0 ||
        kunstvormFilter.includes(kaartPunt.titelWerk);

      const dagenFilter = geselecteerdeFilters.openingsdagen || [];
      const voldoetAanDagen =
        dagenFilter.length === 0 ||
        dagenFilter.some((dag) => kaartPunt.openDagenKunstroute2026?.includes(dag));

      return (
        voldoetAanZoekterm &&
        voldoetAanRolstoel &&
        voldoetAanPlaats &&
        voldoetAanKunstvorm &&
        voldoetAanDagen
      );
    });

    const sorteervolgorde = geselecteerdeFilters.sortering?.[0];
    if (sorteervolgorde === 'A-Z') {
      resultaten = [...resultaten].sort((a, b) => a.naamKunstenaar.localeCompare(b.naamKunstenaar, 'nl'));
    } else if (sorteervolgorde === 'Z-A') {
      resultaten = [...resultaten].sort((a, b) => b.naamKunstenaar.localeCompare(a.naamKunstenaar, 'nl'));
    }

    return resultaten;
  }, [kaartPuntenLijst, zoekterm, geselecteerdeFilters]);

  useEffect(() => {
    if (!geselecteerdeLocatie) {
      return;
    }

    const nogZichtbaar = gefilterdeKaartPunten.some(
      (kaartPunt) => kaartPunt.detailPaginaUrl === geselecteerdeLocatie.detailPaginaUrl
    );

    if (!nogZichtbaar) {
      stelGeselecteerdeLocatieIn(null);
    }
  }, [gefilterdeKaartPunten, geselecteerdeLocatie]);

  // Scroll sidebar to selected card when selection changes
  useEffect(() => {
    if (!geselecteerdeLocatie) return;

    if (sidebarIngeklapt) {
      zetSidebarIngeklapt(false);
      return;
    }

    const key = geselecteerdeLocatie.detailPaginaUrl || geselecteerdeLocatie.naamKunstenaar;
    const el = cardRefs.current[key];
    if (el && el.scrollIntoView) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [geselecteerdeLocatie, sidebarIngeklapt]);

  // voorkom keyboard navigation (extra safety)
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const coordinaatLijst = gefilterdeKaartPunten.map((p) => [p.breedtegraad, p.lengtegraad]);
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
    <div className={`kaart-container ${sidebarIngeklapt ? 'sidebar-collapsed' : ''}`}>
      <button
        type="button"
        className="kaart-sidebar-toggle"
        aria-label={sidebarIngeklapt ? 'Open sidebar' : 'Sluit sidebar'}
        onClick={() => {
          if (!sidebarIngeklapt) {
            stelGeselecteerdeLocatieIn(null);
          }
          zetSidebarIngeklapt((waarde) => !waarde);
        }}
      >
        {sidebarIngeklapt ? '‹' : '›'}
      </button>
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

          {gefilterdeKaartPunten.map((kaartPunt) => {
            const fotoUrl = kaartPunt.fotoUrl || null;
            const isSelected = geselecteerdeLocatie?.detailPaginaUrl === kaartPunt.detailPaginaUrl;
            const markerIcon = maakProfielfotoMarker(fotoUrl, kaartPunt.naamKunstenaar, isSelected);

            return (
              <Marker
                key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
                position={[kaartPunt.breedtegraad, kaartPunt.lengtegraad]}
                icon={markerIcon}
                eventHandlers={{ click: () => selecteerLocatie(kaartPunt) }}
              />
            );
          })}
              {/* Map controller to fit the available points once */}
              <MapController bounds={kaartBounds} sidebarIngeklapt={sidebarIngeklapt} />
        </MapContainer>
      </div>

      <aside className="kaart-sidebar">
        <div className="kaart-sidebar-filters">
          <div className="kaart-sidebar-search">
            <input
              type="text"
              placeholder="Zoek een kunstenaar..."
              value={zoekterm}
              onChange={(e) => setZoekterm(e.target.value)}
            />
          </div>

          <div className="filter-widget kaart-sidebar-filter-widget">
            <FilterBalk
              geselecteerdeFilters={geselecteerdeFilters}
              bijFilterWijziging={setGeselecteerdeFilters}
              filterOpties={filterOpties}
            />
          </div>
        </div>

        <div className="sidebar-content">
          {gefilterdeKaartPunten.length > 0 ? gefilterdeKaartPunten.map((kaartPunt) => {
            const isSelected = geselecteerdeLocatie?.detailPaginaUrl === kaartPunt.detailPaginaUrl;
            const fotoUrl = kaartPunt.fotoUrl || null;
            const kaartpuntLink = zoekKaartpuntLink(kaartPunt);
            const key = kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar;
            return (
              <div
                key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
                  ref={(el) => (cardRefs.current[key] = el)}
                  className={`locatie-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => selecteerLocatie(kaartPunt)}
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
          }) : (
            <p className="kaart-sidebar-empty">Geen kunstenaars gevonden met de geselecteerde filters.</p>
          )}
        </div>
        <div className="kaart-sidebar-note">ⓒ KunstRoute Noord-West Veluwe - {huidigJaar}</div>
      </aside>
    </div>
  );
}