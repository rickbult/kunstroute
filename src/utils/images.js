// Seeded placeholder photo, used when an artist hasn't uploaded a real one
// (or the upload is unreachable). Same picsum.photos pattern as src/data/artists.json,
// seeded by name so each artist consistently gets the same placeholder.
export function placeholderFoto(naam) {
  return `https://picsum.photos/seed/${encodeURIComponent(naam || 'kunstroute')}/600/400`;
}

export function fotoMetFallback(url, naam) {
  return url || placeholderFoto(naam);
}
