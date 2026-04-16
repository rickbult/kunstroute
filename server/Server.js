import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import KaartPunt from "./LocationModel.js";

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Verbinding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kunstroute')
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(error => console.error("💥 MongoDB error:", error.message));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const dataSchema = new mongoose.Schema({
  content: { type: String, required: true }
});
const DataModel = mongoose.model("DataModel", dataSchema);

// --- MIDDLEWARE ---
app.use(express.json());

// CORS Middleware (Correcte implementatie)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next(); // Hier gaat het vaak mis als dit niet wordt aangeroepen
});

// --- ROUTES ---
app.get("/", (req, res) => res.json({ message: "Kunstroute API OK" }));

// AUTH ROUTES
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User aangemaakt', user: { username } });
  } catch (error) {
    next(error); // Geef de fout door aan de error handler
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Ongeldige credentials' });
    }
    const token = jwt.sign(
      { id: user._id, username }, 
      process.env.JWT_SECRET || 'kunstroute_secret_2026',
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user._id, username } });
  } catch (error) {
    next(error);
  }
});

// DATA ROUTES
app.post("/api/data", async (req, res, next) => {
  try {
    const newData = await DataModel.create({ content: req.body.content });
    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
});

app.get("/api/data", async (req, res, next) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get("/api/kaartpunten", async (req, res, next) => {
  try {
    const alleKaartpunten = await KaartPunt.find();
    res.json(alleKaartpunten);
  } catch (error) {
    next(error);
  }
});

// --- ERROR HANDLER (MOET 4 PARAMETERS HEBBEN) ---
app.use((err, req, res, next) => {
  console.error("❌ Error stack:", err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Interne server fout' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});