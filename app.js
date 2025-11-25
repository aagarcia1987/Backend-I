const express = require('express');
const server = express();
const port = 8080;
const path = require("path");
const ProductManager = require("./ProductManager.js");
const CartManager = require("./CartManager.js");

server.use(express.json());


const productManager = new ProductManager(path.join(__dirname, "data", "products.json"));
const cartManager = new CartManager(path.join(__dirname, "data", "carts.json"));

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

productsRouter.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
});

productsRouter.post("/", async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

productsRouter.put("/:pid", async (req, res) => {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
});

productsRouter.delete("/:pid", async (req, res) => {
    const ok = await productManager.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
});

server.use("/api/products", productsRouter);

const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.json(carts);
    } catch {
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
});

cartsRouter.post("/", async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

cartsRouter.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.status(201).json(cart);
});

server.use("/api/carts", cartsRouter);

server.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`))
