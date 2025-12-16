
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(
  path.join(__dirname, '../data/products.json')
);


router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});


router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(product);
});


router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);


    const io = req.app.get('io');
    if (io) {
      const products = await productManager.getProducts();
      io.emit('products', products);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto', detail: error.message });
  }
});


router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updated = await productManager.updateProduct(pid, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const io = req.app.get('io');
  if (io) {
    const products = await productManager.getProducts();
    io.emit('products', products);
  }

  res.json(updated);
});


router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const deleted = await productManager.deleteProduct(pid);

  if (!deleted) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const io = req.app.get('io');
  if (io) {
    const products = await productManager.getProducts();
    io.emit('products', products);
  }

  res.json({ message: 'Producto eliminado' });
});

export default router;
