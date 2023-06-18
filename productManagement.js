const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.products = [];
        this.lastProductId = 0;
        this.path = path.join(__dirname, 'products.json');
    }

    addProduct(product) {
        if (!product.code || !product.title || !product.description || !product.price || !product.thumbnail || !product.stock) {
            console.log('All fields are mandatory.');
            return;
        }

        const existingProduct = this.products.find(p => p.code === product.code);
        if (existingProduct) {
            console.log('Product with the same code already exists.');
            return;
        }

        const newProduct = {
            ...product,
            id: ++this.lastProductId,
        };

        this.products.push(newProduct);

        fs.writeFile(this.path, JSON.stringify(this.products), (err) => {
            if (err) {
                console.log('Error saving products:', err);
            } else {
                console.log('Product added successfully.');
            }
        });
    }

    getProducts() {
        if (!fs.existsSync(this.path)) {
            return [];
        }

        const productsData = fs.readFileSync(this.path, 'utf8');
        if (!productsData) {
            return [];
        }

        const products = JSON.parse(productsData);
        this.products = products; 
        return products;
    }

    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);
        if (product) {
            return product;
        } else {
            console.log('Product not found.');
        }
    }

    updateProduct(productId, field, value) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            console.log('Product not found.');
            return;
        }

        this.products[productIndex][field] = value;

        fs.writeFile(this.path, JSON.stringify(this.products), (err) => {
            if (err) {
                console.log('Error updating product:', err);
            } else {
                console.log('Product updated successfully.');
            }
        });
    }

    deleteProduct(productId) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            console.log('Product not found.');
            return;
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log('Product deleted successfully:', deletedProduct);
        } catch (err) {
            console.log('Error deleting product:', err);
        }
    }
}

const manager = new ProductManager();

manager.addProduct({
    code: 'P1',
    title: 'Phone Case',
    description: 'Protective phone case for iPhone and Android smartphones',
    price: 9.99,
    thumbnail: 'product1.jpg',
    stock: 10
});

manager.addProduct({
    code: 'P2',
    title: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds for music and calls',
    price: 19.99,
    thumbnail: 'product2.jpg',
    stock: 5
});

manager.addProduct({
    code: 'P3',
    title: 'Charging Cable',
    description: 'Durable and fast-charging USB-C charging cable',
    price: 29.99,
    thumbnail: 'product3.jpg',
    stock: 3
});

manager.addProduct({
    code: 'P4',
    title: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with excellent sound quality',
    price: 39.99,
    thumbnail: 'product4.jpg',
    stock: 8
});

manager.addProduct({
    code: 'P5',
    title: 'Smartwatch',
    description: 'Feature-packed smartwatch for fitness and notifications',
    price: 79.99,
    thumbnail: 'product5.jpg',
    stock: 2
});

manager.addProduct({
    code: 'P6',
    title: 'Gaming Mouse',
    description: 'Ergonomic gaming mouse with customizable buttons',
    price: 49.99,
    thumbnail: 'product6.jpg',
    stock: 6
});

manager.addProduct({
    code: 'P7',
    title: 'Portable Power Bank',
    description: 'High-capacity power bank for charging devices on the go',
    price: 24.99,
    thumbnail: 'product7.jpg',
    stock: 12
});

manager.addProduct({
    code: 'P8',
    title: 'Bluetooth Headphones',
    description: 'Wireless Bluetooth headphones with noise cancellation',
    price: 69.99,
    thumbnail: 'product8.jpg',
    stock: 4
});

manager.addProduct({
    code: 'P9',
    title: 'Wireless Mouse',
    description: 'Wireless mouse with precise tracking and long battery life',
    price: 19.99,
    thumbnail: 'product9.jpg',
    stock: 9
});

manager.addProduct({
    code: 'P10',
    title: 'External Hard Drive',
    description: 'Portable external hard drive for data backup and storage',
    price: 89.99,
    thumbnail: 'product10.jpg',
    stock: 7
});


manager.updateProduct(2, 'title', 'Updated Wireless Earbuds');

module.exports = ProductManager;
