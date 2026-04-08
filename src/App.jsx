import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Card } from "./components/Card";
import { ArtistDetail } from "./components/ArtistDetail";
import { InschrijvenPage } from "./components/InschrijvenPage";
import { Navbar } from "./components/Navbar";
import { cards } from "./data";

function CardList({ cards }) {
  const [search, setSearch] = useState("");

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
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
        {filteredCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CardList cards={cards} />} />
        <Route path="/artist/:id" element={<ArtistDetail artists={cards} />} />
        <Route path="/inschrijven" element={<InschrijvenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
