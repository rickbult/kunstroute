import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import KaartPunt from './LocationModel.js';
import Artist from './ArtistModel.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const normalize = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function tokens(s) {
  return normalize(s).split(' ').filter((t) => t.length > 2);
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set — aborting');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {});
  console.log('Connected to MongoDB');

  const kaartpunten = await KaartPunt.find().lean();
  const artists = await Artist.find().lean();

  const artistIndex = artists.map((a) => ({ title: a.title, norm: normalize(a.title), discipline: a.discipline }));

  const mapping = {};
  const maakSlug = (waarde) =>
    (waarde || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/https?:\/\/[^/]+\//, '')
      .replace(/\/+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  for (const kp of kaartpunten) {
    const kpTokens = tokens(kp.naamKunstenaar || '');
    if (kpTokens.length === 0) continue;
    let best = null;
    let bestScore = 0;
    for (const art of artistIndex) {
      const artTokens = tokens(art.title || '');
      const common = artTokens.filter((t) => kpTokens.includes(t));
      if (common.length > bestScore) {
        bestScore = common.length;
        best = art;
      }
    }
    if (best && bestScore > 0 && best.discipline) {
      const slug = maakSlug(kp.detailPaginaUrl || kp.naamKunstenaar || kp._id?.toString());
      mapping[slug] = best.discipline;
    }
  }

  const outPath = path.resolve(new URL('./kaartpunt-discipline-mapping.json', import.meta.url).pathname);
  await fs.writeFile(outPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`Wrote heuristic mapping with ${Object.keys(mapping).length} entries to ${outPath}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(2); });
