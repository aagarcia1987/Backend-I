import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from '../managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();


const manager = new ProductManager(path.join(__dirname, '../data/products.json'));


router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render('home', { title: 'Home', products });
  } catch (err) {
    res.status(500).send(`Error al cargar productos: ${err.message}`);
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    res.render('realTimeProducts', { title: 'Realtime Products' });
  } catch (err) {
    res.status(500).send(`Error al cargar vista realtime: ${err.message}`);
  }
});

export default router;

