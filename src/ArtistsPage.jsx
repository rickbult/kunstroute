import React, { useState } from 'react';
import './ArtistsPage.css';
import { cards } from './data';

export const ArtistsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtists = cards.filter(artist => {
    const q = searchQuery.toLowerCase();
    return (
      (artist.title && artist.title.toLowerCase().includes(q)) ||
      (artist.location && artist.location.toLowerCase().includes(q)) ||
      (artist.description && artist.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="artists-wrapper">
      <section className="artists-page">
        <div className="artists-page-header">
        <h1>Onze Kunstenaars</h1>
        <p>Maak kennis met de creatieve geesten achter de kunstwerken.</p>
        <div className="artists-search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Zoek een kunstenaar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="artists-search-input"
          />
        </div>
      </div>
      
      <div className="artists-page-grid">
        {filteredArtists.map((artist, index) => (
          <div key={index} className="artist-page-card">
            <div className="artist-card-top">
              <div className="artist-card-header-text">
                <h3>{artist.title}</h3>
                <div className="artist-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {artist.location}
                </div>
              </div>
            </div>
            <div className="artist-card-bottom">
              <p className="artist-description">{artist.description}</p>
              {artist.days && (
                <div className="artist-days-tag">
                  {artist.days}
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredArtists.length === 0 && (
          <p className="no-artists">Geen kunstenaars gevonden die aan je zoekopdracht voldoen.</p>
        )}
      </div>
      </section>
    </div>
  );
};
