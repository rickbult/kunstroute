import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import KaartPunt from "./LocationModel.js";
import Artist from "./ArtistModel.js";
import { berekenRoute } from "./RouteService.js";

dotenv.config({ path: new URL('./.env', import.meta.url) });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverApplicatie = express();
const SERVER_POORT = process.env.PORT || 5000;

const mongoVerbinding = process.env.MONGODB_URI;
if (!mongoVerbinding) {
  console.error("💥 MONGODB_URI ontbreekt in server/.env");
  process.exit(1);
}

// Extended user schema that stores all artist registration fields
const gebruikerSchema = new mongoose.Schema({
  voornaam:      { type: String, required: true },
  achternaam:    { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  telefoon:      { type: String, default: '' },
  kunstrichting: { type: String, default: '' },
  bio:           { type: String, default: '' },
  website:       { type: String, default: '' },
  facebook:      { type: String, default: '' },
  instagram:     { type: String, default: '' },
  adres:         { type: String, default: '' },
  postcode:      { type: String, default: '' },
  woonplaats:    { type: String, default: '' },
  profielfotoUrl: { type: String, default: '' },
  kunstFotoUrl:  { type: String, default: '' },
  breedtegraad:  { type: Number, default: null },
  lengtegraad:   { type: Number, default: null },
  openZaterdag:          { type: Boolean, default: false },
  openZondag:            { type: Boolean, default: false },
  rolstoeltoegankelijk:  { type: String, default: '' },
}, { timestamps: true });

const Gebruiker = mongoose.model('User', gebruikerSchema);

// Multer: save uploaded photos to server/uploads/
const opslag = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    const uniek = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniek}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: opslag, limits: { fileSize: 5 * 1024 * 1024 } });

serverApplicatie.use(express.json());

// Serve uploaded photos as static files
serverApplicatie.use('/uploads', express.static(path.join(__dirname, 'uploads')));

serverApplicatie.use((verzoek, antwoord, volgende) => {
  antwoord.header("Access-Control-Allow-Origin", "*");
  antwoord.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  antwoord.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (verzoek.method === 'OPTIONS') return antwoord.sendStatus(200);
  volgende();
});

serverApplicatie.get("/", (verzoek, antwoord) => antwoord.json({ message: "Kunstroute API OK" }));

async function geocodeerAdres(adres, postcode, woonplaats) {
  const basis = { format: 'json', limit: 1, countrycodes: 'nl' };
  const pogingen = [
    adres && woonplaats && { street: adres, postalcode: postcode, city: woonplaats, ...basis },
    adres && woonplaats && { street: adres, city: woonplaats, ...basis },
    woonplaats            && { city: woonplaats, ...basis },
  ].filter(Boolean);

  for (const params of pogingen) {
    const qs = new URLSearchParams(params).toString();
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${qs}`,
        { headers: { 'User-Agent': 'KunstrouteNW/1.0 (info@kunstroute-nw-veluwe.nl)' } }
      );
      const data = await res.json();
      if (data?.[0]) return { breedtegraad: parseFloat(data[0].lat), lengtegraad: parseFloat(data[0].lon) };
    } catch (e) {
      console.warn('Geocoding mislukt:', e.message);
    }
  }
  return { breedtegraad: null, lengtegraad: null };
}

// Return registered users as map points (only those with coordinates)
serverApplicatie.get("/api/map-punten", async (verzoek, antwoord, volgende) => {
  try {
    // Use the `kaartpunts` collection for map points — this contains the
    // geo-coordinates and display fields the frontend expects.
    const punten = await KaartPunt.find({
      breedtegraad: { $ne: null },
      lengtegraad:  { $ne: null },
    }).lean();

    antwoord.json(punten.map((p) => ({
      naamKunstenaar:          p.naamKunstenaar || '',
      volledigAdres:           p.volledigAdres || '',
      stad:                    p.stad || '',
      kunstvorm:               p.kunstvorm || '',
      breedtegraad:            p.breedtegraad,
      lengtegraad:             p.lengtegraad,
      detailPaginaUrl:         p.detailPaginaUrl || (p._id && p._id.toString()) || '',
      openDagenKunstroute2026: p.openDagenKunstroute2026 || '',
      rolstoeltoegankelijkheid: p.rolstoeltoegankelijkheid || '',
      fotoUrl: p.fotoUrl || null,
      titelWerk: p.titelWerk || null,
    })));
  } catch (fout) {
    volgende(fout);
  }
});

function verifieerToken(verzoek, antwoord, volgende) {
  const authHeader = verzoek.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return antwoord.status(401).json({ error: 'Niet ingelogd.' });
  try {
    verzoek.gebruiker = jwt.verify(token, process.env.JWT_SECRET || 'kunstroute_secret_2026');
    volgende();
  } catch {
    antwoord.status(401).json({ error: 'Token ongeldig of verlopen.' });
  }
}

// Get current logged-in user's profile
serverApplicatie.get("/api/auth/me", verifieerToken, async (verzoek, antwoord, volgende) => {
  try {
    const gebruiker = await Gebruiker.findById(verzoek.gebruiker.id).lean();
    if (!gebruiker) return antwoord.status(404).json({ error: 'Gebruiker niet gevonden.' });
    const { password: _, ...veilig } = gebruiker;
    antwoord.json({
      ...veilig,
      profielfoto: gebruiker.profielfotoUrl || '',
      kunstFoto:   gebruiker.kunstFotoUrl   || '',
    });
  } catch (fout) {
    volgende(fout);
  }
});

// Update current logged-in user's profile
serverApplicatie.put(
  "/api/auth/me",
  verifieerToken,
  upload.fields([{ name: 'profielfoto', maxCount: 1 }, { name: 'kunstFoto', maxCount: 1 }]),
  async (verzoek, antwoord, volgende) => {
    try {
      const updates = {};
      const velden = ['voornaam', 'achternaam', 'telefoon', 'kunstrichting', 'bio', 'website', 'facebook', 'instagram', 'adres', 'postcode', 'woonplaats'];
      velden.forEach(v => { if (verzoek.body[v] !== undefined) updates[v] = verzoek.body[v]; });
      if (verzoek.body.openZaterdag           !== undefined) updates.openZaterdag          = verzoek.body.openZaterdag          === 'true' || verzoek.body.openZaterdag          === true;
      if (verzoek.body.openZondag             !== undefined) updates.openZondag            = verzoek.body.openZondag            === 'true' || verzoek.body.openZondag            === true;
      if (verzoek.body.rolstoeltoegankelijk !== undefined) updates.rolstoeltoegankelijk = verzoek.body.rolstoeltoegankelijk;

      // Re-geocode if address fields changed
      if (verzoek.body.adres || verzoek.body.postcode || verzoek.body.woonplaats) {
        const huidig = await Gebruiker.findById(verzoek.gebruiker.id).lean();
        const adres     = updates.adres     ?? huidig?.adres     ?? '';
        const postcode  = updates.postcode  ?? huidig?.postcode  ?? '';
        const woonplaats = updates.woonplaats ?? huidig?.woonplaats ?? '';
        const coords = await geocodeerAdres(adres, postcode, woonplaats);
        if (coords.breedtegraad) {
          updates.breedtegraad = coords.breedtegraad;
          updates.lengtegraad  = coords.lengtegraad;
        }
      }
      if (verzoek.files?.profielfoto?.[0]) updates.profielfotoUrl = `/uploads/${verzoek.files.profielfoto[0].filename}`;
      if (verzoek.files?.kunstFoto?.[0])   updates.kunstFotoUrl   = `/uploads/${verzoek.files.kunstFoto[0].filename}`;

      const bijgewerkt = await Gebruiker.findByIdAndUpdate(verzoek.gebruiker.id, updates, { new: true }).lean();
      if (!bijgewerkt) return antwoord.status(404).json({ error: 'Gebruiker niet gevonden.' });
      const { password: _, ...veilig } = bijgewerkt;
      antwoord.json({
        user: {
          ...veilig,
          profielfoto: bijgewerkt.profielfotoUrl || '',
          kunstFoto:   bijgewerkt.kunstFotoUrl   || '',
        }
      });
    } catch (fout) {
      volgende(fout);
    }
  }
);

// Return all registered artists (users) from MongoDB
serverApplicatie.get("/api/artists", async (verzoek, antwoord, volgende) => {
  try {
    // Prefer the `kaartpunts` collection as the canonical source for
    // displayed artists/kaartpunten. Fallback order: `kaartpunts` -> `artists` -> `users`.
    const kaartCount = await KaartPunt.countDocuments();
    if (kaartCount > 0) {
      const punten = await KaartPunt.find().lean();
      const extractSlug = (u) => {
        try {
          const url = new URL(u);
          return url.pathname.split('/').filter(Boolean).pop() || u;
        } catch (e) {
          return (u || '').toString().split('/').filter(Boolean).pop() || u || '';
        }
      };

      antwoord.json(punten.map((p) => ({
        // kaartpunts only have a single foto field; use it for both
        // profile and artwork display so the artworks page is populated.
        imgSrc:    p.fotoUrl || '',
        kunstFoto: p.fotoUrl || '',
        imgAlt:    p.naamKunstenaar || p.titelWerk || '',
        title:     p.naamKunstenaar || '',
        description: p.titelWerk || '',
        location:  p.stad || '',
        address:   p.volledigAdres || '',
        postcode:  null,
        phone:     null,
        email:     null,
        website:   null,
        facebook:  null,
        instagram: null,
        discipline:    p.kunstvorm || '',
        openZaterdag:         p.openDagenKunstroute2026?.includes('Zaterdag') || false,
        openZondag:           p.openDagenKunstroute2026?.includes('Zondag') || false,
        rolstoeltoegankelijk: p.rolstoeltoegankelijkheid || '',
        link:          extractSlug(p.detailPaginaUrl) || (p._id && p._id.toString()) || '',
      })));
      return;
    }

    const artistsCount = await Artist.countDocuments();
    if (artistsCount > 0) {
      const artists = await Artist.find().lean();
      antwoord.json(artists.map((a) => ({
        imgSrc:    a.imgSrc || '',
        kunstFoto: a.kunstFoto || '',
        imgAlt:    a.imgAlt || a.title || '',
        title:     a.title || '',
        description: a.description || '',
        location:  a.woonplaats || a.location || '',
        address:   a.address || '',
        postcode:  a.postcode || '',
        phone:     a.phone || '',
        email:     a.email || '',
        website:   a.website || '',
        facebook:  a.facebook || '',
        instagram: a.instagram || '',
        discipline:    a.discipline || '',
        openZaterdag:         a.openZaterdag || false,
        openZondag:           a.openZondag || false,
        rolstoeltoegankelijk: a.wheelchairaccessibility || a.rolstoeltoegankelijk || '',
        link:          a.link || (a._id && a._id.toString()) || '',
      })));
      return;
    }

    const gebruikers = await Gebruiker.find().lean();
    antwoord.json(gebruikers.map(gebruikerNaarArtist));
  } catch (fout) {
    volgende(fout);
  }
});

// Return a single registered artist by their MongoDB _id
serverApplicatie.get("/api/artists/:id", async (verzoek, antwoord, volgende) => {
  try {
    const rawId = verzoek.params.id || '';

    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1) Exact match on kaartpunts.detailPaginaUrl
    let byDetail = await KaartPunt.findOne({ detailPaginaUrl: rawId }).lean();

    // 2) If no exact match and `rawId` looks like a slug (no protocol), try
    //    matching the end of the stored URL (detailPaginaUrl endsWith slug).
    if (!byDetail && !rawId.startsWith('http')) {
      const regex = new RegExp(escapeRegex(rawId) + '$', 'i');
      byDetail = await KaartPunt.findOne({ detailPaginaUrl: { $regex: regex } }).lean();
    }

    // 3) If still not found and rawId looks URL-encoded, try decoding and exact match
    if (!byDetail) {
      try {
        const decoded = decodeURIComponent(rawId);
        if (decoded !== rawId) {
          byDetail = await KaartPunt.findOne({ detailPaginaUrl: decoded }).lean();
        }
      } catch (e) {}
    }

    if (byDetail) {
      return antwoord.json({
        imgSrc: byDetail.fotoUrl || '',
        title: byDetail.naamKunstenaar || '',
        description: byDetail.titelWerk || '',
        location: byDetail.stad || '',
        address: byDetail.volledigAdres || '',
        discipline: byDetail.kunstvorm || '',
        openDagenKunstroute2026: byDetail.openDagenKunstroute2026 || '',
        rolstoeltoegankelijkheid: byDetail.rolstoeltoegankelijkheid || '',
        link: byDetail.detailPaginaUrl || (byDetail._id && byDetail._id.toString()) || '',
      });
    }

    // 4) Try the `artists` collection (exact link or link ending with slug)
    let artist = await Artist.findOne({ link: rawId }).lean();
    if (!artist && !rawId.startsWith('http')) {
      const regex = new RegExp(escapeRegex(rawId) + '$', 'i');
      artist = await Artist.findOne({ link: { $regex: regex } }).lean();
    }
    if (artist) return antwoord.json(artist);

    // 5) If `rawId` is a valid ObjectId, fall back to users collection lookup
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      const gebruiker = await Gebruiker.findById(rawId).lean();
      if (gebruiker) return antwoord.json(gebruikerNaarArtist(gebruiker));
    }

    return antwoord.status(404).json({ error: 'Kunstenaar niet gevonden' });
  } catch (fout) {
    volgende(fout);
  }
});

function gebruikerNaarArtist(u) {
  const volleNaam = `${u.voornaam} ${u.achternaam}`.trim();
  const adresRegel = [u.adres, u.postcode, u.woonplaats].filter(Boolean).join(', ');
  return {
    imgSrc:    u.profielfotoUrl || '',
    kunstFoto: u.kunstFotoUrl   || '',
    imgAlt:    `Foto van ${volleNaam}`,
    title:     volleNaam,
    description: u.bio || '',
    location:  u.woonplaats || '',
    address:   adresRegel,
    postcode:  u.postcode || '',
    phone:     u.telefoon || '',
    email:     u.email || '',
    website:   u.website || '',
    facebook:  u.facebook || '',
    instagram: u.instagram || '',
    discipline:    u.kunstrichting || '',
    openZaterdag:         u.openZaterdag         || false,
    openZondag:           u.openZondag           || false,
    rolstoeltoegankelijk: u.rolstoeltoegankelijk || '',
    link:          u._id.toString(),
  };
}

// Register a new artist — accepts multipart/form-data with optional photo uploads
serverApplicatie.post(
  "/api/auth/register",
  upload.fields([{ name: 'profielfoto', maxCount: 1 }, { name: 'kunstFoto', maxCount: 1 }]),
  async (verzoek, antwoord, volgende) => {
    try {
      const { voornaam, achternaam, email, password, telefoon, kunstrichting, bio, website, facebook, instagram, adres, postcode, woonplaats, openZaterdag, openZondag } = verzoek.body;

      const bestaand = await Gebruiker.findOne({ email });
      if (bestaand) return antwoord.status(409).json({ error: 'E-mailadres is al in gebruik.' });

      const gehashtWachtwoord = await bcrypt.hash(password, 12);

      const profielfotoUrl = verzoek.files?.profielfoto?.[0]
        ? `/uploads/${verzoek.files.profielfoto[0].filename}`
        : '';
      const kunstFotoUrl = verzoek.files?.kunstFoto?.[0]
        ? `/uploads/${verzoek.files.kunstFoto[0].filename}`
        : '';

      const { breedtegraad, lengtegraad } = await geocodeerAdres(adres, postcode, woonplaats);

      const gebruiker = new Gebruiker({
        voornaam, achternaam, email,
        password: gehashtWachtwoord,
        telefoon: telefoon || '',
        kunstrichting: kunstrichting || '',
        bio: bio || '',
        website: website || '',
        facebook: facebook || '',
        instagram: instagram || '',
        adres: adres || '',
        postcode: postcode || '',
        woonplaats: woonplaats || '',
        openZaterdag: openZaterdag === 'true' || openZaterdag === true,
        openZondag:   openZondag   === 'true' || openZondag   === true,
        profielfotoUrl,
        kunstFotoUrl,
        breedtegraad,
        lengtegraad,
      });

      await gebruiker.save();

      const token = jwt.sign(
        { id: gebruiker._id, email },
        process.env.JWT_SECRET || 'kunstroute_secret_2026',
        { expiresIn: '1h' }
      );

      antwoord.status(201).json({
        token,
        user: {
          id: gebruiker._id,
          voornaam,
          achternaam,
          email,
        }
      });
    } catch (fout) {
      volgende(fout);
    }
  }
);

// Login with email + password
serverApplicatie.post("/api/auth/login", async (verzoek, antwoord, volgende) => {
  try {
    const { email, username, password } = verzoek.body;
    const zoekEmail = email || username;
    const gebruiker = await Gebruiker.findOne({ email: zoekEmail });
    if (!gebruiker || !(await bcrypt.compare(password, gebruiker.password))) {
      return antwoord.status(401).json({ error: 'Ongeldige e-mail of wachtwoord.' });
    }
    const token = jwt.sign(
      { id: gebruiker._id, email: gebruiker.email },
      process.env.JWT_SECRET || 'kunstroute_secret_2026',
      { expiresIn: '1h' }
    );
    antwoord.json({
      token,
      user: {
        id: gebruiker._id,
        voornaam: gebruiker.voornaam,
        achternaam: gebruiker.achternaam,
        email: gebruiker.email,
      }
    });
  } catch (fout) {
    volgende(fout);
  }
});

// Re-geocode all users that have an address but no coordinates
serverApplicatie.post("/api/admin/geocodeer-alles", async (verzoek, antwoord, volgende) => {
  try {
    const gebruikers = await Gebruiker.find({
      $or: [{ breedtegraad: null }, { breedtegraad: { $exists: false } }],
      $or: [{ woonplaats: { $ne: '' } }, { adres: { $ne: '' } }],
    }).lean();

    let bijgewerkt = 0;
    for (const u of gebruikers) {
      const coords = await geocodeerAdres(u.adres, u.postcode, u.woonplaats);
      if (coords.breedtegraad) {
        await Gebruiker.findByIdAndUpdate(u._id, {
          breedtegraad: coords.breedtegraad,
          lengtegraad: coords.lengtegraad,
        });
        bijgewerkt++;
      }
      // Nominatim rate limit: max 1 req/sec
      await new Promise(r => setTimeout(r, 1100));
    }
    antwoord.json({ bijgewerkt, totaal: gebruikers.length });
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.get("/api/kaartpunten", async (verzoek, antwoord, volgende) => {
  try {
    const alleKaartpunten = await KaartPunt.find().lean();
    antwoord.json(alleKaartpunten);
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.get("/api/route", async (verzoek, antwoord, volgende) => {
  try {
    const { coordinaten } = verzoek.query;
    antwoord.json(await berekenRoute(coordinaten));
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.use((fout, verzoek, antwoord, volgende) => {
  console.error("❌ Error:", fout.message);
  antwoord.status(fout.status || 500).json({ error: fout.message || 'Interne server fout' });
});

async function startServer() {
  try {
    await mongoose.connect(mongoVerbinding);
    console.log("✅ MongoDB verbonden!");

    try {
      // Verwijdert verouderde indexen die niet meer bij het schema horen (zoals
      // een wees-index 'username_1' uit een eerdere schemaversie — dat veld
      // bestaat al lang niet meer) en maakt ontbrekende indexen aan. Zonder dit
      // blijft zo'n unieke index op een afwezig veld actief: elk nieuw document
      // indexeert dan als 'null', en zodra een tweede registratie diezelfde
      // 'null' raakt, faalt die met een E11000 dup-key-fout.
      await Gebruiker.syncIndexes();
      console.log("✅ Gebruiker-indexen gesynchroniseerd");
    } catch (syncFout) {
      console.warn("⚠️ Synchroniseren van indexen mislukt:", syncFout.message);
    }
  } catch (error) {
    console.warn("⚠️ MongoDB niet bereikbaar:", error.message);
  }
  serverApplicatie.listen(SERVER_POORT, () => {
    console.log(`🚀 Server draait op http://localhost:${SERVER_POORT}`);
  });
}

startServer();
