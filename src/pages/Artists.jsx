import { useState, useEffect, useMemo } from "react";
import { FilterBalk } from "../components/filter.jsx";
import "./Artists.css";

export default function Artists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [geselecteerdeFilters, setGeselecteerdeFilters] = useState({});

  useEffect(() => {
    let actief = true;
    fetch('/api/artists')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (actief && Array.isArray(data)) setArtists(data);
      })
      .catch((e) => console.warn('Kon /api/artists niet laden:', e.message));
    return () => { actief = false; };
  }, []);

  const filterOpties = useMemo(() => ({
    plaatsen:        [...new Set(artists.map(a => a.location).filter(Boolean))].sort(),
    kunstvormen:     [...new Set(artists.map(a => a.discipline).filter(Boolean))].sort(),
    rolstoelNiveaus: ['Ja', 'Gedeeltelijk', 'Nee'],
    openingsdagen:   ['Zaterdag', 'Zondag'],
  }), [artists]);

  const gefilterd = useMemo(() => {
    let lijst = artists;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      lijst = lijst.filter(a =>
        (a.title       && a.title.toLowerCase().includes(q)) ||
        (a.location    && a.location.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.discipline  && a.discipline.toLowerCase().includes(q))
      );
    }

    const dagen = geselecteerdeFilters.openingsdagen || [];
    if (dagen.length > 0) {
      lijst = lijst.filter(a =>
        (dagen.includes('Zaterdag') ? a.openZaterdag : true) &&
        (dagen.includes('Zondag')   ? a.openZondag   : true)
      );
    }

    const rolstoel = geselecteerdeFilters.rolstoelToegang || [];
    if (rolstoel.length > 0) {
      lijst = lijst.filter(a => rolstoel.includes(a.rolstoeltoegankelijk));
    }

    const vormen = geselecteerdeFilters.kunstvorm || [];
    if (vormen.length > 0) {
      lijst = lijst.filter(a => vormen.includes(a.discipline));
    }

    const plaatsen = geselecteerdeFilters.plaats || [];
    if (plaatsen.length > 0) {
      lijst = lijst.filter(a => plaatsen.includes(a.location));
    }

    const sortering = geselecteerdeFilters.sortering?.[0];
    if (sortering === 'A-Z') lijst = [...lijst].sort((a, b) => a.title.localeCompare(b.title));
    if (sortering === 'Z-A') lijst = [...lijst].sort((a, b) => b.title.localeCompare(a.title));

    return lijst;
  }, [artists, searchQuery, geselecteerdeFilters]);

  return (
    <div className="artists-wrapper">
      <section className="artists-page">
        <div className="artists-page-header">
          <h1>Onze Kunstenaars</h1>
          <p>Maak kennis met de creatieve geesten achter de kunstwerken.</p>
        </div>

        <div className="filter-widget">
          <div className="zoekfilter-balk">
            <div className="zoekbalk">
              <input
                type="text"
                placeholder="Zoek een kunstenaar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <FilterBalk
              bijFilterWijziging={setGeselecteerdeFilters}
              geselecteerdeFilters={geselecteerdeFilters}
              filterOpties={filterOpties}
            />
          </div>
        </div>

        <div className="artists-page-grid">
          {gefilterd.map((artist) => (
            <div key={artist.link || artist.title} className="artist-page-card" onClick={() => navigate(`/kunstenaars/${artist.link}`)}>
              <div className="artist-card-top">
                {artist.imgSrc && <img src={artist.imgSrc} alt={artist.imgAlt || artist.title} />}
                <div className="artist-card-overlay" />
                <div className="artist-card-header-text">
                  <h3>{artist.title}</h3>
                  {artist.location && (
                    <div className="artist-location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {artist.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="artist-card-bottom">
                {artist.discipline && <span className="artist-discipline">{artist.discipline}</span>}
                {artist.description && <p className="artist-description">{artist.description}</p>}
                <div className="artist-card-footer">
                  {(artist.openZaterdag || artist.openZondag) && (
                    <span className="artist-days-tag">
                      {[artist.openZaterdag && 'Za', artist.openZondag && 'Zo'].filter(Boolean).join(' & ')}
                    </span>
                  )}
                  {artist.rolstoeltoegankelijk === 'Ja' && (
                    <span className="artist-rolstoel-tag">♿ Toegankelijk</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {gefilterd.length === 0 && (
            <p className="no-artists">Geen kunstenaars gevonden die aan je zoekopdracht voldoen.</p>
          )}
        </div>
      </section>
    </div>
  );
}
