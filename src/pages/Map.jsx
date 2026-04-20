import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

import L from 'leaflet';
import markerIcoon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcoon from 'leaflet/dist/images/marker-icon.png';
import markerSchaduw from 'leaflet/dist/images/marker-shadow.png';
import './Map.css';

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

  const coordinaatLijst = kaartPuntenLijst.map((p) => [p.breedtegraad, p.lengtegraad]);

  let kaartBounds = null;

  if (coordinaatLijst.length > 0) {
    const latitudes = coordinaatLijst.map((c) => c[0]);
    const longitudes = coordinaatLijst.map((c) => c[1]);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    kaartBounds = [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }

  if (!kaartBounds) {
    return <div>Kaart laden...</div>;
  }

  return (
    <MapContainer
      className="kaart-canvas"
      dragging={false}
      zoomControl={false}
      minZoom={10}
      bounds={kaartBounds}
      boundsOptions={{ paddingTopLeft: [20, 90], paddingBottomRight: [20, 20] }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {kaartPuntenLijst.map((kaartPunt) => (
        <Marker
          key={kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar}
          position={[kaartPunt.breedtegraad, kaartPunt.lengtegraad]}
        >
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