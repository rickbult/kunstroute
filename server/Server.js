import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import KaartPunt from './LocationModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema(
  {
    voornaam: { type: String, required: true, trim: true },
    achternaam: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    telefoon: { type: String, default: '' },
    kunstrichting: { type: String, default: '' },
    website: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    bio: { type: String, default: '' },
    adres: { type: String, default: '' },
    postcode: { type: String, default: '' },
    woonplaats: { type: String, default: '' },
    profielfoto: { type: String, default: '' },
    kunstFoto: { type: String, default: '' }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-');

    cb(null, `${file.fieldname}-${baseName}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Alleen afbeeldingsbestanden zijn toegestaan.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

function createToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Geen token meegegeven.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ongeldige token.' });
  }
}

function mapUserResponse(user) {
  return {
    id: user._id,
    voornaam: user.voornaam,
    achternaam: user.achternaam,
    email: user.email,
    telefoon: user.telefoon,
    kunstrichting: user.kunstrichting,
    website: user.website,
    facebook: user.facebook,
    instagram: user.instagram,
    bio: user.bio,
    adres: user.adres,
    postcode: user.postcode,
    woonplaats: user.woonplaats,
    profielfoto: user.profielfoto,
    kunstFoto: user.kunstFoto
  };
}

app.get('/', (req, res) => {
  res.json({ message: 'Server werkt' });
});

app.post(
  '/api/auth/register',
  upload.fields([
    { name: 'profielfoto', maxCount: 1 },
    { name: 'kunstFoto', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        voornaam,
        achternaam,
        email,
        password,
        telefoon,
        kunstrichting,
        website,
        facebook,
        instagram,
        bio,
        adres,
        postcode,
        woonplaats
      } = req.body;

      if (!voornaam || !achternaam || !email || !password || !telefoon) {
        return res.status(400).json({
          message: 'Voornaam, achternaam, email, wachtwoord en telefoon zijn verplicht.'
        });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email bestaat al.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const profielfotoBestand = req.files?.profielfoto?.[0];
      const kunstFotoBestand = req.files?.kunstFoto?.[0];

      const profielfoto = profielfotoBestand
        ? `${BASE_URL}/uploads/${profielfotoBestand.filename}`
        : '';

      const kunstFoto = kunstFotoBestand
        ? `${BASE_URL}/uploads/${kunstFotoBestand.filename}`
        : '';

      const user = await User.create({
        voornaam,
        achternaam,
        email: email.toLowerCase(),
        password: hashedPassword,
        telefoon,
        kunstrichting,
        website,
        facebook,
        instagram,
        bio,
        adres,
        postcode,
        woonplaats,
        profielfoto,
        kunstFoto
      });

      const token = createToken(user);

      res.status(201).json({
        token,
        user: mapUserResponse(user)
      });
    } catch (error) {
      res.status(500).json({
        message: 'Serverfout bij registreren.',
        error: error.message
      });
    }
  }
);

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Ongeldige logingegevens.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Ongeldige logingegevens.' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: mapUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Serverfout bij inloggen.', error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Serverfout bij ophalen profiel.', error: error.message });
  }
});

app.get('/api/kaartpunten', async (req, res) => {
  try {
    const kaartpunten = await KaartPunt.find();
    res.json(kaartpunten);
  } catch (error) {
    res.status(500).json({ message: 'Serverfout bij ophalen kaartpunten.', error: error.message });
  }
});

app.put(
  '/api/auth/me',
  authMiddleware,
  upload.fields([
    { name: 'profielfoto', maxCount: 1 },
    { name: 'kunstFoto', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const updates = { ...req.body };
      delete updates.password;
      delete updates.email;

      const profielfotoBestand = req.files?.profielfoto?.[0];
      const kunstFotoBestand = req.files?.kunstFoto?.[0];

      if (profielfotoBestand) {
        updates.profielfoto = `${BASE_URL}/uploads/${profielfotoBestand.filename}`;
      }

      if (kunstFotoBestand) {
        updates.kunstFoto = `${BASE_URL}/uploads/${kunstFotoBestand.filename}`;
      }

      const user = await User.findByIdAndUpdate(req.userId, updates, {
        new: true,
        runValidators: true
      }).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Gebruiker niet gevonden.' });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(500).json({ message: 'Serverfout bij opslaan profiel.', error: error.message });
    }
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'Upload mislukt.',
      error: error.message
    });
  }

  if (error) {
    return res.status(400).json({
      message: 'Ongeldig bestand.',
      error: error.message
    });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});