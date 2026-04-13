import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Artists from "./pages/Artists.jsx";
import Artwork from "./pages/Artwork.jsx";
import Signup from "./pages/Signup.jsx";
import Map from "./pages/Map.jsx";
import { ArtistDetail } from "./components/ArtistDetail.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Artists />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artwork" element={<Artwork />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<Map />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;