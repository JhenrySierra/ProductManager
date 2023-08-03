const ProductDaoMongoDB = require("../daos/mongodb/product.dao.js");
const prodDao = new ProductDaoMongoDB();

// import { __dirname } from "../utils.js";
// import ProductDaoFS from "../daos/filesystem/product.dao.js";
// const prodDao = new ProductDaoFS(__dirname+'/daos/filesystem/products.json');

const getAll = async () => {
    try {
        const response = await prodDao.getAll();
        console.log(response, "product.service")
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getById = async (id) => {
    try {
        const item = await prodDao.getById(id);
        if (!item) return false;
        else return item;
    } catch (error) {
        console.log(error);
    }
}

const create = async (obj) => {
    try {
        const newProd = await prodDao.create(obj);
        if (!newProd) return false;
        else return newProd;
    } catch (error) {
        console.log(error);
    }
}

const update = async (id, obj) => {
    try {
        const item = await prodDao.update(id, obj);
        return item;
    } catch (error) {
        console.log(error);
    }
}

const remove = async (id) => {
    try {
        const item = await prodDao.delete(id);
        return item;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
