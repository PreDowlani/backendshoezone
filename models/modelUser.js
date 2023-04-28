const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },

  edad: {
    type: Number,
    min: 18,
    max: 70,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
    required: true,
    minLength: 6,
  },

  password: {
    type: String,
    required: true,
  },

  telefono: {
    type: String,
    required: true,
  },
  carrito: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoe",
    },
  ],
  // talla: {
  //   type: String,
  //   required: true,
  //   enum: [
  //     "36",
  //     "37",
  //     "38",
  //     "39",
  //     "40",
  //     "41",
  //     "42",
  //     "43",
  //     "44",
  //     "45",
  //     "46",
  //     "47",
  //   ],
  // },
});

userSchema.plugin(uniqueValidator);

module.exports = new mongoose.model("User", userSchema);
