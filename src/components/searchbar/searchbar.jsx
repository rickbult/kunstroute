import React, { useState } from 'react';
import SearchBar from '../Searchbar/Searchbar'; 

export default function CardList({ artists }) {
  const [search, setSearch] = useState('');

  const filteredCards = artists.filter((artist) =>
    artist.title?.toLowerCase().includes(search.toLowerCase()) ||
    artist.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cardlist-container">
      <SearchBar onSearch={setSearch} placeholder="Zoek kunstenaar of locatie..." />
      <div className="cards-grid">
        {filteredCards.map((artist) => (
          <Card 
            key={artist.id} 
            {...artist} 
            link={artist.id} 
          />
        ))}
      </div>
    </div>
  );
}
