import Navbar from "./Navbar"
import Home from "./pages/Home"
import Kaart from "./pages/Kaart"
import Kunstwerken from "./pages/Kunstwerken"
import Kunstenaars from "./pages/Kunstenaars"
import InfoAgenda from "./pages/Info & Agenda"
import Inschrijven from "./pages/Inschrijven"

function App() {
  let compenent
  switch (window.location.pathname) {
    case "/":
      compenent = <Home />
      break;
    case "/kaart":
      compenent = <Kaart />
      break;
    case "/kunstwerken":
      compenent = <Kunstwerken />
      break;
    case "/kunstenaars":
      compenent = <Kunstenaars />
      break;
    case "/info-agenda":
      compenent = <InfoAgenda />
      break;
    case "/inschrijven":
      compenent = <Inschrijven />
      break;
    
  }
  return (
<>
   <Navbar />
   <div classname="container">{compenent}</div>
   </>
  ) 
} 

export default App