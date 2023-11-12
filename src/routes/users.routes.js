const express = require('express');
const passport = require('passport');
const controller = require('../controllers/users.controllers')
const isAuthenticated = require('../middlewares/isAuthenticated')
const upload = require('../middlewares/multer');


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

// Update role
router.put('/premium/:uid/:newRole', async (req, res) => {
    const { uid, newRole } = req.params;

    try {
        const result = await controller.updateRole(uid, newRole);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Route to handle documents uploads

router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    try {
        const userId = req.params.uid;
        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.filename,
            folder: req.body.folder || 'documents'
        }));

        // Update the user's documents array
        const user = await User.findByIdAndUpdate(userId, { $push: { documents } }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Documents uploaded successfully', user });
    } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
