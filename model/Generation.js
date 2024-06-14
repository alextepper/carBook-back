const mongoose = require("mongoose");

const GenerationSchema = new mongoose.Schema({
  years: {
    type: String, // e.g., "2015-2020"
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model",
    required: true,
  },
});

const Generation = mongoose.model("Generation", GenerationSchema);
module.exports = Generation;
