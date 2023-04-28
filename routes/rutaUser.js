const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //importamos a jwt para conseguir el token cuando creamos un usuario nuevo.

const User = require("../models/modelUser");
const Shoe = require("../models/modelShoe");

//Listar todos los usuarios "api/usuario" :

router.get("/", async (req, res, next) => {
  let usuarios;
  try {
    usuarios = await User.find({});
  } catch (error) {
    res.status(404).json({
      mensaje: `Error en listar todos los usuarios`,
      error: error.messaje,
    });
    return next(error);
  }
  res.status(200).json({
    mensaje: `Mostrando todos los usuarios `,
    usuarios: usuarios,
  });
});

//Listar un usuario en concreto mediante su id :
router.get("/:id", async (req, res, next) => {
  let idUsuario = req.params.id;
  let usuarioConcreto;

  try {
    usuarioConcreto = await User.findById(idUsuario);
  } catch (err) {
    res.status(500).json({
      mensaje: `Error en mostrar el usuario `,
      error: err.messaje,
    });
    return next(err);
  }
  res.status(200).json({
    mensaje: `Mostrando usuario especifico`,
    usuarios: usuarioConcreto,
  });
});

//Crear un Usuario nuevo:
router.post("/", async (req, res, next) => {
  const { nombre, edad, email, password, telefono } = req.body;
  let existeUsuario;

  //Comprobamos primero si el email del nuevo usuario ya existe en nuestro Base de Datos:
  try {
    existeUsuario = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json({
      mensaje: `Error en los datos `,
      error: err.messaje,
    });
    return next(err);
  }

  //Si ya existe un usuario con el mismo e-mail , le saldra error:
  // let nuevoUsuario;
  if (existeUsuario) {
    const error = new Error(" Ya existe un usuario con el mismo e-mail");
    error.code = 401;
    return next(error);
    // Si en caso contrario , tras verificar que no existe el nuevo email en nuestro base de datos , procedemos a crear el  nuevo usuario siguiendo nuestro modelo Schema.
  } else {
    //creamos el variable para encriptar la contraseña
    let hashedPassword;
    try {
      // hacemos la encriptacion con un  valor de 10(son las capas de seguridad) recomdable entre 10-14
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      const err = new Error("No se ha podido crear el usuario");
      err.code = 500;
      return next(err);
    }
    console.log(hashedPassword);
    const nuevoUsuario = new User({
      nombre,
      edad,
      email,
      password: hashedPassword,
      telefono,
    });
    console.log(nuevoUsuario);

    //procedemos a guardar dicho usuario en nuestro BDD.
    try {
      await nuevoUsuario.save();

      // si produce algun fallo , lo comunicaremos
    } catch (err) {
      const error = new Error("No se han podido guardar los datos");
      error.code = 500;
      return next(err);
    }
    // si todo esta bien , mostraremos que el usuario nuevo esta creado
    console.log(nuevoUsuario);
    res.status(200).json({
      mensaje: `Usuario creado con éxito`,
      usuarioCreado: nuevoUsuario,
    });
  }
});

//Modificar los Datos del usuario mediante su id:
router.put("/:id", async (req, res, next) => {
  let idUsuario = req.params.id;
  let editarUsuario;
  let camposPorCambiar = req.body;

  try {
    editarUsuario = await User.findByIdAndUpdate(idUsuario, camposPorCambiar, {
      //dentro de aqui podemos cambiar los parametros del usuario
      new: true,
      runValidators: true,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: "No se han podido actualizar los datos del docente",
      error: error.message,
    });
  }
  res.status(200).json({
    mensaje: `Datos del Usuario modificado con éxito`,
    cambios: editarUsuario,
  });
});

//Eliminar el Usuario mediante su id :
router.delete("/:id", async (req, res, next) => {
  let idUsuario = req.params.id;
  let eliminarUsuario;

  try {
    eliminarUsuario = await User.findByIdAndDelete(idUsuario);
  } catch (err) {
    res.status(404).json({
      mensaje: `No se puede eliminar el usuario`,
      error: err.messaje,
    });
    return next(err);
  }
  res.status(200).json({
    mensaje: `Usuario eliminado de la BDD`,
    eliminado: eliminarUsuario,
  });
});

//Hacemos el Login y comprobamos el funcionamiento correcto de la encriptacion enviando datos de usuario.
//PASSWORD TIENE SER ENCRIPTADO
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let usuarioExiste;

  //Primero comprobaremos el email introducido
  try {
    usuarioExiste = await User.findOne({
      email: email,
    });
  } catch (error) {
    const err = new Error(
      "No se ha podido realizar la operación. Pruebe más tarde"
    );
    err.code = 500;
    return next(err);
  }
  console.log(usuarioExiste);

  // si el email introducido no existe en la BDD , dara un error
  if (!usuarioExiste) {
    const error = new Error("No existe el usuario");
    error.code = 505;
    return next(error);
  }

  //ahora vamos con la Contraseñan , simpre ponemos el contraseña falsa , pordefecto
  let isValidPassword = false;

  //  Encriptamos la contraseña !!
  isValidPassword = bcrypt.compareSync(password, usuarioExiste.password);
  // aqui es true cuando comprueba que la contraseña y la contraseña del usuario coincide

  if (!isValidPassword) {
    const error = new Error("No se ha podido identificar al usuario");
    error.code = 505;
    return next(error);
  }
  // ? Código para la creación del token
  let token;
  try {
    token = jwt.sign(
      {
        userId: usuarioExiste.id,
        email: usuarioExiste.email,
      },
      "elputoamo18",
      {
        expiresIn: "30min",
      }
    );
  } catch (error) {
    const err = new Error("El proceso de login ha fallado");
    err.code = 500;
    return next(err);
  }

  res.status(200).json({
    mensaje: `User logged in `,
    userId: usuarioExiste.id,
    email: usuarioExiste.email,
    token: token,
  });
});
//Para ver los articulos que tiene el usuario en su carrito
router.get("/:id/ver_carrito", async (req, res, next) => {
  let idUsuario = req.params.id;
  let carritoDelUsuairo;

  try {
    carritoDelUsuairo = await User.findById(idUsuario).populate("carrito");
  } catch (err) {
    res.status(500).json({
      mensaje: `Error en mostrar el usuario `,
      error: err.messaje,
    });
    return next(err);
  }

  res.status(200).json({
    mensaje: `Mostrando carrito del usuario`,
    carrito: carritoDelUsuairo.carrito,
  });
});

//Para añadir el zapato al array de carrito del usuario
//api/usuario/el id del usuario que le queremso añadir / y el carrito (un endpoint)
router.put("/:id/ver_carrito", async (req, res, next) => {
  let idUsuario = req.params.id; //el id del usuario
  let usuarioCarrito; //el carrito del usuario
  let añadirZapato; //y el zapato que le vamos a añadir en el array
  try {
    usuarioCarrito = await User.findById(idUsuario); //buscamos al usuario
    console.log(usuarioCarrito);
    añadirZapato = await Shoe.findById(req.body.carrito);
    console.log(añadirZapato); //buscamos el id del zapato (se pone req.body.zapato xk es lo que vamos a modificar/o añadir)

    usuarioCarrito.carrito.push(añadirZapato); //subimos el id del zapato al array del carrito del usuario

    await usuarioCarrito.save(); //lo guuardamos
  } catch (error) {
    res.status(500).json({
      mensaje: `Problemas al añadir el producto en el carrito del usuario`,
      error: error.message,
    });
    return next(error);
  }

  res.status(200).json({
    mensaje: `Zapato añadido al carrito del cliente`,
    carrito: usuarioCarrito, //y ya esta mandado , lo verificamos.
  });
});

//Para eliminar el zapato del carrito del usuario
router.delete("/:id/carrito", async (req, res, next) => {
  let idUsuario = req.params.id; //buscamos al usuario
  let idZapato = req.body.id;
  let usuarioCarrito;
  let eliminarZapato;

  try {
    usuarioCarrito = await User.findById(idUsuario); //encontramos el usuario
    eliminarZapato = await Shoe.findById(idZapato); //buscamos en su carrito
    console.log(eliminarZapato);

    usuarioCarrito.carrito.pull(eliminarZapato); // eliminiamos el id del zapato de su carrito
    await usuarioCarrito.save(); // guardarmos su carrito
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: `Error en eliminar del carrito`,
      error: error.message,
    });
    return next(error);
  }
  res.status(200).json({
    mensaje: `Eliminado del carrito`,
    carrito: usuarioCarrito, //mostramos el usuario con todos sus datos y lo que tiene en el carrito
  });
});

module.exports = router;
