import { Routes, Route } from "react-router-dom";
import "./App.css";
import artistsData from "./data/artists.json";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Artists from "./pages/Artists.jsx";
import Artwork from "./pages/Artwork.jsx";
import Map from "./pages/Map.jsx";
import { ArtistDetail } from "./components/ArtistDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Info from "./pages/Info.jsx";
import Agenda from "./pages/Agenda.jsx";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Artists />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artwork" element={<Artwork />} />
        <Route path="/kaart" element={<Map />} />
        <Route path="/map" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/info" element={<Info />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route
          path="/artist/:id"
          element={<ArtistDetail artists={artistsData} />}
        />
        <Route path="*" element={<Artists />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;