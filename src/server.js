const express = require('express');
const { errorHandler } = require('./middlewares/errorHandler.js');
const morgan = require('morgan');
require('./daos/mongodb/connection.js');
const productRouter = require('./routes/products.routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/products', productRouter);

app.listen(8080, () => {
    console.log('🚀 Server listening on port 8080');
});