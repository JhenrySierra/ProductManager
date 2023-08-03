const  ProductModel = require("./models/product.model.js");

class ProductDaoMongoDB {
    async getAll() {
        try {
            const response = await ProductModel.find({});
            if (response.length === 0) {
                console.log("No products found in the database."); // Log a message if the array is empty
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            const response = await ProductModel.findById(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async create(obj) {
        try {
            const response = await ProductModel.create(obj);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj) {
        try {
            const response = await ProductModel.findByIdAndUpdate(id, obj, { new: true });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id) {
        try {
            const response = await ProductModel.findByIdAndDelete(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ProductDaoMongoDB;
