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

function levenshtein(a, b) {
  if (!a) return b.length;
  if (!b) return a.length;
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
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
  for (const kp of kaartpunten) {
    const kpNorm = normalize(kp.naamKunstenaar || '');
    let best = null;
    let bestScore = Infinity;
    for (const art of artistIndex) {
      if (!art.discipline) continue;
      const score = levenshtein(kpNorm, art.norm);
      if (score < bestScore) {
        bestScore = score;
        best = art;
      }
    }

    // also check containment
    const contained = artistIndex.find((a) => kpNorm.includes(a.norm) || a.norm.includes(kpNorm));
    if (contained && contained.discipline) {
      mapping[kp.slug] = contained.discipline;
    } else if (best && bestScore <= Math.max(4, Math.floor(kpNorm.length * 0.35))) {
      mapping[kp.slug] = best.discipline;
    }
  }

  const outPath = path.resolve(new URL('./kaartpunt-discipline-mapping.json', import.meta.url).pathname);
  await fs.writeFile(outPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`Wrote mapping with ${Object.keys(mapping).length} entries to ${outPath}`);

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(2); });
