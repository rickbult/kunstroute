import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import KaartPunt from './LocationModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in server/.env — aborting');
    process.exit(1);
  }

  const mapPath = path.resolve(new URL('./kaartpunt-discipline-mapping.json', import.meta.url).pathname);
  let mapping = {};
  try {
    const raw = await fs.readFile(mapPath, 'utf8');
    mapping = JSON.parse(raw);
  } catch (e) {
    console.error(`Mapping file not found or invalid: ${mapPath}`);
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {});
  console.log('Connected to MongoDB');

  let updated = 0;
  for (const [slug, discipline] of Object.entries(mapping)) {
    const res = await KaartPunt.updateMany({
      $or: [
        { detailPaginaUrl: { $regex: slug, $options: 'i' } },
        { naamKunstenaar: { $regex: slug.replace(/-/g, ' '), $options: 'i' } }
      ]
    }, { $set: { kunstvorm: discipline } });
    if (res.modifiedCount) updated += res.modifiedCount;
  }

  console.log(`Applied mapping — total updated documents: ${updated}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Apply mapping failed:', err);
  process.exit(2);
});
