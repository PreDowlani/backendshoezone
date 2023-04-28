const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    //llamamos al token y con el split separamos el  Bearer y el TOKEN
    const token = req.headers.authorization.split(" ")[1];
    //el [1] -> es el indice donde se encuentra el token , que lo que nosotros necesitamos para trabjar.

    if (!token) {
      //si no hay token pues dara error
      throw new Error("Fallo de autenticacion");
    }
    let decodedTOKEN;
    decodedTOKEN = jwt.verify(token, "elputoamo18");
    req.useData = {
      userId: decodedTOKEN.userId,
    };
    next();
  } catch (err) {
    const error = new Error("Fallo de conexion con el servidor");
    error.code = 401;
    return next(err);
  }
};

module.exports = authorization;
