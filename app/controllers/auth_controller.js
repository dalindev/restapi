var exports = module.exports = {}

exports.signup = function(req,res){

  res.render('pages/signup', { message: req.flash('signupMessage')});

}
