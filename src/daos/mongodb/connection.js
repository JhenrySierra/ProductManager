const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://jhenrims:Wersdfzxc21@eCommerce.v0liqcx.mongodb.net/';

async function connectToDatabase() {
    try {
        await mongoose.connect(connectionString, { dbName: 'eCommerce' });
        console.log('Conectado a la base de datos de MongoDB!');
    } catch (error) {
        console.log(error);
    }
}

connectToDatabase();
