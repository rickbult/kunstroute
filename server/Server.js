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
    woonplaats: { type: String, default: '' }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

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

app.get('/', (req, res) => {
  res.json({ message: 'Server werkt' });
});

app.post('/api/auth/register', async (req, res) => {
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
      woonplaats
    });

    const token = createToken(user);

    res.status(201).json({
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
    res.status(500).json({ message: 'Serverfout bij registreren.', error: error.message });
  }
});

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

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Serverfout bij opslaan profiel.', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});