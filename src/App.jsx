import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import artistsData from "./data/artists.json";
import "./App.css";
import { Card } from "./components/Card.jsx"; 
import { ArtistDetail } from "./components/ArtistDetail.jsx";

function CardList({ cards }) {
  const [search, setSearch] = useState("");

  const filteredCards = cards.filter((card) =>
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
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Card key={card.link} {...card} />
          ))
        ) : (
          <p>Geen kunstenaars gevonden.</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCards(artistsData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardList cards={cards} />} />
        <Route path="/artist/:id" element={<ArtistDetail artists={cards} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;