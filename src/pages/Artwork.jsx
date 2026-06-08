import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fotoMetFallback, placeholderFoto } from '../utils/images';
import './Artwork.css';

export const KunstwerkenPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);

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

  const filteredArtworks = artists.filter((artist) => {
    if (!artist.kunstFoto) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (artist.title && artist.title.toLowerCase().includes(q)) ||
      (artist.discipline && artist.discipline.toLowerCase().includes(q)) ||
      (artist.description && artist.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="kunstwerken-wrapper">
      <div className="kunstwerken-page">
        <div className="kunstwerken-header">
        <h1>Kunstwerken</h1>
        <p>Ontdek de prachtige kunstwerken van onze deelnemende kunstenaars.</p>
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Zoek op kunstenaar, discipline of beschrijving..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kunstwerken-search-input"
          />
        </div>
      </div>
      
      <div className="kunstwerken-grid">
        {filteredArtworks.map((artist) => (
          <div key={artist.link || artist.title} className="kunstwerk-card" onClick={() => navigate(`/kunstenaars/${artist.link}`)}>
            <div className="kunstwerk-image-wrapper">
              <img
                src={fotoMetFallback(artist.kunstFoto, artist.title)}
                alt={`Kunstwerk van ${artist.title}`}
                onError={(e) => {
                  const fallback = placeholderFoto(artist.title);
                  if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                }}
              />
            </div>
            <div className="kunstwerk-info">
              {artist.discipline && <span className="kunstwerk-category">{artist.discipline}</span>}
              <h3>{artist.title}</h3>
              {artist.location && (
                <span className="kunstwerk-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {artist.location}
                </span>
              )}
              {artist.description && <p className="kunstwerk-artist">{artist.description}</p>}
              {(artist.openZaterdag || artist.openZondag) && (
                <div className="kunstwerk-tags">
                  {artist.openZaterdag && <span className="kunstwerk-dag-tag">Zaterdag</span>}
                  {artist.openZondag && <span className="kunstwerk-dag-tag">Zondag</span>}
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredArtworks.length === 0 && (
          <p className="no-artworks">Geen kunstwerken gevonden die aan je zoekopdracht voldoen.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default KunstwerkenPage;
