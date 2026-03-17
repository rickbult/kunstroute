import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../Index.css";
import "./App.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CardList from "./CardList";
import ArtistDetail from "../ArtistDetail/ArtistDetail";
import artists from "./pages.json";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CardList artists={artists} />} />
        <Route path="/artist/:id" element={<ArtistDetail artists={artists} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
