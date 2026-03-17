import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import "../Index.css";
import "./App.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CardList from "./CardList";
import ArtistDetail from "../ArtistDetail/ArtistDetail";
import artistsData from "./pages.json"; 

function ArtistDetailWrapper({ artists }) {
  const { id } = useParams();
  const artist = artists.find(a => a.id === id);
  return <ArtistDetail artist={artist} artists={artists} />;
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CardList artists={artistsData} />} />
        <Route path="/artist/:id" element={<ArtistDetailWrapper artists={artistsData} />} />
        <Route path="*" element={<div>404: Pagina niet gevonden</div>} />
      </Routes>
      <Footer />
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
