var authController = require('../controllers/auth_controller.js');

module.exports = function(app,passport){

  app.get('/signup', authController.signup);

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true // allow flash messages
  }));

  /*
    Functions
  */
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/login');
  }
}
