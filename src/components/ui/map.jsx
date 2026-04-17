import { useEffect, useState } from 'react';
import {
  MapContainer as KaartContainer,
  TileLayer as TegelLaag,
  Marker as MarkerPunt,
  Popup as InformatieVenster,
} from 'react-leaflet';
import L from 'leaflet';
import markerIcoon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcoon from 'leaflet/dist/images/marker-icon.png';
import markerSchaduw from 'leaflet/dist/images/marker-shadow.png';
import './map.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcoon2x,
  iconUrl: markerIcoon,
  shadowUrl: markerSchaduw,
});

export default function KaartComponent() {
  const [kaartPuntenLijst, stelKaartPuntenLijstIn] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/kaartpunten')
      .then((antwoord) => antwoord.json())
      .then((opgehaaldePunten) => {
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

  return (
  <KaartContainer className="kaart-canvas" center={[52.2518, 5.6928]} zoom={11} style={{ height: '400px' }}>
    <TegelLaag
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    {kaartPuntenLijst.map((kaartPunt) => (
  <MarkerPunt key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar} position={[kaartPunt.breedtegraad, kaartPunt.lengtegraad]}>
    <InformatieVenster>
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
    </InformatieVenster>
  </MarkerPunt>
))}
  </KaartContainer>
);
}