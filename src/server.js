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
const logger = require('./middlewares/logger.js');

const loggerTest = require('./middlewares/logger.test.js')

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
const errorHandler = require('./middlewares/errorHandler.js');



// Swagger options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My eCommerce APIs',
            version: '1.0.0',
            description: 'This are the docs explaining the functionalities for my eCommerce APIs',
        },
    },
    servers: [
        {
            url: 'http://localhost:8080'  // Define the base URL of your API
        }
    ],
    // API routes to be documented
    apis: ['src/docs/*.yml'], // Add the paths to your route and documentation files here
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.get('/loggerTest', loggerTest)

// Set up Handlebars as the view engine
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT;

app.listen(port, () => {
    logger.info(`🚀 Server listening on port ${port}`);
});