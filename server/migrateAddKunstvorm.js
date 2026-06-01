import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import Artist from './ArtistModel.js';
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
    console.error('MONGODB_URI not set in server/.env — aborting migration');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {});
  console.log('Connected to MongoDB');

  // Build artist map from Artists collection (imported earlier)
  const artistDocs = await Artist.find().lean();
  const artistMap = artistDocs.reduce((acc, art) => {
    const key = maakSlug(art.link || art.title || '');
    if (key && art.discipline) acc[key] = art.discipline;
    return acc;
  }, {});

  const punten = await KaartPunt.find().lean();
  console.log(`Found ${punten.length} KaartPunt documents`);

  let updated = 0;
  let matched = 0;
  const unmatched = [];

  for (const punt of punten) {
    const slugFromUrl = punt.detailPaginaUrl ? maakSlug(punt.detailPaginaUrl) : null;
    const slugFromName = maakSlug(punt.naamKunstenaar || '');
    const slug = slugFromUrl || slugFromName;

    let discipline = artistMap[slug] || null;
    if (!discipline) {
      // try looser matching: find an artist key that is contained in the slug or vice versa
      const keys = Object.keys(artistMap);
      // prefer the longest matching key to avoid short collisions
      let best = null;
      for (const k of keys) {
        if (!k) continue;
        if ((slug && slug.includes(k)) || (k.includes(slug))) {
          if (!best || k.length > best.length) best = k;
        }
      }
      if (best) discipline = artistMap[best];
    }
    if (discipline) {
      matched++;
      if (!punt.kunstvorm || punt.kunstvorm !== discipline) {
        await KaartPunt.updateOne({ _id: punt._id }, { $set: { kunstvorm: discipline } });
        updated++;
      }
    } else {
      unmatched.push({ id: punt._id.toString(), naam: punt.naamKunstenaar, slug });
    }
  }

  console.log(`Migration complete — matched: ${matched}, updated: ${updated}, unmatched: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log('Sample unmatched records:', unmatched.slice(0, 10));
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(2);
});
