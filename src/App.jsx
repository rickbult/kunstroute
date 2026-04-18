import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import artistsData from "./data/artists.json";
import "./App.css";
import { Card } from "./components/Card.jsx"; 
import { ArtistDetail } from "./components/ArtistDetail.jsx";
import Navbar from "./components/Navbar.jsx";  
import Footer from "./components/Footer.jsx";
import Signup from './pages/Signup';
import Login from './pages/Login';
import KaartComponent from './pages/Map.jsx';

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

function AppInhoud({ cards }) {
  const location = useLocation();
  const opKaartPagina = location.pathname === "/kaart";

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CardList cards={cards} />} />
        <Route path="/inschrijven" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kaart" element={<KaartComponent />} />
        <Route path="/kunstwerken" element={<div>🎨 Kunstwerken</div>} />
        <Route path="/kunstenaars" element={<CardList cards={cards} />} />
        <Route path="/info-agenda" element={<div>📅 Info & Agenda</div>} />
        <Route path="/artist/:id" element={<ArtistDetail artists={cards} />} />
        <Route path="*" element={<div>Pagina niet gevonden</div>} />
      </Routes>

      {!opKaartPagina && <Footer />}
    </>
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
      <AppInhoud cards={cards} />
    </BrowserRouter>
  );
}

export default App;