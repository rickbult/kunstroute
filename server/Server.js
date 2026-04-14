import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5000;

// User Schema
const userSchema = new mongoose.Schema({
  voornaam: { type: String, required: true },
  achternaam: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefoon: { type: String, required: true },
  kunstrichting: { type: String, required: true },
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  adres: { type: String, required: true },
  postcode: { type: String, required: true },
  woonplaats: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Kunstroute API OK" });
});

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      voornaam,
      achternaam,
      email,
      password,
      telefoon,
      kunstrichting,
      bio,
      website,
      facebook,
      instagram,
      adres,
      postcode,
      woonplaats,
    } = req.body;

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
      return res
        .status(400)
        .json({ error: "Alle verplichte velden zijn verplicht" });
    }

    const bestaand = await User.findOne({ email });

    if (bestaand) {
      return res.status(400).json({ error: "E-mail is al in gebruik" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      voornaam,
      achternaam,
      email,
      password: hashedPassword,
      telefoon,
      kunstrichting,
      bio,
      website,
      facebook,
      instagram,
      adres,
      postcode,
      woonplaats,
    });

    res.status(201).json({
      message: "User aangemaakt",
      user: {
        id: user._id,
        voornaam: user.voornaam,
        achternaam: user.achternaam,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(400).json({ error: error.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Ongeldige credentials" });
    }

    const wachtwoordCorrect = await bcrypt.compare(password, user.password);

    if (!wachtwoordCorrect) {
      return res.status(401).json({ error: "Ongeldige credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        voornaam: user.voornaam,
        achternaam: user.achternaam,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("💥 MongoDB error:", error.message);
  });