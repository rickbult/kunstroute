import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import Artists from "./pages/Artists.jsx";
import Artwork from "./pages/Artwork.jsx";
import Map from "./pages/Map.jsx";
import { ArtistDetail } from "./components/ArtistDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Info from "./pages/Info.jsx";
import { AgendaPage } from "./pages/Agenda.jsx";
import NotFoundPage from "./pages/404.jsx";


function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/kunstenaars" element={<Artists />} />
          <Route path="/artwork" element={<Artwork />} />
          <Route path="/kunstwerken" element={<Artwork />} />
          <Route path="/kaart" element={<Map />} />
          <Route path="/map" element={<Map />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/info" element={<Info />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/artist/:id" element={<ArtistDetail />} />
          <Route path="/kunstenaars/:id" element={<ArtistDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}