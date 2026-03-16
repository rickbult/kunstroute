import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Card } from "./components/Card";
import { ArtistDetail } from "./components/ArtistDetail";

const cards = [
  {
    imgSrc: "https://picsum.photos/id/201/300/200", imgAlt: "Card Image 1",
    title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)",
    link: "card1", location: "Locatie", days: "Za & Zo aanwezig",
    address: "Adres", postcode: "Postcode",
    phone: "Telefoonnummer", email: "Email",
    artworks: [
      { imgSrc: "https://picsum.photos/id/301/300/200", name: "Naam Kunstwerk", year: "2023", bio: "Korte Bio" },
      { imgSrc: "https://picsum.photos/id/302/300/200", name: "Naam Kunstwerk", year: "2022", bio: "Korte Bio" },
      { imgSrc: "https://picsum.photos/id/303/300/200", name: "Naam Kunstwerk", year: "2021", bio: "Korte Bio" },
      { imgSrc: "https://picsum.photos/id/304/300/200", name: "Naam Kunstwerk", year: "2020", bio: "Korte Bio" },
    ],
  },
  {
    imgSrc: "https://picsum.photos/id/202/300/200", imgAlt: "Card Image 2",
    title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)",
    link: "card2", location: "Loactie", days: "Zo aanwezig",
    address: "Adress", postcode: "Postcode",
    phone: "Telefoonnummer", email: "Email",
    artworks: [
      { imgSrc: "https://picsum.photos/id/305/300/200", name: "Naam Kunstwerk", year: "2023", bio: "Korte Bio" },
      { imgSrc: "https://picsum.photos/id/306/300/200", name: "Naam Kunstwerk", year: "2022", bio: "Korte Bio" },
    ],
  },
  { imgSrc: "https://picsum.photos/id/193/300/200", imgAlt: "Card Image 3", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card3", location: "Adres", days: "Za aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/211/300/200", imgAlt: "Card Image 4", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card4", location: "Adres", days: "Za & Zo aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/250/300/200", imgAlt: "Card Image 5", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card5", location: "Adres", days: "Zo aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/203/300/200", imgAlt: "Card Image 6", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card6", location: "Adres", days: "Za aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/106/300/200", imgAlt: "Card Image 7", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card7", location: "Adres", days: "Za & Zo aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/190/300/200", imgAlt: "Card Image 8", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card8", location: "Adres", days: "Zo aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/191/300/200", imgAlt: "Card Image 9", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card9", location: "Adres", days: "Za aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
  { imgSrc: "https://picsum.photos/id/192/300/200", imgAlt: "Card Image 10", title: "kaart titel", description: "Biografie van de kunstenaar zelf (deze vult degene uit eindelijk zelf in)", link: "card10", location: "Adres", days: "Za & Zo aanwezig", address: "Straat", postcode: "Postcode", phone: "Telefoonnummer", email: "Email", artworks: [] },
];

function CardList({ cards }) {
  const [search, setSearch] = useState("");

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Onze Kunstenaars</h1>
        <p>Maak kennis met de creatieve geesten achter de kunstwerken.</p>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Zoek een kunstenaar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="card-grid">
        {filteredCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardList cards={cards} />} />
        <Route path="/artist/:id" element={<ArtistDetail artists={cards} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
