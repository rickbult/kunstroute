import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// Temporarily comment out missing Navbar/Footer until created
// import Navbar from "./navbar/navbar";
// import Footer from "./footer/footer";
import CardList from "./card";
import { ArtistDetail } from "./cardDetail";
import artistsData from "./artists.json";

function AppContent() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<CardList artists={artistsData} />} />
        <Route path="/kaart" element={<div>Kaart pagina</div>} />
        <Route path="/kunstwerken" element={<div>Kunstwerken pagina</div>} />
        <Route path="/kunstenaars" element={<div>Kunstenaars pagina</div>} />
        <Route path="/info-agenda" element={<div>Info & Agenda</div>} />
        <Route path="/inschrijven" element={<div>Inschrijfformulier</div>} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="*" element={<div>404: Pagina niet gevonden</div>} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
