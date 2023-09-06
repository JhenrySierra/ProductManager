const express = require('express');
const passport = require('passport');
const controller = require('../controllers/users.controllers')

const router = express.Router();

router
    .get('/register', controller.registerView)
    .get('/login', controller.loginView)
    .post('/register', controller.register)
    .get('/current', controller.current)
    .get('/logout', controller.logout);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',   
    failureRedirect: '/auth/login', 
    failureFlash: true
}));

router.post('/login', (req, res) => {
    req.session.username = req.user.username;
    req.session.role = req.user.role;
});

module.exports = router;
