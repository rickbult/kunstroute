import { useState } from "react";
import artistsData from "../data/artists.json";
import { Card } from "../components/Card.jsx";

function Artists() {
  const [search, setSearch] = useState("");

  const filteredCards = artistsData.filter((card) =>
    card.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Onze Kunstenaars</h1>
        <p>Maak kennis met de creatieve geesten achter de kunstwerken.</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Zoek een kunstenaar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card-grid">
        {filteredCards.map((card) => (
          <Card key={card.link} {...card} />
        ))}
      </div>
    </div>
  );
}

export default Artists;