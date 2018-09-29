var authController = require('../controllers/auth_controller.js');

module.exports = function(app,passport){

  app.get('/signup', authController.signup);

  /*
    Functions
  */
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/login');
  }
}
