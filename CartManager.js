const fs = require('node:fs');

class CartManager {
constructor(path) {
    this.path = path;
}

readFile = async () => {
    try {
        if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return data ? JSON.parse(data) : [];
        }
        return [];
    } catch (error) {
        throw error;
    }
    };

writeFile = async (data) => {
    try {
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
        return data;
    } catch (error) {
        throw error;
    }
    };

createCart = async() => {
    const carts = await this.readFile();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this.writeFile(carts);
    return newCart;
}

getCartById = async(id) => {
    const carts = await this.readFile();
    return carts.find((c) => String(c.id) === String(id)) || null;
}

getAllCarts = async () => {
    return this.readFile();
};

addProductToCart = async(cid, pid) => {
    const carts = await this.readFile();
    const index = carts.findIndex((c) => String(c.id) === String(cid));
    if (index === -1) return null;

    const cart = carts[index];
    const existing = cart.products.find((p) => String(p.product) === String(pid));

    if (existing) {
    existing.quantity += 1;
    } else {
    cart.products.push({ product: pid, quantity: 1 });
    }

    carts[index] = cart;
    await this.writeFile(carts);
    return cart;
    }
}

module.exports = CartManager;
