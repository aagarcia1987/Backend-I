import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
app.set('io', io);

const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    try {
    const products = await productManager.getProducts();
    socket.emit('products', products);
    } catch (err) {
    console.error('Error cargando productos:', err.message);
    }

    socket.on('createProduct', async (data) => {
    try {
        await productManager.addProduct(data);
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
    } catch (err) {
        console.error('Error creando producto:', err.message);
        socket.emit('error', err.message);
    }
    });

    socket.on('deleteProduct', async (id) => {
    try {
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
    } catch (err) {
        console.error('Error eliminando producto:', err.message);
        socket.emit('error', err.message);
    }
    });
});

export default app;
