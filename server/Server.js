import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema(
  {
    voornaam: { type: String, required: true, trim: true },
    achternaam: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { type: String, required: true },
    telefoon: { type: String, required: true, trim: true },
    kunstrichting: { type: String, required: true, trim: true },
    website: { type: String, default: '', trim: true },
    facebook: { type: String, default: '', trim: true },
    instagram: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true },
    adres: { type: String, required: true, trim: true },
    postcode: { type: String, required: true, trim: true },
    woonplaats: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET ontbreekt in .env');
  }

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

app.get('/', (req, res) => {
  res.json({ message: 'Server werkt' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    let {
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

    voornaam = voornaam?.trim();
    achternaam = achternaam?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    telefoon = telefoon?.trim();
    kunstrichting = kunstrichting?.trim();
    website = website?.trim() || '';
    facebook = facebook?.trim() || '';
    instagram = instagram?.trim() || '';
    bio = bio?.trim() || '';
    adres = adres?.trim();
    postcode = postcode?.trim();
    woonplaats = woonplaats?.trim();

    if (
      !voornaam ||
      !achternaam ||
      !email ||
      !password ||
      !telefoon ||
      !kunstrichting ||
      !adres ||
      !postcode ||
      !woonplaats
    ) {
      return res.status(400).json({
        message: 'Vul alle verplichte velden in.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Wachtwoord moet minimaal 8 tekens bevatten.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Dit e-mailadres is al geregistreerd.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      voornaam,
      achternaam,
      email,
      password: hashedPassword,
      telefoon,
      kunstrichting,
      website,
      facebook,
      instagram,
      bio,
      adres,
      postcode,
      woonplaats
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
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
        woonplaats: user.woonplaats
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Dit e-mailadres is al geregistreerd.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Controleer of alle verplichte velden correct zijn ingevuld.'
      });
    }

    return res.status(500).json({
      message: 'Serverfout bij registreren.'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email en wachtwoord zijn verplicht.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Ongeldige logingegevens.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Ongeldige logingegevens.' });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
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
        woonplaats: user.woonplaats
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Serverfout bij inloggen.' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden.' });
    }

    return res.json(user);
  } catch (error) {
    console.error('ME ERROR:', error);
    return res.status(500).json({ message: 'Serverfout bij ophalen profiel.' });
  }
});

app.put('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden.' });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    return res.status(500).json({ message: 'Serverfout bij opslaan profiel.' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});