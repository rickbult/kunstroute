import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import KaartPunt from './LocationModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const maakSlug = (waarde) =>
  (waarde || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/https?:\/\/[^/]+\//, '')
    .replace(/\/+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in server/.env — aborting export');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {});
  console.log('Connected to MongoDB');

  const punten = await KaartPunt.find().lean();
  const exportData = punten.map((p) => ({
    id: p._id.toString(),
    naamKunstenaar: p.naamKunstenaar,
    detailPaginaUrl: p.detailPaginaUrl || null,
    slug: maakSlug(p.detailPaginaUrl || p.naamKunstenaar || ''),
    huidigeKunstvorm: p.kunstvorm || null,
  }));

  const outPath = path.resolve(new URL('./kaartpunten-slugs.json', import.meta.url).pathname);
  await fs.writeFile(outPath, JSON.stringify(exportData, null, 2), 'utf8');
  console.log(`Wrote ${exportData.length} records to ${outPath}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(2);
});
