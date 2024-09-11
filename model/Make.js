const mongoose = require("mongoose");

const MakeSchema = new mongoose.Schema({
  logo: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Make = mongoose.model("Make", MakeSchema);
module.exports = Make;
