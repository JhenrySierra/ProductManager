// Check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
        // User is authenticated, redirect to the products page
        next();
    } else {
        // User is not authenticated, redirect to the login page
        res.redirect('/auth/login'); 
    }
};

module.exports = isAuthenticated;