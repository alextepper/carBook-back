const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  make: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Make",
    required: true,
  },
});

const Model = mongoose.model("Model", ModelSchema);
module.exports = Model;
