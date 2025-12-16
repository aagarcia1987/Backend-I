import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const cartManager = new CartManager(path.join(__dirname, '../data/carts.json'));
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

router.post('/', async (req, res) => {
    try {
    const cart = await cartManager.createCart();
    res.status(201).json({ status: 'ok', payload: cart });
    } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
    }
});


router.get('/:cid', async (req, res) => {
    try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
    res.json({ status: 'ok', payload: cart.products });
    } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
    const { cid, pid } = req.params;

    const product = await productManager.getProductById(pid);
    if (!product) {
        return res.status(404).json({ status: 'error', error: 'Producto no existe' });
    }

    const cart = await cartManager.addProductToCart(cid, pid);
    if (!cart) {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.json({ status: 'ok', payload: cart });
    } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
    }
});

export default router;

