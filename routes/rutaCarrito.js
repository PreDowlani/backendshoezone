const express = require("express");
const router = express.Router();

const Cart = require("../models/modelCart");
const User = require("../models/modelUser");
const Shoe = require("../models/modelShoe");

router.get("/", async(req,res,next)=>{
    let carrito;
    try{
        carrito = await Cart.find({});
    } catch(error) {
        res.status(404).json({
            mensaje : `El carrito esta vacio`,
            error : error.messaje,
        })
        return next(error)
    }
    res.status(200).json({
        mensaje : `Mostrando articulos en el carrito`,
        carrito : carrito
    });
});

router.get("/:id", async(req,res,next)=>{
    let idCarrito = req.params.id;
    let carrito;
    try{
        carrito = await Cart.findById(idCarrito);
    } catch(error) {
        res.status(404).json({
            mensaje : `El carrito esta vacio`,
            error : error.messaje,
        })
        return next(error)
    }
    res.status(200).json({
        mensaje : `Mostrando articulos en el carrito`,
        carrito : carrito
    });
});


//para añadir en el carrito
router.post("/",async(req,res,next)=>{
     const {idUsuario,idZapatos} = req.body;

    let añadirUsuario;
    let añadirZapato;
    let añadirCarrito;

    try{
        añadirUsuario = await User.findById(idUsuario); //buscamos el id del usuario en su bdd
        añadirZapato = await Shoe.findById(idZapatos); //buscamos el id del zapato en su bdd
        añadirCarrito = await Cart.findOne({user : idUsuario});

        if(!añadirCarrito){
            añadirCarrito = new Cart ({
                user : idUsuario,
                item: [{
                    shoe : idZapatos,
                    cantidad : 1,
                }],
            });
     } 
    // else {
    //         const productoIndex = añadirCarrito.items.findIndex(
    //           (item) => item.shoe.toString() === idZapatos
    //         );
        
    //         if (productoIndex === -1) {
    //             añadirCarrito.items.push({
    //               shoe: idZapatos,
    //               quantity: 1,
    //             });
    //           } else {
    //             añadirCarrito.items[productoIndex].quantity++;
    //           }
    //         }
        await añadirCarrito.save();
    } catch(error) {
        res.status(500).json({
            mensaje : `Algo ha pasado mal`,
            error : error.messaje,
        });
        return next(error)
    }
    res.status(200).json({
        mensaje : " El artículo ha sido añadido al carrito",
        carrito: añadirCarrito,
});
});

module.exports = router;