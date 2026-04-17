import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KaartPunt from './LocationModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const mongoVerbindingUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/kunstroute';
const gegevensPad = path.resolve('../src/data/kunstroute_2026_marker_ready.json');

function isGeldigKaartpunt(kaartpunt) {
  return Number.isFinite(kaartpunt.breedtegraad) && Number.isFinite(kaartpunt.lengtegraad);
}

async function voerSeedUit() {
  await mongoose.connect(mongoVerbindingUrl);

  const ruweJson = fs.readFileSync(gegevensPad, 'utf8');
  const bronRecords = JSON.parse(ruweJson).filter(isGeldigKaartpunt);
  const kaartPuntRecords = bronRecords.map((record) => ({
    ...record,
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
