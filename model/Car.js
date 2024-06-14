const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there is a User model
    // required: true,
  },
  configuration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Configuration",
    required: true,
  },
  pictures: [String],
  nickname: {
    type: String,
    // required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  licensePlate: {
    type: String,
    // required: true,
  },
  mileage: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  previousOwners: {
    type: Number,
    // required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isForSale: {
    type: Boolean,
    default: false,
  },
});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;
