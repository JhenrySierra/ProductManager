const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../daos/mongodb/models/user.model');
const isAuthenticated = require('../middlewares/isAuthenticated');
const GitHubStrategy = require('passport-github2').Strategy;

const router = express.Router();

// Set up Passport Local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

//Passport Github strategy
passport.use(new GitHubStrategy({
    clientID: 'Iv1.90fd71a6cca5ab8e',
    clientSecret: 'e7e4db8d56ffbda5382b80c408cecc590be39e5b',
    callbackURL: "http://localhost:8080/auth/github/callback" // Use your callback URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user exists in your database based on the GitHub email
            const existingUser = await User.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                // If user exists, return the user
                return done(null, existingUser);
            }

            // If user doesn't exist, create a new user in your database
            const newUser = new User({
                email: profile.emails[0].value || 'default@example.com',
                username: profile.username || 'defaultUsername',
                password: 'defaultPassword',
                first_name: 'Default', // Add this line for the first name
                last_name: 'User', // Add this line for the last name
                age: 0, // Add this line for the age
                role: 'user'
            });

            await newUser.save();
            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    }
));

router.get('/github', passport.authenticate('github', {scope: ['user:email']}));

// GitHub callback route
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to a secure route or send a response
        res.redirect('/products');
    }
);
//----------------end github strategy-------------//

// Route to render the registration form view

const registerView = (req, res) => {
    res.render('register', {});
}

// Route to render the login form view

const loginView = (req, res) => {
    res.render('login', {});
};
// Route to handle user registration

const register = async (req, res) => {
    try {
        const { first_name, last_name, username, email, age, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            username,
            email,
            age,
            password: hashedPassword,
            role: 'user' // Default role
        });

        await newUser.save();
        res.status(201).send('User registered successfully!');
    } catch (err) {
        res.status(400).send('Error registering user.', err);
    }
};


// Add the /current route

const current = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(currentUser);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching current user' });
    }
}

// Route to handle user logout
const logout = (req, res) => {
    req.logout(() => {
        res.redirect('/auth/login');
    });
};

module.exports = {
    registerView,
    loginView,
    register,
    current,
    logout
};