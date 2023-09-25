const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

require('./daos/mongodb/connection.js');
const isAuthenticated = require('./middlewares/isAuthenticated.js');

const productRouter = require('./routes/products.routes.js');
const cartRouter = require('./routes/carts.routes.js');
const viewRouter = require('./views/views.routes.js');
const userRouter = require('./routes/users.routes.js')
const mockingProducts = require('./routes/mocking.routes.js')

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
const errorHandler = require('./middlewares/errorHandler.js');

// Middleware for sessions
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandler);

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use('/products', isAuthenticated, viewRouter);
app.use('/auth', userRouter)  
app.use('/cart', cartRouter)

app.get('/mockingproducts', mockingProducts);

// Set up Handlebars as the view engine
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});