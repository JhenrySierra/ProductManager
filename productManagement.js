class ProductManager {
    constructor() {
        this.products = [];
        this.lastProductId = 0; //used to generate an ID that auto-increments in 1
    }

    //Method to add a product (it makes all fields mandatory)
    addProduct(product) {
        if (!product.code || !product.title || !product.description || !product.price || !product.thumbnail || !product.stock) {
            console.log('All fields are mandatory.');
            return;
        }

        //Returns an error when the new product is added with a code that is already used in the array
        const existingProduct = this.products.find(p => p.code === product.code);
        if (existingProduct) {
            console.log('Product with the same code already exists.');
            return;
        }

        //Adds an auto-generated ID that increments in 1 based on lastProductId
        const newProduct = {
            ...product,
            id: ++this.lastProductId,
        };

        //Push the newProduct to the array products
        this.products.push(newProduct);
        console.log('Product added successfully.');
    }

    //Gets all products in the array
    getProducts() {
        return this.products;
    }

    //Gets products by ID (the one auto-generated)
    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);
        if (product) {
            return product;
        } else {
            console.log('Product not found.');
        }
    }
}

// Instancing the class

const manager = new ProductManager();

manager.addProduct({
    code: 'P1',
    title: 'Phone Case',
    description: 'Protective phone case for iPhone and Android smartphones',
    price: 9.99,
    thumbnail: 'product1.jpg',
    stock: 10
});
// Output: Product added successfully.

manager.addProduct({
    code: 'P2',
    title: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds for music and calls',
    price: 19.99,
    thumbnail: 'product2.jpg',
    stock: 5
});
// Output: Product added successfully.

manager.addProduct({
    code: 'P3',
    title: 'Charging Cable',
    description: 'Durable and fast-charging USB-C charging cable',
    price: 29.99,
    thumbnail: 'product3.jpg',
    stock: 3
});
// Output: Product added successfully.
console.log('Testing method getProducts, returns all Products added in the array')
console.log(manager.getProducts());
// Output: returns all Products added in the array
console.log('Testing method getProductById, returns the product with the ID 2 that was automatically generated.')
console.log(manager.getProductById(2));
// Output: returns the product with the ID 2 that was automatically generated.