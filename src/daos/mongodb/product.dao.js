const  ProductModel = require("./models/product.model.js");
const { MongooseQueryOptions } = require("mongoose-paginate-v2");


class ProductDaoMongoDB {
    async getAll(options) {
        try {
            const { limit = 10, page = 1, sort, query } = options;

            const queryOptions = {
                limit: limit,
                page: page,
                sort: sort,
            };

            // Apply custom query if provided
            const searchQuery = query ? { title: { $regex: query, $options: "i" } } : {};

            const result = await ProductModel.paginate(searchQuery, queryOptions);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
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
