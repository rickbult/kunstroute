import mongoose from "mongoose";

const kaartPuntSchema = new mongoose.Schema({
  naam: { type: String, required: true },
  kunstenaar: { type: String, required: true },
  kunstwerk: { type: String, required: true },
  breedtegraad: { type: Number, required: true },
  lengtegraad: { type: Number, required: true }
});

const KaartPunt = mongoose.model('KaartPunt', kaartPuntSchema);

export { KaartPunt };
export default KaartPunt;