import fs from "fs";
import fsPromises from "fs/promises";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
    constructor(path) {
    this.path = path;
    }

    readFile = async () => {
    try {
        if (fs.existsSync(this.path)) {
        const data = await fsPromises.readFile(this.path, "utf-8");
        return data ? JSON.parse(data) : [];
        }
        return [];
    } catch (error) {
        throw error;
    }
    };

    writeFile = async (data) => {
    try {
        await fsPromises.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
        return data;
    } catch (error) {
        throw error;
    }
    };

    getProducts = async () => {
    return this.readFile();
    };

    getProductById = async (id) => {
    const products = await this.readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
    };

    addProduct = async (product) => {
    const products = await this.readFile();

    if (products.some((p) => p.code === product.code)) {
        throw new Error(`El código '${product.code}' ya existe en otro producto`);
    }

    const newProduct = {
        id: uuidv4(),
        title: product.title,
        description: product.description,
        code: product.code,
        price: Number(product.price),
        stock: Number(product.stock),
        status: Boolean(product.status ?? true),
        category: product.category,
        thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : [],
    };

    products.push(newProduct);
    await this.writeFile(products);
    return newProduct;
    };

    updateProduct = async (id, updates) => {
    const products = await this.readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;

    const current = products[index];
    const updated = { ...current, ...updates, id: current.id };

    products[index] = updated;
    await this.writeFile(products);
    return updated;
    };

    deleteProduct = async (id) => {
    const products = await this.readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return false;

    products.splice(index, 1);
    await this.writeFile(products);
    return true;
    };
}

export default ProductManager;

