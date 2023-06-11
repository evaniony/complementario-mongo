import fs from "fs";
import { ProductManager } from "./ProductManager.js";

const productManager = new ProductManager("product.json")

export class CartManager{
    constructor(path){
        this.cart = [];
        this.path = path;

        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, "[]");
        }
    }

    //crear CARRITO
    /* async createCart(idCart){
        let newCart = {
            idCart: idCart,
            product: []
        };
        const read = await fs.promises.readFile(this.path, "utf-8");
        read.push(newCart);
        let parse = JSON.parse(read);
        console.log(parse);
        await fs.promises.writeFile(this.path, JSON.stringify(parse))


    } */
    async createCart(idCart) {
        //dudas con el try-catch
        let newCart = {
          idCart: idCart,
          product: []
        };
      
        try {
          const read = await fs.promises.readFile(this.path, "utf-8");
          let parse = JSON.parse(read);
          parse.push(newCart);
      
          await fs.promises.writeFile(this.path, JSON.stringify(parse));
        } catch (error) {
          console.error("Error al crear el carrito:", error);
        }
      }

    //OBTENER TODOS LOS CARRITOS;
    async getCart(idCart){
        const cartRead = await fs.promises.readFile(this.path, "utf-8");
        const cartParse = JSON.parse(cartRead);
        const find = cartParse.find(cart => cart.idCart == idCart);

        if(find){
            return find;
        }else{
            return "error pana";
        }
    }

    async addItem(cartId, prodId){
        const cartRead = await fs.promises.readFile(this.path, "utf-8");
        const cartParse = JSON.parse(cartRead);
        //this.path = cartParse;

        //pasar a numeros
        cartId = parseInt(cartId);
        prodId = parseInt(prodId);

        //llamar a todos los productos;
        const allProducts = await productManager.getProducts();

        const foundProd = allProducts.find(prod => prod.id == prodId);
        if(foundProd){
            //si lo encuentra al producto, que tambien busque en el carrito;
            let findCart = allProducts.find(cart => cart.cartId == cartId);

            if(!findCart){
                //sino encuentra el carrito...
                this.createCart(cartId);
                findCart = cartParse.find((cart) => cart.cartId == cartId);
            }

            const productsFound = findCart.product.find(product => product.productId == prodId);

            if(productsFound){
                productsFound.quantity++;

                let cartString = JSON.stringify(cartParse);
                await fs.promises.writeFile(this.path, cartString);
                return true;
            }else{
                const products = {
                    idProduct: prodId,
                    quantity: 1,
                }

                findCart.product.push(products);
                let cartString = JSON.stringify(this.cart);
                await fs.promises.writeFile(this.path, cartString);
                return true;
            }
        }else{
            throw new Error("En algún lugar, te equivocaste a")
        }
    }
}

//const cart = new CartManager("cart.json");