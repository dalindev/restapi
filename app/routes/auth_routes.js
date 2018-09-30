let authController = require('../controllers/auth_controller.js');

module.exports = function(app, passport) {
  // --------- signup ---------
  app.get('/signup', authController.signup);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

  // --------- login ---------
  app.get('/login', authController.login);
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  // --------- logout ---------
  app.get('/logout', authController.logout);
};
