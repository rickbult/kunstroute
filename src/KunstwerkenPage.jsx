import React, { useState } from 'react';
import './KunstwerkenPage.css';
import { cards } from './data';

export const KunstwerkenPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Verzamel alle kunstwerken van alle kunstenaars
  const allArtworks = cards.flatMap(artist => 
    (artist.artworks || []).map(artwork => ({
      ...artwork,
      artistName: artist.title // We gebruiken hier de titel/naam van de kunstenaar
    }))
  );

  const filteredArtworks = allArtworks.filter(artwork => {
    const q = searchQuery.toLowerCase();
    return (
      (artwork.name && artwork.name.toLowerCase().includes(q)) ||
      (artwork.artistName && artwork.artistName.toLowerCase().includes(q)) ||
      (artwork.bio && artwork.bio.toLowerCase().includes(q))
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
            placeholder="Zoek op titel, categorie of kunstenaar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kunstwerken-search-input"
          />
        </div>
      </div>
      
      <div className="kunstwerken-grid">
        {filteredArtworks.map((artwork, index) => (
          <div key={index} className="kunstwerk-card">
            <div className="kunstwerk-image-wrapper">
              <img src={artwork.imgSrc} alt={artwork.name} />
            </div>
            <div className="kunstwerk-info">
              {artwork.bio && <span className="kunstwerk-category">{artwork.bio.toUpperCase()}</span>}
              <h3>{artwork.name}</h3>
              <p className="kunstwerk-artist">door {artwork.artistName}</p>
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
