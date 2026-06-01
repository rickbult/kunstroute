import fs from 'fs/promises';
import path from 'path';

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
  const kaartpuntPath = path.resolve(new URL('./kaartpunten-slugs.json', import.meta.url).pathname);
  const artistsPath = path.resolve(new URL('../src/data/artists.json', import.meta.url).pathname);

  const kaartpuntenRaw = await fs.readFile(kaartpuntPath, 'utf8');
  const kaartpunten = JSON.parse(kaartpuntenRaw);

  const artistsRaw = await fs.readFile(artistsPath, 'utf8');
  const artists = JSON.parse(artistsRaw);

  const artistIndex = artists.map((a) => ({
    key: (a.link || a.title || '').toString(),
    norm: normalize(a.link || a.title || ''),
    discipline: a.discipline || null,
  }));

  const mapping = {};
  for (const kp of kaartpunten) {
    const kpNorm = normalize(kp.naamKunstenaar || kp.slug || '');
    // find best artist by minimal levenshtein distance to title or link
    let best = null;
    let bestScore = Infinity;
    for (const art of artistIndex) {
      if (!art.discipline) continue;
      const score1 = levenshtein(kpNorm, art.norm);
      if (score1 < bestScore) {
        bestScore = score1;
        best = art;
      }
    }

    // also accept if kp.slug contains art key
    const kpSlug = (kp.slug || '').toString().toLowerCase();
    const direct = artistIndex.find((a) => a.key && kpSlug.includes(a.key));
    if (direct && direct.discipline) {
      mapping[kp.slug] = direct.discipline;
    } else if (best && bestScore <= Math.max(3, Math.floor(kpNorm.length * 0.4))) {
      mapping[kp.slug] = best.discipline;
    } else {
      // leave unmapped for manual review
    }
  }

  const outPath = path.resolve(new URL('./kaartpunt-discipline-mapping.json', import.meta.url).pathname);
  await fs.writeFile(outPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`Wrote mapping with ${Object.keys(mapping).length} entries to ${outPath}`);
}

main().catch((e) => {
  console.error('Failed:', e);
  process.exit(2);
});
