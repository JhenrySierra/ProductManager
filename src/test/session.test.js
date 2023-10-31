const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../config.js');
require('dotenv').config(); // Added parentheses here
const User = require('../daos/mongodb/models/user.model');
const CartModel = require('../daos/mongodb/models/cart.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase, disconnectFromDatabase } = require('../daos/mongodb/connection.js');

describe('User API Tests', () => {
    let testUserId; // Store the test user ID here
    let testUserToken; // Store the test user's JWT token here

    before(async () => {
        connectToDatabase();

        // Create a test user before running tests
        const testCart = new CartModel();
        await testCart.save();

        const hashedPassword = await bcrypt.hash('testPassword', 10);

        const newUser = new User({
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            email: 'testuser@example.com',
            age: 25,
            password: hashedPassword,
            role: 'user',
            cart: testCart._id,
        });

        await newUser.save();

        // Generate a test user token for authenticated routes
        testUserToken = jwt.sign({ user: newUser }, process.env.SECRET_KEY);
        testUserId = newUser._id;
    });

    it('should register a new user', (done) => {
        const newUser = {
            first_name: 'New',
            last_name: 'User',
            username: 'newuser',
            email: 'newuser@example.com',
            age: 30,
            password: 'newPassword',
        };

        request(app)
            .post('/auth/register')
            .send(newUser)
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.have.property('message', 'User registered successfully'); // Check for the correct message
                done();
            });
    });

    it('should log in a user', (done) => {
        const loginCredentials = {
            email: 'testuser@example.com',
            password: 'testPassword',
        };

        request(app)
            .post('/auth/login')
            .send(loginCredentials)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('message', 'Login successful'); // Check for the correct message
                done();
            });
    });

    it('should send a password reset email', (done) => {
        const resetRequest = {
            email: 'testuser@example.com',
        };

        request(app)
            .post('/auth/forgotPassword') // Corrected the route
            .send(resetRequest)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('message', 'Password reset email sent successfully'); // Check for the correct message
                done();
            });
    });

    it('should update the user password', (done) => {
        const newPassword = {
            password: 'newPassword',
            confirmPassword: 'newPassword',
        };

        const token = jwt.sign({ email: 'testuser@example.com' }, process.env.SECRET_KEY);

        request(app)
            .put('/auth/update-password') // Updated the route to use a header or body
            .set('Authorization', `Bearer ${token}`) // Include the token in the headers
            .send(newPassword) // Send the new password data in the request body
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('message', 'Password reset successfully'); // Check for the correct message
                done();
            });
    });

    it('should get the current user', (done) => {
        request(app)
            .get('/auth/current')
            .set('Authorization', `Bearer ${testUserToken}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('first_name', 'Test');
                done();
            });
    });

    after(async () => {
        disconnectFromDatabase();
    });
});
