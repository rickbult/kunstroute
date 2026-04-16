import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const locations = [
  { id: 1, name: 'Locatie A', position: [52.0907, 5.1214] },
  { id: 2, name: 'Locatie B', position: [52.0845, 5.1397] },
  { id: 3, name: 'Locatie C', position: [52.1000, 5.1100] },
];

export default function Map() {
  return (
  <MapContainer center={[52.0907, 5.1214]} zoom={13} style={{ height: '400px' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    {locations.map((location) => (
  <Marker key={location.id} position={location.position}>
    <Popup>{location.name}</Popup>
  </Marker>
))}
  </MapContainer>
);
}