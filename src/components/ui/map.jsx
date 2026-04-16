import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map() {
  return (
  <MapContainer center={[52.0907, 5.1214]} zoom={13} style={{ height: '400px' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    <Marker position={[52.0907, 5.1214]}>
      <Popup>
        Dit is mijn eerste marker!
      </Popup>
    </Marker>
  </MapContainer>
);
}