const express = require("express");
const router = express.Router();

const Tallas = require("../models/modelTalla")


router.get("/", async(req,res,next)=>{
    let verTallas;
    try{
        verTallas = await Tallas.find({}).populate("tallas")
    } catch (error) {
        console.log(error)
    }
    res.status(200).json({
        mensaje : `Mostrando las tallas`,
        tallas : verTallas
    })
})


router.post("/", async(req,res,next)=>{
    const {tallas} = req.body;
    
    try{
      const  añadirTallas  = new Tallas ({
        tallas
      });

      await añadirTallas.save();
      console.log(añadirTallas)
    }
    catch (error) {
        res.status(401).json({
            mensaje : `Error al crear tallas`,
            error : error.messaje,
        });
        return next(error);
    }
    res.status(200).json({
        mensaje : `Añadido talla correctamente`,
        tallas : tallas
    })
})


module.exports = router;