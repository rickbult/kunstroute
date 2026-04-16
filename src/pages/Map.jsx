import { MapContainer, TileLayer } from 'react-leaflet';

export default function InfoAgenda() {
  return (
  <MapContainer center={[52.0907, 5.1214]} zoom={13} style={{ height: '400px' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
  </MapContainer>
);
}