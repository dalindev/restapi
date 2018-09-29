var exports = module.exports = {}

exports.signup = function(req,res){
  res.render(
    'pages/signup',
    {
      message: req.flash('signupMessage')
    }
  );
}

exports.login = function(req,res){
  res.render(
    'pages/login',
    {
      message: req.flash('loginMessage')
    }
  );
}

exports.logout = function(req,res){
  req.session.destroy(function(err) {
    res.redirect('/');
  });
}