const fs = require('node:fs');
const path = require('path');

class ProductManager {
constructor(path) {
    this.path = path;
}

readFile = async () => {
    try {
    if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
      console.log("Contenido leído:", data); // 👀
        return data ? JSON.parse(data) : [];
    }
    return [];
    } catch (error) {
    throw error;
    }
};


writeFile = async(data) => {
    try {
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
        return data;
    } catch (error) {
        throw error;
    }
    };

getProducts = async() => {
    return this.readFile();
}

getProductById = async(id) => {
    const products = await this.readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
}

addProduct = async(product) => {
    const products = await this.readFile();

    if (products.some((p) => p.code === product.code)) {
    throw new Error(`El código '${product.code}' ya existe en otro producto`);
    }

    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
    id: newId,
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
}

updateProduct = async(id, updates) => {
    const products = await this.readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;

    const current = products[index];
    const updated = { ...current, ...updates, id: current.id };

    products[index] = updated;
    await this.writeFile(products);
    return updated;
}

deleteProduct = async(id) => {
    const products = await this.readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return false;

    products.splice(index, 1);
    await this.writeFile(products);
    return true;
}
}

module.exports = ProductManager;
