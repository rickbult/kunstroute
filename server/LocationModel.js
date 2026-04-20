import mongoose from 'mongoose';

const kaartPuntSchema = new mongoose.Schema({
  naamKunstenaar: { type: String, required: true },
  volledigAdres: { type: String, required: true },
  googleMapsUrl: { type: String, required: true },
  openDagenKunstroute2026: { type: String, required: true },
  rolstoeltoegankelijkheid: { type: String, required: true },
  detailPaginaUrl: { type: String, required: true, unique: true },
  stad: { type: String, default: null },
  titelWerk: { type: String, default: null },
  breedtegraad: { type: Number, required: true },
  lengtegraad: { type: Number, required: true },
  geocodeWeergaveNaam: { type: String, default: null },
  geocodeZoekopdracht: { type: String, default: null }
});

const KaartPunt = mongoose.model('KaartPunt', kaartPuntSchema);

export default KaartPunt;