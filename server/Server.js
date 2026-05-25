import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import KaartPunt from "./LocationModel.js";
import Artist from "./ArtistModel.js";

dotenv.config({ path: new URL('./.env', import.meta.url) });

const serverApplicatie = express();
const SERVER_POORT = process.env.PORT || 5000;

const maakSlug = (waarde) =>
  (waarde || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/https?:\/\/[^/]+\//, '')
    .replace(/\/+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const mongoVerbinding = process.env.MONGODB_URI;

if (!mongoVerbinding) {
  console.error("💥 MONGODB_URI ontbreekt in server/.env");
  process.exit(1);
}

const gebruikerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Gebruiker = mongoose.model('User', gebruikerSchema);

async function vulKaartpuntFotosAan() {
  return undefined;
}

serverApplicatie.use(express.json());

serverApplicatie.use((verzoek, antwoord, volgende) => {
  antwoord.header("Access-Control-Allow-Origin", "*");
  antwoord.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  antwoord.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (verzoek.method === 'OPTIONS') {
    return antwoord.sendStatus(200);
  }

  volgende();
});

serverApplicatie.get("/", (verzoek, antwoord) => antwoord.json({ message: "Kunstroute API OK" }));

serverApplicatie.get("/api/artists", async (verzoek, antwoord, volgende) => {
  try {
    const artistsCount = await Artist.countDocuments();
    if (artistsCount > 0) {
      const artists = await Artist.find().lean();
      return antwoord.json(artists.map((a) => ({
        imgSrc: a.imgSrc || '',
        imgAlt: a.imgAlt || `Foto van ${a.title}`,
        title: a.title,
        description: a.description || '',
        location: a.address?.split(',').pop()?.trim() || '',
        address: a.address || '',
        postcode: '',
        wheelchairaccessibility: a.wheelchairaccessibility || 'Onbekend',
        days: a.days || '',
        phone: a.phone || '',
        email: a.email || '',
        website: a.website || '',
        link: a.link,
        discipline: a.discipline || ''
      })));
    }

    const kaartpunten = await KaartPunt.find().lean();
    antwoord.json(kaartpunten.map((punt) => ({
      imgSrc: punt.fotoUrl || '',
      imgAlt: `Foto van ${punt.naamKunstenaar}`,
      title: punt.naamKunstenaar,
      description: punt.titelWerk || punt.volledigAdres || '',
      location: punt.stad || '',
      address: punt.volledigAdres || '',
      postcode: '',
      wheelchairaccessibility: punt.rolstoeltoegankelijkheid || 'Onbekend',
      days: punt.openDagenKunstroute2026 || '',
      phone: '',
      email: '',
      website: punt.googleMapsUrl || punt.detailPaginaUrl || '',
      link: maakSlug(punt.detailPaginaUrl) || maakSlug(punt.naamKunstenaar),
      discipline: punt.kunstvorm || '',
      kunstvorm: punt.kunstvorm || '',
      artworks: [],
    })));
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.get("/api/artists/:id", async (verzoek, antwoord, volgende) => {
  try {
    const artistsCount = await Artist.countDocuments();
    if (artistsCount > 0) {
      const artist = await Artist.findOne({ link: verzoek.params.id }).lean();
      if (artist) {
        return antwoord.json({
          imgSrc: artist.imgSrc || '',
          imgAlt: artist.imgAlt || `Foto van ${artist.title}`,
          title: artist.title,
          description: artist.description || '',
          location: artist.address?.split(',').pop()?.trim() || '',
          address: artist.address || '',
          postcode: '',
          wheelchairaccessibility: artist.wheelchairaccessibility || 'Onbekend',
          days: artist.days || '',
          phone: artist.phone || '',
          email: artist.email || '',
          website: artist.website || '',
          link: artist.link,
          discipline: artist.discipline || '',
          kunstvorm: artist.discipline || '',
          artworks: [],
        });
      }
    }

    const kaartpunten = await KaartPunt.find().lean();
    const artist = kaartpunten.find((item) => (maakSlug(item.detailPaginaUrl) || maakSlug(item.naamKunstenaar)) === verzoek.params.id);

    if (!artist) {
      return antwoord.status(404).json({ error: 'Kunstenaar niet gevonden' });
    }

    antwoord.json({
      imgSrc: artist.fotoUrl || '',
      imgAlt: `Foto van ${artist.naamKunstenaar}`,
      title: artist.naamKunstenaar,
      description: artist.titelWerk || artist.volledigAdres || '',
      location: artist.stad || '',
      address: artist.volledigAdres || '',
      postcode: '',
      wheelchairaccessibility: artist.rolstoeltoegankelijkheid || 'Onbekend',
      days: artist.openDagenKunstroute2026 || '',
      phone: '',
      email: '',
      website: artist.googleMapsUrl || artist.detailPaginaUrl || '',
      link: maakSlug(artist.detailPaginaUrl) || maakSlug(artist.naamKunstenaar),
      discipline: artist.kunstvorm || '',
      kunstvorm: artist.kunstvorm || '',
      artworks: [],
    });
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.post("/api/auth/register", async (verzoek, antwoord, volgende) => {
  try {
    const { username, email, password } = verzoek.body;
    const gehashtWachtwoord = await bcrypt.hash(password, 12);
    const gebruiker = new Gebruiker({ username, email, password: gehashtWachtwoord });
    await gebruiker.save();
    antwoord.status(201).json({ message: 'User aangemaakt', user: { username } });
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.post("/api/auth/login", async (verzoek, antwoord, volgende) => {
  try {
    const { username, password } = verzoek.body;
    const gebruiker = await Gebruiker.findOne({ username });
    if (!gebruiker || !(await bcrypt.compare(password, gebruiker.password))) {
      return antwoord.status(401).json({ error: 'Ongeldige credentials' });
    }
    const token = jwt.sign(
      { id: gebruiker._id, username },
      process.env.JWT_SECRET || 'kunstroute_secret_2026',
      { expiresIn: '1h' }
    );
    antwoord.json({ token, user: { id: gebruiker._id, username } });
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

serverApplicatie.post("/api/kaartpunten", async (verzoek, antwoord, volgende) => {
  try {
    const nieuwKaartpunt = await KaartPunt.create({
      naamKunstenaar: verzoek.body.naamKunstenaar,
      volledigAdres: verzoek.body.volledigAdres,
      googleMapsUrl: verzoek.body.googleMapsUrl,
      openDagenKunstroute2026: verzoek.body.openDagenKunstroute2026,
      rolstoeltoegankelijkheid: verzoek.body.rolstoeltoegankelijkheid,
      detailPaginaUrl: verzoek.body.detailPaginaUrl,
      stad: verzoek.body.stad,
      titelWerk: verzoek.body.titelWerk,
      kunstvorm: verzoek.body.kunstvorm ?? null,
      fotoUrl: verzoek.body.fotoUrl ?? null,
      breedtegraad: verzoek.body.breedtegraad,
      lengtegraad: verzoek.body.lengtegraad,
      geocodeWeergaveNaam: verzoek.body.geocodeWeergaveNaam,
      geocodeZoekopdracht: verzoek.body.geocodeZoekopdracht
    });
    antwoord.status(201).json(nieuwKaartpunt);
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.use((fout, verzoek, antwoord, volgende) => {
  console.error("❌ Error stack:", fout.stack);
  antwoord.status(fout.status || 500).json({
    error: fout.message || 'Interne server fout'
  });
});

async function startServer() {
  try {
    await mongoose.connect(mongoVerbinding);
    console.log("✅ MongoDB Connected!");
    await vulKaartpuntFotosAan();
  } catch (error) {
    console.warn("⚠️ MongoDB niet bereikbaar, fallback wordt gebruikt:", error.message);
  }

  serverApplicatie.listen(SERVER_POORT, () => {
    console.log(`🚀 Server draait op http://localhost:${SERVER_POORT}`);
  });
}

startServer();