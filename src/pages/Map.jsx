import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

// Leaflet-object gebruiken we hier om de standaard marker-iconen te overschrijven.
import L from 'leaflet';
import markerIcoon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcoon from 'leaflet/dist/images/marker-icon.png';
import markerSchaduw from 'leaflet/dist/images/marker-shadow.png';
import './Map.css';

// Laat Leaflet de marker-afbeeldingen gebruiken die door Vite worden meegebundeld.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcoon2x,
  iconUrl: markerIcoon,
  shadowUrl: markerSchaduw,
});

export default function KaartComponent() {
  // State waarin alle geldige kaartpunten uit de API worden opgeslagen.
  const [kaartPuntenLijst, stelKaartPuntenLijstIn] = useState([]);

  // Haal kaartpunten eenmalig op zodra dit component in beeld komt.
  useEffect(() => {
    fetch('http://localhost:5000/api/kaartpunten')
      .then((antwoord) => antwoord.json())
      .then((opgehaaldePunten) => {
        // Bewaar alleen punten met echte numerieke breedte- en lengtegraad.
        const geldigePunten = opgehaaldePunten.filter(
          (kaartPunt) =>
            Number.isFinite(kaartPunt.breedtegraad) && Number.isFinite(kaartPunt.lengtegraad)
        );
        stelKaartPuntenLijstIn(geldigePunten);
      })
      .catch((fout) => {
        console.error('Fout bij ophalen kaartpunten:', fout);
      });
  }, []);

  // Zet elk punt om naar [lat, lng]-paren voor de bounds-berekening.
  const coordinaatLijst = kaartPuntenLijst.map((p) => [p.breedtegraad, p.lengtegraad]);

  // Bounds is het buitenste kader dat alle markers moet bevatten.
  let kaartBounds = null;

  if (coordinaatLijst.length > 0) {
    // Splits breedte- en lengtegraad zodat we minimum en maximum kunnen bepalen.
    const latitudes = coordinaatLijst.map((c) => c[0]);
    const longitudes = coordinaatLijst.map((c) => c[1]);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Leaflet-bounds formaat: [[zuidwestLat, zuidwestLng], [noordoostLat, noordoostLng]].
    kaartBounds = [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }

  // Toon simpele laadttekst totdat we weten waarop de kaart moet focussen.
  if (!kaartBounds) {
    return <div>Kaart laden...</div>;
  }

  return (
    // MapContainer rendert het interactieve kaartvlak.
    <MapContainer
      className="kaart-canvas"
      // Schakel slepen uit zodat bezoekers de kaart niet kunnen verplaatsen.
      dragging={false}
      // Verberg de + en - zoomknoppen in de hoek.
      zoomControl={false}
      // Sta niet toe dat bezoekers verder uitzoomen dan dit niveau.
      minZoom={15}
      // Pas het kaartbeeld automatisch aan zodat alle markers zichtbaar zijn.
      bounds={kaartBounds}
      // Voeg extra bovenruimte toe zodat markers onder de vaste navbar blijven.
      boundsOptions={{ paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] }}
    >
      {/* TileLayer tekent de OpenStreetMap-achtergrondtegels. */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Render voor elk punt in de lijst precies één Marker. */}
      {kaartPuntenLijst.map((kaartPunt) => (
        <Marker
          // Fallback-key gebruikt de artiestnaam als detail-URL ontbreekt.
          key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
          position={[kaartPunt.breedtegraad, kaartPunt.lengtegraad]}
        >
          {/* Popup toont detailinfo zodra je op deze marker klikt. */}
          <Popup>
            <div className="kaart-popup">
              <strong>{kaartPunt.naamKunstenaar}</strong>
              <br />
              <a href={kaartPunt.googleMapsUrl} target="_blank" rel="noreferrer">
                {kaartPunt.volledigAdres}
              </a>
              <br />
              Open: {kaartPunt.openDagenKunstroute2026}
              <br />
              Rolstoeltoegankelijkheid: {kaartPunt.rolstoeltoegankelijkheid}
              <br />
              <a href={kaartPunt.detailPaginaUrl} target="_blank" rel="noreferrer">
                Detailpagina
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}