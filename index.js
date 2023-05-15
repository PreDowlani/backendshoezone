const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(cors());

app.use(express.json());

const rutaUser = require("./routes/rutaUser");
app.use("/api/usuario", rutaUser);

const rutaShoe = require("./routes/rutaShoe");
app.use("/api/productos", rutaShoe);

const rutaTalla = require("./routes/rutaTalla");
app.use("/api/tallas", rutaTalla);

app.use((req, res) => {
  res.status(404).json({
    mensaje: `No se que passsaa !!! ..`,
  });
});

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`User listing through port ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log(error));
