import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";  // npm i bcryptjs jsonwebtoken
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;

// User Schema (inline)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password automatisch
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model('User', userSchema);

// Data Schema 
const DataSchema = new mongoose.Schema({
  content: { type: String, required: true }
});

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Routes
app.get("/", (req, res) => res.json({ message: "Kunstroute API OK" }));

// AUTH ROUTES
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User aangemaakt', user: { username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Ongeldige credentials' });
    }
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Data routes
app.post("/api/data", async (req, res) => {
  try {
    if (mongoose.models.DataModel) {
      delete mongoose.models.DataModel;
      delete mongoose.modelSchemas.DataModel;
    }
    const DataModel = mongoose.model("DataModel", DataSchema);
    const newData = await DataModel.create({ content: req.body.content });
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    if (mongoose.models.DataModel) {
      delete mongoose.models.DataModel;
      delete mongoose.modelSchemas.DataModel;
    }
    const DataModel = mongoose.model("DataModel", DataSchema);
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connectie
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}`);
      console.log('Test auth: POST /api/auth/register en /api/auth/login');
    });
  })
  .catch(error => {
    console.error("💥 MongoDB error:", error.message);
  });