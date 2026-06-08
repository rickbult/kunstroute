import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';
// Kaartpunten komen live uit de Gebruikers-collectie (zelfde bron als
// /kunstenaars en /kunstwerken) — geen seeded/offline mockdata meer.
import { FilterBalk } from '../components/filter.jsx';
import { RoutePlanner } from '../components/RoutePlanner.jsx';

const KAART_MIN_ZOOM = 11.25;
// Voorkomt dat de kaart extreem inzoomt wanneer de zichtbare set uit één
// (of een aantal dicht bij elkaar gelegen) punt(en) bestaat — bijv. bij een
// route met maar 1 stop heeft de bounding box dan geen oppervlakte.
const KAART_MAX_FIT_ZOOM = 15;

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

const maakProfielfotoMarker = (fotoUrl, naamKunstenaar, isSelected, inRoute) => {
  const klassen = `${isSelected ? 'selected' : ''} ${inRoute ? 'in-route' : ''}`.trim();
  const html = fotoUrl
    ? `<div class="profiel-marker ${klassen}"><div class="profiel-marker-body"><img src="${fotoUrl}" alt="${naamKunstenaar}" class="profiel-foto"/></div><div class="profiel-marker-tail"></div></div>`
    : `<div class="profiel-marker profiel-initialen ${klassen}"><div class="profiel-marker-body"><span class="initialen-text">${haalInitialenOp(
        naamKunstenaar
      )}</span></div><div class="profiel-marker-tail"></div></div>`;

  return L.divIcon({
    html,
    className: `custom-div-icon${klassen ? ` ${klassen}` : ''}`,
    iconSize: [50, 66],
    iconAnchor: [25, 66],
    popupAnchor: [0, -58],
  });
};

// Component die de kaart eenmaal op de punten afstemt
function MapController({ bounds, sidebarIngeklapt }) {
  const map = useMap();

  // Eigen pane vóór de markers zodat de routelijn altijd zichtbaar blijft,
  // ook wanneer twee gekozen punten dicht bij elkaar liggen en hun markers overlappen
  useEffect(() => {
    if (!map.getPane('routeLijnPane')) {
      const pane = map.createPane('routeLijnPane');
      pane.style.zIndex = 650;
    }
  }, [map]);

  useEffect(() => {
    if (bounds) {
      try {
        // Begin telkens vanaf de oorspronkelijke ondergrens: anders schuift de
        // minZoom hieronder steeds verder omhoog bij elke (zoek)filtering naar een
        // kleinere subset, en kan de kaart na het wissen van het filter niet meer
        // ver genoeg uitzoomen om alle punten (en dus ook een routelijn ertussen) te tonen.
        map.setMinZoom(KAART_MIN_ZOOM);
        map.setMaxBounds(bounds);
        map.fitBounds(bounds, { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20], maxZoom: KAART_MAX_FIT_ZOOM });
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
        map.fitBounds(bounds, { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20], maxZoom: KAART_MAX_FIT_ZOOM });
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [sidebarIngeklapt, bounds, map]);

  return null;
}

export default function KaartComponent() {
  const location = useLocation();
  const [kaartPuntenLijst, stelKaartPuntenLijstIn] = useState([]);
  const [geselecteerdeLocatie, stelGeselecteerdeLocatieIn] = useState(null);
  const [sidebarIngeklapt, zetSidebarIngeklapt] = useState(false);
  const [zoekterm, setZoekterm] = useState('');
  const [geselecteerdeFilters, setGeselecteerdeFilters] = useState({});
  const [planModusActief, setPlanModusActief] = useState(false);
  const [routeStops, setRouteStops] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [routeLaadStatus, setRouteLaadStatus] = useState('idle');
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const huidigJaar = new Date().getFullYear();

  const selecteerLocatie = (kaartPunt) => {
    zetSidebarIngeklapt(false);
    stelGeselecteerdeLocatieIn(kaartPunt);
  };

  const routeStopSleutel = (kaartPunt) => kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar;

  const zitInRoute = (kaartPunt) =>
    routeStops.some((stop) => routeStopSleutel(stop) === routeStopSleutel(kaartPunt));

  const wisselRouteStop = (kaartPunt) => {
    setRouteData(null);
    setRouteLaadStatus('idle');
    setRouteStops((huidig) =>
      zitInRoute(kaartPunt)
        ? huidig.filter((stop) => routeStopSleutel(stop) !== routeStopSleutel(kaartPunt))
        : [...huidig, kaartPunt]
    );
  };

  const verwijderRouteStop = (kaartPunt) => {
    setRouteData(null);
    setRouteLaadStatus('idle');
    setRouteStops((huidig) => huidig.filter((stop) => routeStopSleutel(stop) !== routeStopSleutel(kaartPunt)));
  };

  const wisVolledigeRoute = () => {
    setRouteStops([]);
    setRouteData(null);
    setRouteLaadStatus('idle');
  };

  const herordenRouteStops = (vanIndex, naarIndex) => {
    setRouteData(null);
    setRouteLaadStatus('idle');
    setRouteStops((huidig) => {
      const bijgewerkt = [...huidig];
      const [verplaatst] = bijgewerkt.splice(vanIndex, 1);
      bijgewerkt.splice(naarIndex, 0, verplaatst);
      return bijgewerkt;
    });
  };

  const berekenRoute = async () => {
    if (routeStops.length < 2) return;
    setRouteLaadStatus('laden');
    const coordinaten = routeStops.map((stop) => `${stop.lengtegraad},${stop.breedtegraad}`).join(';');
    try {
      const resp = await fetch(`/api/route?coordinaten=${encodeURIComponent(coordinaten)}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      setRouteData(await resp.json());
      setRouteLaadStatus('klaar');
    } catch (e) {
      console.warn('Route berekenen mislukt:', e.message);
      setRouteData(null);
      setRouteLaadStatus('fout');
    }
  };

  // Bereken de route automatisch zodra er 2+ stops zijn — zo volgt de getoonde
  // lijn meteen de wegen (zoals bij Google Maps) in plaats van rechte verbindingslijnen.
  useEffect(() => {
    if (routeStops.length >= 2 && routeLaadStatus === 'idle') {
      berekenRoute();
    }
  }, [routeStops, routeLaadStatus]);

  useEffect(() => {
    let actief = true;

    fetch('/api/map-punten')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (!actief || !Array.isArray(data)) {
          return;
        }

        stelKaartPuntenLijstIn(filterGeldigeKaartpunten(data));
      })
      .catch((e) => {
        console.warn('Fout bij ophalen kaartpunten:', e.message);
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

    kaartPuntenLijst.forEach((kaart) => {
      const dagMatches = kaart.openDagenKunstroute2026?.match(/[A-Za-zÀ-ÿ]+dag/g) || [];
      dagMatches.forEach((dag) => uniekeOpeningsdagen.add(dag));

      const plaats = kaart.volledigAdres?.split(',').pop()?.trim();
      if (plaats) {
        uniekePlaatsen.add(plaats);
      }

      const kunstvorm = kaart.kunstvorm || kaart.discipline;
      if (kunstvorm) {
        uniekeKunstvormen.add(kunstvorm);
      }

      if (kaart.rolstoeltoegankelijkheid) {
        uniekeRolstoelNiveaus.add(kaart.rolstoeltoegankelijkheid);
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

      const kunstvorm = kaartPunt.kunstvorm || kaartPunt.discipline || null;
      const kunstvormFilter = geselecteerdeFilters.kunstvorm || [];
      const voldoetAanKunstvorm =
        kunstvormFilter.length === 0 ||
        !kunstvorm ||
        kunstvormFilter.includes(kunstvorm);

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

  // Verwijder route-stops die niet meer in de (ongefilterde) dataset voorkomen,
  // bijv. omdat een kunstenaarsaccount is verwijderd. Zoeken/filteren mag stops
  // nooit uit de route halen — anders verlies je je route zodra je verder zoekt.
  useEffect(() => {
    if (routeStops.length === 0) {
      return;
    }

    const bestaandeSleutels = new Set(kaartPuntenLijst.map((kaartPunt) => routeStopSleutel(kaartPunt)));
    const opgeschoond = routeStops.filter((stop) => bestaandeSleutels.has(routeStopSleutel(stop)));

    if (opgeschoond.length !== routeStops.length) {
      setRouteStops(opgeschoond);
      setRouteData(null);
      setRouteLaadStatus('idle');
    }
  }, [kaartPuntenLijst]);

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

  const routeStopCoordinaten = routeStops.map((stop) => [stop.breedtegraad, stop.lengtegraad]);

  // Kunstenaars die (binnen de huidige filters) nog niet in de route zitten —
  // alfabetisch, zodat ze ook handmatig via een dropdown toe te voegen zijn.
  const beschikbareKunstenaarsVoorRoute = [...gefilterdeKaartPunten]
    .filter((kaartPunt) => !zitInRoute(kaartPunt))
    .sort((a, b) => a.naamKunstenaar.localeCompare(b.naamKunstenaar, 'nl'));

  // Zodra er een route wordt opgebouwd, toon alleen de geselecteerde kunstenaars
  // op de kaart — dat houdt de kaart overzichtelijk en focust op de route zelf.
  const kaartMarkerPunten =
    routeStops.length > 0 ? gefilterdeKaartPunten.filter((kaartPunt) => zitInRoute(kaartPunt)) : gefilterdeKaartPunten;

  const coordinaatLijst = kaartMarkerPunten.map((p) => [p.breedtegraad, p.lengtegraad]);
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
          minZoom={KAART_MIN_ZOOM}
          {...(kaartBounds
            ? {
                bounds: kaartBounds,
                boundsOptions: { paddingTopLeft: [20, 90], paddingBottomRight: [20, 20], maxZoom: KAART_MAX_FIT_ZOOM },
                maxBounds: kaartBounds,
                maxBoundsViscosity: 1.0,
              }
            : { center: defaultCenter, zoom: 11 })}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {kaartMarkerPunten.map((kaartPunt) => {
            const fotoUrl = kaartPunt.fotoUrl || null;
            const isSelected = geselecteerdeLocatie?.detailPaginaUrl === kaartPunt.detailPaginaUrl;
            const inRoute = zitInRoute(kaartPunt);
            const markerIcon = maakProfielfotoMarker(fotoUrl, kaartPunt.naamKunstenaar, isSelected, inRoute);

            return (
              <Marker
                key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
                position={[kaartPunt.breedtegraad, kaartPunt.lengtegraad]}
                icon={markerIcon}
                eventHandlers={{ click: () => selecteerLocatie(kaartPunt) }}
              />
            );
          })}
              {routeStopCoordinaten.length >= 1 && (
                <Polyline
                  positions={routeData?.geometrie || routeStopCoordinaten}
                  pane="routeLijnPane"
                  pathOptions={{ color: '#1a73e8', weight: 5, opacity: 0.85 }}
                />
              )}
              {/* Map controller to fit the available points once */}
              <MapController bounds={kaartBounds} sidebarIngeklapt={sidebarIngeklapt} />
        </MapContainer>
      </div>

      <aside className="kaart-sidebar">
        {!planModusActief && (
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
        )}

        {planModusActief ? (
          <RoutePlanner
            routeStops={routeStops}
            routeData={routeData}
            routeLaadStatus={routeLaadStatus}
            opVerwijderStop={verwijderRouteStop}
            opHerorden={herordenRouteStops}
            opBerekenRoute={berekenRoute}
            beschikbareKunstenaars={beschikbareKunstenaarsVoorRoute}
            opToevoegenStop={wisselRouteStop}
          />
        ) : (
          <div className={`sidebar-content ${routeStops.length > 0 ? 'met-zwevende-balk' : ''}`}>
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
                    <div className="card-acties">
                      <Link to={`/artist/${kaartpuntLink}`} className="card-link">
                        Detailpagina →
                      </Link>
                      <button
                        type="button"
                        className={`route-stop-knop ${zitInRoute(kaartPunt) ? 'in-route' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          wisselRouteStop(kaartPunt);
                        }}
                      >
                        {zitInRoute(kaartPunt) ? '✓ In route' : '+ Aan route toevoegen'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="kaart-sidebar-empty">Geen kunstenaars gevonden met de geselecteerde filters.</p>
            )}
          </div>
        )}
        <div className="kaart-sidebar-note">ⓒ KunstRoute Noord-West Veluwe - {huidigJaar}</div>

        {(planModusActief || routeStops.length > 0) && (
          <div className="route-zwevende-balk">
            <button
              type="button"
              className={`route-toggle-knop-zwevend ${planModusActief ? 'actief' : ''}`}
              onClick={() => setPlanModusActief((waarde) => !waarde)}
            >
              {planModusActief ? '← Terug naar overzicht' : '🗺️ Route plannen'}
            </button>
            {routeStops.length > 0 && (
              <button
                type="button"
                className="route-wis-knop-zwevend"
                onClick={() => {
                  wisVolledigeRoute();
                  setPlanModusActief(false);
                }}
              >
                Selectie wissen
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}