const fs = require('fs');

class ProductManager {
    constructor() {
        this.products = [];
        this.lastProductId = 0;
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

        fs.writeFile('products.json', JSON.stringify(this.products), (err) => {
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
        this.products = products; // Update the 'products' array
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

        fs.writeFile('products.json', JSON.stringify(this.products), (err) => {
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

manager.updateProduct(2, 'title', 'Updated Wireless Earbuds')