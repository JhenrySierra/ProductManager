const mongoose = require('mongoose');
const logger = require('../../middlewares/logger')
require('dotenv').config();

const connectionString = process.env.MONGO_ATLAS_URL;

async function connectToDatabase() {
    try {
        await mongoose.connect(connectionString, { dbName: 'eCommerce' });
        logger.info('Conectado a la base de datos de MongoDB!');
    } catch (error) {
        logger.error(error);
    }
}

connectToDatabase();
