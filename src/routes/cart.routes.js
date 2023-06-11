import express from "express";
export const routerCart = express.Router();
import { ProductManager } from "../utils/ProductManager.js";
import { CartManager } from "../utils/CartManager.js";

const cartManager = new CartManager('cart.json');

routerCart.post("/", async (req, res)=>{
    const {idCart} = req.body;
    const createProd = await cartManager.createCart(idCart);

    if (createProd) {
        return res.status(201).json(
            {message: "product add successfully!",    
             data: req.body
            });
    }else{
        return res.status(404).json(
            {error: "error, bad response",    
             data: {}
            });
    };

});

routerCart.get("/:cid", async (req, res)=>{
    const cid = req.params.cid;
    const prodCart = await cartManager.getCart(cid);

    if(prodCart != undefined){
        return res.status(201).json(
            {message: "Producto del carrito: ",    
             data: prodCart
            }); 
    }else{    
        return res.status(404).json(
        {message: "No existe el producto con el id: " + cid,    
         data: {}
        });
    }
});

routerCart.post("/:cid/product/:cid", async (req, res)=>{
    const cartId = req.params.cid;
    const prodId = req.params.cid;

    const addItem = await cartManager.addItem(cartId, prodId);

    if (addItem) {
        return res.status(201).json(
            {message: "product add",    
             data: addItem
            });
    }else{
        return res.status(404).json(
            {error: "error, bad response",    
             data: {}
            });
    };
})