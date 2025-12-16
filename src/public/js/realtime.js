
const socket = io();

const productsList = document.getElementById('productsList');
const productForm = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteForm');

socket.on('products', (products) => {
    productsList.innerHTML = '';
    products.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.id} - ${p.title} - $${p.price} (stock: ${p.stock})`;
    productsList.appendChild(li);
    });
});

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const product = Object.fromEntries(formData.entries());

    product.price = Number(product.price);
    product.stock = Number(product.stock);

    socket.emit('createProduct', product);
    productForm.reset();
});

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    socket.emit('deleteProduct', id);
    deleteForm.reset();
});

