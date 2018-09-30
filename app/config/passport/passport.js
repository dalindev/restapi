// load bcrypt
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {
  let User = user;
  let LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    let generateHash = function(password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    User.findOne({where: {email: email}}).then(function(user) {
      if (user) {
        return done(null, false,
          req.flash('signupMessage', 'That Email is already exist.'));
      } else {
        let userPassword = generateHash(password);
        let data = {
          email: email,
          password: userPassword,
          first_name: req.body.firstname,
          last_name: req.body.lastname,
        };

        User.create(data).then(function(newUser, created) {
          return !newUser ? done(null, false) : done(null, newUser);
        });
      }
    });
  }));


  // LOCAL login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    let User = user;
    let isValidPassword = function(userpass, password) {
      return bCrypt.compareSync(password, userpass);
    };

    User.findOne({where: {email: email}}).then(function(user) {
      if (!user || !isValidPassword(user.password, password)) {
        return done(
          null,
          false,
          req.flash(
            'loginMessage',
            'Incorrect password or Email does not exist'));
      }
      let userinfo = user.get();
      return done(null, userinfo);
    }).catch(function(err) {
      console.log('User Error:', err);
      return done(null, false,
        req.flash('loginMessage', 'Something went wrong with your Login'));
    });
  }));
};
