const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shoeSchema = new mongoose.Schema({
  image: { type: String, required: true },
  nombre: { type: String, required: true, uppercase: true, trim: true },
  marca: { type: String, required: true, uppercase: true, trim: true },
  categoria: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cantidad: { type: Number, required: true, default: 1 },
  // talla: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "tallas",
  // },
});

shoeSchema.plugin(uniqueValidator);

module.exports = new mongoose.model("Shoe", shoeSchema);
