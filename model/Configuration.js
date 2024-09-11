const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pictures: [String],
  taxCategory: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  generation: {
    name: {
      type: String,
      required: true,
    },
    years: {
      type: [Number],
      required: true,
    },
  },
  engine: {
    type: String,
    required: true,
  },
  gearbox: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
  wheelDrive: {
    type: String,
    required: true,
  },
  acceleration: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Configuration = mongoose.model("Configuration", ConfigurationSchema);
module.exports = Configuration;
