const mongoose = require('mongoose');
require('dotenv/config') ;

const connectionString = process.env.MONGO_ATLAS_URL;

async function connectToDatabase() {
    try {
        await mongoose.connect(connectionString, { dbName: 'eCommerce' });
        console.log('Conectado a la base de datos de MongoDB!');
    } catch (error) {
        console.log(error);
    }
}

connectToDatabase();
