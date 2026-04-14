import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Artists from "./pages/Artists.jsx";
import Artwork from "./pages/Artwork.jsx";
import Map from "./pages/Map.jsx";
import ArtistDetail from "./components/ArtistDetail.jsx";
import InfoAgenda from "./pages/Info-agenda.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Artists />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artwork" element={<Artwork />} />
        <Route path="/map" element={<Map />} />
        <Route path="/info-agenda" element={<InfoAgenda />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="*" element={<Artists />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;