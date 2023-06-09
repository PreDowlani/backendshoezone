const express = require("express");
const router = express.Router();
// const checkAuth = require("../middleware/check-auth");

const Shoe = require("../models/modelShoe");
const User = require("../models/modelUser");
const Tallas = require("../models/modelTalla");

router.get("/", async (req, res, next) => {
  let zapatos;
  try {
    zapatos = await Shoe.find({}).populate("tallas");
  } catch (error) {
    res.status(404).json({
      mensaje: `Error en listar todos los zapatos`,
      error: error.messaje,
    });
    return next(error);
  }
  res.status(200).json({
    mensaje: `Mostrando todos los zapatos `,
    zapatos: zapatos,
  });
});

router.get("/:id", async (req, res, next) => {
  let idZapato = req.params.id;
  let zapatoConcreto;
  try {
    zapatoConcreto = await Shoe.findById(idZapato).populate("tallas");
    console.log(idZapato);
  } catch (err) {
    res.status(500).json({
      mensaje: `Error en mostrar el zapato `,
      error: err.messaje,
    });
    return next(err);
  }
  res.status(200).json({
    mensaje: `Mostrando zapato especifico`,
    zapato: zapatoConcreto,
  });
});

router.post("/", async (req, res, next) => {
  const { nombre, marca, categoria, descripcion, precio, cantidad } = req.body;
  let existeZapato;

  try {
    existeZapato = await Shoe.findOne({ nombre: existeZapato });
  } catch (err) {
    res.status(500).json({
      mensaje: `Error en los datos `,
      error: err.messaje,
    });
    return next(err);
  }

  if (existeZapato) {
    const error = new Error(" Ya existe el mismo zapato");
    error.code = 401;
    return next(error);
  } else {
    const nuevoZapato = new Shoe({
      nombre,
      marca,
      categoria,
      descripcion,
      precio,
      cantidad,
    });
    console.log(nuevoZapato);

    try {
      await nuevoZapato.save();
    } catch (err) {
      const error = new Error("No se han podido guardar los datos");
      error.code = 500;
      return next(err);
    }

    console.log(nuevoZapato);
    res.status(200).json({
      mensaje: `Zapato creado con éxito`,
      zapatoCreado: nuevoZapato,
    });
  }
});

// router.use(checkAuth);
router.patch("/:id", async (req, res, next) => {
  const idZapatos = req.params.id;
  let cambiosPorHacer = req.body;
  let zapatoEditar;
  try {
    zapatoEditar = await Shoe.findByIdAndUpdate(idZapatos, cambiosPorHacer, {
      talla: await Tallas.findById(talla),
      new: true,
      runValidators: true,
    });
  } catch (error) {
    const err = new Error(
      "Ha ocurrido un error. No se han podido actualizar los datos"
    );
    error.code = 500;
    return next(err);
  }
  res.status(200).json({
    mensaje: "Curso modificado",
    zapatos: zapatoEditar,
  });
});

//Añadimos el campo de cantidad tanto al modelo como en la ruta .
router.put("/cantidad", async (req, res, next) => {
  let cantidad = req.params.cantidad;
  try {
    cantidad = await Shoe.updateMany({}, { $set: { cantidad: cantidad } }); //actualizamos a todos los zapatos el campo de cantidad ,
    // en default 0
  } catch (error) {
    res.status(500).json({
      mensaje: `Error en actualizar cantidad de productos`,
      error: error.message,
    });
    return next(error);
  }
  res.status(200).json({
    mensaje: `Actualización de cantidad de productos exitosa`,
    cantidad: cantidad,
  });
});

router.delete("/:id", async (req, res, next) => {
  let idZapatos = req.params.id;
  let eliminarZapato;
  try {
    eliminarZapato = await Shoe.findByIdAndDelete(idZapatos);
  } catch (err) {
    res.status(404).json({
      mensaje: `No se puede eliminar el Zapato`,
      error: err.messaje,
    });
    return next(err);
  }
  res.status(200).json({
    mensaje: `Zapato eliminado de la BDD`,
    eliminado: eliminarZapato,
  });
});

//Añadimos el buscador:
router.get("/search/:search", async (req, res, next) => {
  const search = req.params.search;
  let products;
  try {
    products = await Shoe.find({
      marca: { $regex: search, $options: "i" },
    });
  } catch (err) {
    const error = new Error("Ha ocurrido un error en la recuperación de datos");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({ mensaje: "Zapatos encontrados", zapatos: products });
});




router.patch("/:id/talla", async(req,res,next)=>{
  let idZapato = req.params.id;
  let editarTalla = req.body.tallas;
  let añadirTalla;
  let zapatosEditar;
  try {
    zapatosEditar = await Shoe.findById(idZapato).populate("tallas");
    añadirTalla = await Tallas.findById(editarTalla);
    console.log(añadirTalla)

    if(!zapatosEditar){
      res.status(401).json({
        mensaje : `Zapato no encontrado`,
        error : error.message,
      })
    } else {
      console.log(zapatosEditar)
      console.log(añadirTalla)

      zapatosEditar.tallas.push(añadirTalla);
      await zapatosEditar.save();
    }
  }
  catch (error) {
    console.log(error)
    return next(error)
  }
  res.status(200).json({
    mensaje : `Añadido talla al zapato selecionado`,
    zapato : zapatosEditar,
  })
})

module.exports = router;
