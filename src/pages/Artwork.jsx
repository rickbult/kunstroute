import React, { useState, useEffect } from 'react';
import './Artwork.css';

export const KunstwerkenPage = () => {
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
          <div key={artist.link || artist.title} className="kunstwerk-card">
            <div className="kunstwerk-image-wrapper">
              <img src={artist.imgSrc} alt={artist.imgAlt || artist.title} />
            </div>
            <div className="kunstwerk-info">
              {artist.discipline && <span className="kunstwerk-category">{artist.discipline.toUpperCase()}</span>}
              <h3>{artist.title}</h3>
              {artist.description && <p className="kunstwerk-artist">{artist.description}</p>}
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
