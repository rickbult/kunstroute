import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KaartPunt from './LocationModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const mongoVerbindingUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/kunstroute';
const gegevensPad = path.resolve('../src/data/kunstroute_2026_marker_ready.json');
const artistPhotoPad = path.resolve('../src/data/mapArtistPhotos.json');

let artistPhotos = {};

try {
  artistPhotos = JSON.parse(fs.readFileSync(artistPhotoPad, 'utf8'));
} catch (fout) {
  console.warn('Lokale artist photo map niet geladen:', fout.message);
}

const maakSlug = (waarde) =>
  (waarde || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/https?:\/\/[^/]+\//, '')
    .replace(/\/+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function isGeldigKaartpunt(kaartpunt) {
  return Number.isFinite(kaartpunt.breedtegraad) && Number.isFinite(kaartpunt.lengtegraad);
}

async function voerSeedUit() {
  await mongoose.connect(mongoVerbindingUrl);

  const ruweJson = fs.readFileSync(gegevensPad, 'utf8');
  const bronRecords = JSON.parse(ruweJson).filter(isGeldigKaartpunt);
  const kaartPuntRecords = bronRecords.map((record) => ({
    ...record,
    fotoUrl: artistPhotos[maakSlug(record.naamKunstenaar)] ?? record.fotoUrl ?? null,
    geocodeWeergaveNaam: record.geocodeWeergaveNaam ?? record.geocodeDisplayName ?? null,
    geocodeZoekopdracht: record.geocodeZoekopdracht ?? record.geocodeQueryUsed ?? null,
  }));

  if (kaartPuntRecords.length === 0) {
    throw new Error('Geen geldige records gevonden met breedtegraad/lengtegraad.');
  }

  // Replace collection content so frontend gets only curated offline dataset.
  await KaartPunt.deleteMany({});
  await KaartPunt.insertMany(kaartPuntRecords, { ordered: false });

  console.log(`Seed voltooid: ${kaartPuntRecords.length} kaartpunten geimporteerd.`);
  await mongoose.disconnect();
}

voerSeedUit().catch(async (fout) => {
  console.error('Seed fout:', fout.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
