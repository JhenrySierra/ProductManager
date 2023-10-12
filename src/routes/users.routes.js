const express = require('express');
const passport = require('passport');
const controller = require('../controllers/users.controllers')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router();

router
    .get('/register', controller.registerView)
    .get('/login', controller.loginView)
    .get('/forgotPassword', controller.forgotPasswordView)
    .get('/reset-password', controller.resetPassView)

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


router.post('/reset-pass',  controller.resetPass);

router.post('/new-pass',  controller.updatePass);



module.exports = router;
