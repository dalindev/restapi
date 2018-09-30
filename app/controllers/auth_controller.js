'use strict';


module.exports.signup = function(req, res) {
  res.render(
    'pages/signup',
    {
      message: req.flash('signupMessage'),
    }
  );
};

module.exports.login = function(req, res) {
  res.render(
    'pages/login',
    {
      message: req.flash('loginMessage'),
    }
  );
};

module.exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};
