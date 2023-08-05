const service = require("../services/product.services.js");
const path = require('path');
const exphbs = require('express-handlebars');

const getAll = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
            sort: sort === 'desc' ? 'desc' : 'asc',
            query: query || undefined,
        };
        const result = await service.getAll(options);
        
        return {
            status: 'success',
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: options.page > 1 ? options.page - 1 : null,
            nextPage: options.page < result.totalPages ? options.page + 1 : null,
            page: options.page,
            hasPrevPage: options.page > 1,
            hasNextPage: options.page < result.totalPages,
            prevLink: options.page > 1 ? `/products?limit=${options.limit}&page=${options.page - 1}` : null,
            nextLink: options.page < result.totalPages ? `/products?limit=${options.limit}&page=${options.page + 1}` : null,
        };


    } catch (error) {
        throw error;
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prod = await service.getById(id);
        if (!prod) res.status(404).json({ msg: "Product not found!" });
        else res.json(prod);
    } catch (error) {
        next(error.message);
    }
};

const create = async (req, res, next) => {
    try {
        // const { name, price, description, stock } = req.body;
        const newProd = await service.create(req.body);
        if (!newProd) res.status(404).json({ msg: "Validation Error!" });
        else res.json(newProd);
    } catch (error) {
        next(error.message);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prodUpd = await service.update(id, req.body);
        res.json(prodUpd);
    } catch (error) {
        next(error.message);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prodDel = await service.remove(id);
        res.json(prodDel);
    } catch (error) {
        next(error.message);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
