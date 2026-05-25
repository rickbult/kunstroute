import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import KaartPunt from './LocationModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set — aborting');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {});
  console.log('Connected to MongoDB');

  const photosPath = path.resolve(new URL('../src/data/mapArtistPhotos.json', import.meta.url).pathname);
  let photos = {};
  try {
    const raw = await fs.readFile(photosPath, 'utf8');
    photos = JSON.parse(raw);
  } catch (e) {
    console.error('Could not read mapArtistPhotos.json:', e.message);
    process.exit(1);
  }

  const punten = await KaartPunt.find().lean();
  let updated = 0;
  for (const punt of punten) {
    const slug = (punt.detailPaginaUrl || punt.naamKunstenaar || '').toString().toLowerCase();
    for (const [key, url] of Object.entries(photos)) {
      if (!key) continue;
      if (slug.includes(key)) {
        if (!punt.fotoUrl || punt.fotoUrl !== url) {
          await KaartPunt.updateOne({ _id: punt._id }, { $set: { fotoUrl: url } });
          updated++;
        }
        break;
      }
    }
  }

  console.log(`Applied photos mapping, updated ${updated} KaartPunt documents`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(2); });
