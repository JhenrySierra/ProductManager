const express = require('express');
const router = express.Router();
const User = require('../daos/mongodb/models/user.model'); // Import the User model

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
        // Extract user data from the request body
        const { username, email, password } = req.body;

        // Create a new user using the User model
        const newUser = new User({
            username,
            email,
            password,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).send('User registered successfully!');
    } catch (err) {
        res.status(400).send('Error registering user.');
    }
});

// Route to handle user login
router.post('/login', async (req, res) => {
    try {
        // Extract user data from the request body
        const { email, password } = req.body;

        // Find the user with the given email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Compare the provided password with the user's hashed password
        if (user.password !== password) {
            return res.status(401).send('Invalid password.');
        }

        // If login is successful, set up the session with the user's ID and get role
        req.session.username = user.username;
        req.session.role = user.role;

        // If login is successful, redirect to products view
        res.redirect('/products');
        
    } catch (err) {
        res.status(400).send('Error logging in.');
    }
});

module.exports = router;
