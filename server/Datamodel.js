import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }
});

export default DataSchema;