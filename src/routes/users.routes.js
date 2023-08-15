const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../daos/mongodb/models/user.model'); // Import the User model
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

// Set up Passport Local strategy
passport.use(new LocalStrategy(
    async (email, password, done) => { 

        try {
            const user = await User.findOne({ email }); 

            if (!user) {
                return done(null, false, { message: 'Invalid email' }); 
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: 'Invalid password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


// Route to render the registration form view
router.get('/register', (req, res) => {
    res.render('register', {});
});

// Route to render the login form view
router.get('/login', (req, res) => {
    res.render('login', {});
});

// Route to handle user registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).send('User registered successfully!');
    } catch (err) {
        res.status(400).send('Error registering user.');
    }
});

// Route to handle user login using Passport Local
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',   // Redirect after successful login
    failureRedirect: '/auth/login', // Redirect after failed login
    failureFlash: true               // Enable flash messages for errors
}));

// Protected route that requires authentication
router.get('/', isAuthenticated, (req, res) => {
    res.send('Welcome to the dashboard, ' + req.user.username);
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
