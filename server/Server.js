import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;


const MONGODB_URL = "mongodb+srv://testuser:iT7CSMdS@cluster0.5chgwzm.mongodb.net/kunstroute?retryWrites=true&w=majority";

const DataSchema = new mongoose.Schema({
  content: { type: String, required: true }
});

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => res.json({ message: "Kunstroute API OK" }));

app.post("/api/data", async (req, res) => {
  try {
    const DataModel = mongoose.model("DataModel", DataSchema);
    const newData = await DataModel.create({ content: req.body.content });
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const DataModel = mongoose.model("DataModel", DataSchema);
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("💥 MongoDB error:", error.message);
  });