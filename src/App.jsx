import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Artists from "./pages/Artists.jsx";
import Artwork from "./pages/Artwork.jsx";
import Login from "./pages/Login.jsx";
import Map from "./pages/Map.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import { ArtistDetail } from "./components/ArtistDetail.jsx";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Artists />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artwork" element={<Artwork />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<Map />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="*" element={<Artists />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;