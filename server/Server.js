import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import KaartPunt from "./LocationModel.js";

dotenv.config({ path: new URL('./.env', import.meta.url) });

const serverApplicatie = express();
const SERVER_POORT = process.env.PORT || 5000;
const fallbackKaartpuntenPad = path.resolve(new URL('./kaartpuntenFallback.json', import.meta.url).pathname);
let fallbackKaartpunten = [];

try {
  const fallbackBestand = fs.readFileSync(fallbackKaartpuntenPad, 'utf8');
  fallbackKaartpunten = JSON.parse(fallbackBestand);
} catch (fout) {
  console.warn('⚠️ Lokale fallback kaartpunten niet geladen:', fout.message);
}

// MongoDB Verbinding
const mongoVerbinding = process.env.MONGODB_URI;

if (!mongoVerbinding) {
  console.error("💥 MONGODB_URI ontbreekt in server/.env");
  process.exit(1);
}

// Schemas
const gebruikerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Gebruiker = mongoose.model('User', gebruikerSchema);

const gegevensSchema = new mongoose.Schema({
  content: { type: String, required: true }
});
const GegevensModel = mongoose.model("DataModel", gegevensSchema);

// --- MIDDLEWARE ---
serverApplicatie.use(express.json());

// CORS Middleware (Correcte implementatie)
serverApplicatie.use((verzoek, antwoord, volgende) => {
  antwoord.header("Access-Control-Allow-Origin", "*");
  antwoord.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  antwoord.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (verzoek.method === 'OPTIONS') {
    return antwoord.sendStatus(200);
  }
  volgende(); // Hier gaat het vaak mis als dit niet wordt aangeroepen
});

// --- ROUTES ---
serverApplicatie.get("/", (verzoek, antwoord) => antwoord.json({ message: "Kunstroute API OK" }));

// AUTH ROUTES
serverApplicatie.post("/api/auth/register", async (verzoek, antwoord, volgende) => {
  try {
    const { username, email, password } = verzoek.body;
    const gehashtWachtwoord = await bcrypt.hash(password, 12);
    const gebruiker = new Gebruiker({ username, email, password: gehashtWachtwoord });
    await gebruiker.save();
    antwoord.status(201).json({ message: 'User aangemaakt', user: { username } });
  } catch (fout) {
    volgende(fout); // Geef de fout door aan de error handler
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

// DATA ROUTES
serverApplicatie.post("/api/data", async (verzoek, antwoord, volgende) => {
  try {
    const nieuweGegevens = await GegevensModel.create({ content: verzoek.body.content });
    antwoord.status(201).json(nieuweGegevens);
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.get("/api/data", async (verzoek, antwoord, volgende) => {
  try {
    const gegevens = await GegevensModel.find();
    antwoord.json(gegevens);
  } catch (fout) {
    volgende(fout);
  }
});

serverApplicatie.get("/api/kaartpunten", async (verzoek, antwoord, volgende) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const alleKaartpunten = await KaartPunt.find().lean();
      if (Array.isArray(alleKaartpunten) && alleKaartpunten.length > 0) {
        return antwoord.json(alleKaartpunten);
      }
    }

    antwoord.json(fallbackKaartpunten);
  } catch (fout) {
    if (fallbackKaartpunten.length > 0) {
      return antwoord.json(fallbackKaartpunten);
    }
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

// --- ERROR HANDLER (MOET 4 PARAMETERS HEBBEN) ---
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
  } catch (error) {
    console.warn("⚠️ MongoDB niet bereikbaar, fallback wordt gebruikt:", error.message);
  }

  serverApplicatie.listen(SERVER_POORT, () => {
    console.log(`🚀 Server draait op http://localhost:${SERVER_POORT}`);
  });
}

startServer();