import { Routes, Route } from "react-router-dom"
import Navbar from "./Navbar"
import Home from "./pages/Home"
import Kaart from "./pages/Kaart"
import Kunstwerken from "./pages/Kunstwerken"
import Kunstenaars from "./pages/Kunstenaars"
import InfoAgenda from "./pages/InfoAgenda"
import Inschrijven from "./pages/Inschrijven"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kaart" element={<Kaart />} />
        <Route path="/kunstwerken" element={<Kunstwerken />} />
        <Route path="/kunstenaars" element={<Kunstenaars />} />
        <Route path="/info-agenda" element={<InfoAgenda />} />
        <Route path="/inschrijven" element={<Inschrijven />} />
      </Routes>
    </>
  )
}

export default App
