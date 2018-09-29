var authController = require('../controllers/auth_controller.js');

module.exports = function(app,passport){

  // --------- signup ---------
  app.get('/signup', authController.signup);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // --------- login ---------
  app.get('/login', authController.login);
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }),
  function (req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3
    } else {
      req.session.cookie.expires = false
    }
    res.redirect('/')
  });

  // l--------- ogout ---------
  app.get('/logout',authController.logout);

  /**
   * Functions
   */
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
}
