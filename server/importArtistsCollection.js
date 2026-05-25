import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import Artist from './ArtistModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in server/.env — aborting import');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {});
  console.log('Connected to MongoDB');

  const artistsPath = path.resolve(new URL('../src/data/artists.json', import.meta.url).pathname);
  let artists = [];
  try {
    const raw = await fs.readFile(artistsPath, 'utf8');
    artists = JSON.parse(raw);
  } catch (e) {
    console.error('Could not read artists.json:', e.message);
    process.exit(1);
  }

  let upserted = 0;
  for (const a of artists) {
    const link = a.link || a.title;
    const doc = {
      title: a.title || '',
      link,
      description: a.description || '',
      address: a.address || '',
      wheelchairaccessibility: a.wheelchairaccessibility || '',
      days: a.days || '',
      phone: a.phone || '',
      email: a.email || '',
      website: a.website || '',
      imgSrc: a.imgSrc || '',
      imgAlt: a.imgAlt || '',
      discipline: a.discipline || ''
    };

    await Artist.updateOne({ link }, { $set: doc }, { upsert: true });
    upserted++;
  }

  console.log(`Imported/updated ${upserted} artists into Artists collection`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error('Import failed:', e);
  process.exit(2);
});
