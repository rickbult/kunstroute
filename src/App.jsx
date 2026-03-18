import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import artistsData from "./data/artists.json";
import "./App.css";
import { Card } from "./components/Card.jsx"; 
import { ArtistDetail } from "./components/ArtistDetail.jsx";
import { FilterBalk } from "./components/filter.jsx";
import Navbar from "./components/Navbar.jsx";  
import Footer from "./components/Footer.jsx";

function KaartenLijst({ kaarten }) {
  const [zoekterm, setZoekterm] = useState("");
  const [geselecteerdeFilters, setGeselecteerdeFilters] = useState({});

  let gefilterdeKaarten = kaarten.filter((kaart) => {
    const voldoetAanZoekterm = kaart.title?.toLowerCase().includes(zoekterm.toLowerCase());

    const rolstoelFilter = geselecteerdeFilters.rolstoelToegang || [];
    const voldoetAanRolstoel =
      rolstoelFilter.length === 0 ||
      rolstoelFilter.includes(kaart.wheelchairaccessibility);

    const plaatsFilter = geselecteerdeFilters.plaats || [];
    const voldoetAanPlaats =
      plaatsFilter.length === 0 ||
      plaatsFilter.some((plaats) => kaart.address?.includes(plaats));

    const kunstvormFilter = geselecteerdeFilters.kunstvorm || [];
    const voldoetAanKunstvorm =
      kunstvormFilter.length === 0 ||
      kunstvormFilter.includes(kaart.discipline);

    const dagenFilter = geselecteerdeFilters.openingsdagen || [];
    const voldoetAanDagen =
      dagenFilter.length === 0 ||
      dagenFilter.some((dag) => kaart.days?.includes(dag));

    return (
      voldoetAanZoekterm &&
      voldoetAanRolstoel &&
      voldoetAanPlaats &&
      voldoetAanKunstvorm &&
      voldoetAanDagen
    );
  });

  const sorteervolgorde = geselecteerdeFilters.sortering?.[0];
  if (sorteervolgorde === "A-Z") {
    gefilterdeKaarten = [...gefilterdeKaarten].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sorteervolgorde === "Z-A") {
    gefilterdeKaarten = [...gefilterdeKaarten].sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Onze Kunstenaars</h1>
        <p>Maak kennis met de creatieve geesten achter de kunstwerken.</p>
      </div>
      <div className="zoekfilter-balk">
        <div className="zoekbalk">
          <input
            type="text"
            placeholder="Zoek een kunstenaar..."
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
          />
        </div>
        <FilterBalk
          geselecteerdeFilters={geselecteerdeFilters}
          bijFilterWijziging={setGeselecteerdeFilters}
        />
      </div>

      <div className="card-grid">
        {gefilterdeKaarten.length > 0 ? (
          gefilterdeKaarten.map((kaart) => (
            <Card key={kaart.link} {...kaart} />
          ))
        ) : (
          <p>Geen kunstenaars gevonden met de geselecteerde filters.</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [kaarten, setKaarten] = useState([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    setKaarten(artistsData);
    setLaden(false);
  }, []);

  if (laden) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />        
      <Routes>
        <Route path="/" element={<KaartenLijst kaarten={kaarten} />} />
        <Route path="/artist/:id" element={<ArtistDetail artists={kaarten} />} />
      </Routes>
      <Footer />        
    </BrowserRouter>
  );
}

export default App;