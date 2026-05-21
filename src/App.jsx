import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { InschrijvenPage } from "./InschrijvenPage";
import { InfoPage } from "./InfoPage";
import { AgendaPage } from "./Agenda";
import { Navbar } from "./Navbar";
import { HomePage } from "./HomePage";
import { KunstwerkenPage } from "./KunstwerkenPage";
import { ArtistsPage } from "./ArtistsPage";
import { cards } from "./data";





function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kunstenaars" element={<ArtistsPage />} />
        <Route path="/kunstwerken" element={<KunstwerkenPage />} />
        <Route path="/kaart" element={<HomePage />} />
        <Route path="/inschrijven" element={<InschrijvenPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
