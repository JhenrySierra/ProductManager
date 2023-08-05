const express = require('express');
const { errorHandler } = require('./middlewares/errorHandler.js');
const morgan = require('morgan');
require('./daos/mongodb/connection.js');
const productRouter = require('./routes/products.routes.js');
const exphbs = require('express-handlebars');
const path = require('path');

const cartRouter = require('./routes/carts.routes.js');
const viewRouter = require('./views/views.routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/products', viewRouter);



// Set up Handlebars as the view engine
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.listen(8080, () => {
    console.log('🚀 Server listening on port 8080');
});