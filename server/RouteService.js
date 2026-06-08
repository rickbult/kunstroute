const OSRM_BASIS_URL = 'https://router.project-osrm.org/route/v1/driving';

export async function berekenRoute(coordinaten) {
  if (!coordinaten || coordinaten.split(';').length < 2) {
    const fout = new Error('Er zijn minimaal twee locaties nodig om een route te berekenen.');
    fout.status = 400;
    throw fout;
  }

  const url = `${OSRM_BASIS_URL}/${coordinaten}?overview=full&geometries=geojson`;

  let data;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KunstrouteNW/1.0 (info@kunstroute-nw-veluwe.nl)' },
    });
    data = await res.json();
  } catch (e) {
    console.warn('Route berekenen mislukt:', e.message);
    const fout = new Error('Route kon niet worden berekend.');
    fout.status = 502;
    throw fout;
  }

  const route = data?.routes?.[0];
  if (!route) {
    const fout = new Error('Geen route gevonden tussen deze locaties.');
    fout.status = 404;
    throw fout;
  }

  return {
    afstandKm: route.distance / 1000,
    duurMinuten: route.duration / 60,
    geometrie: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
  };
}
