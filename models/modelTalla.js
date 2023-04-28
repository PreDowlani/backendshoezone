const mongoose = require("mongoose");

const tallaSchema = new mongoose.Schema({
  tallas: {
    type: String,
    required: true,
    enum: [
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
    ],
  },
});

module.exports = new mongoose.model("Tallas", tallaSchema);
