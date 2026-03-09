import "./App.css";
import { Card } from "./components/Card";

function App() {
  return (
    <div className="page-wrapper">
      <div className="search-bar">
        <input type="text" placeholder=" Zoek een kunstenaar..." />
      </div>
      <div className="App">
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      </div>
    </div>
  );
}

export default App;
