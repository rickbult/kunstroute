// Local, network-free placeholder for when an artist has no photo (or the
// upload can't be reached, e.g. it lives on a different server's disk).
// Generated entirely client-side as an inline SVG data URI, so it always
// renders — no dependency on an external image service that might be slow
// or blocked (important during a live demo on unfamiliar wifi).
const KLEUREN = ['#7C5CFC', '#FF4D8D', '#3DBE6C', '#FFB23F', '#2EA8C9'];

function kleurVoor(naam) {
  let hash = 0;
  for (let i = 0; i < naam.length; i++) hash = (hash * 31 + naam.charCodeAt(i)) >>> 0;
  return KLEUREN[hash % KLEUREN.length];
}

function initialen(naam) {
  const letters = naam
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((deel) => deel[0]?.toUpperCase() || '')
    .join('');
  return letters || '?';
}

export function placeholderFoto(naam) {
  const basis = naam || 'Kunstroute';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">`
    + `<rect width="600" height="400" fill="${kleurVoor(basis)}"/>`
    + `<text x="300" y="200" text-anchor="middle" dominant-baseline="central" `
    + `font-family="system-ui, sans-serif" font-size="120" font-weight="700" `
    + `fill="#ffffff" fill-opacity="0.9">${initialen(basis)}</text>`
    + `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function fotoMetFallback(url, naam) {
  return url || placeholderFoto(naam);
}
