const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://jhenrims:Wersdfzxc21@ecommerce.v0liqcx.mongodb.net/';

async function connectToDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Conectado a la base de datos de MongoDB!');
    } catch (error) {
        console.log(error);
    }
}

// Call the async function to establish the connection
connectToDatabase();
