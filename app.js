"use strict";

// DB etc...
const config        = require('./config/conf.json')

const express       = require('express');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const cookie        = require('cookie');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');

const app           = express();
const port          = process.env.PORT || 3000;

// Auth
const passport      = require('passport');

// display msg in session
const flash         = require('connect-flash');


/* ------------------------------------------- */
if(process.env.NODE_ENV == undefined) {
  process.env.NODE_ENV = 'development';
  console.log(`
================================================
|
|   Environment missing!
|
|   running default : development
|
|   NODE_ENV=development node app.js
|
================================================
`   );
}

// log request to console
app.use(morgan('dev'));
// public folder
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// to support JSON-encoded bodies (for auth)
app.use(cookieParser());

 // For Passport
app.use(session({
  secret: config[process.env.NODE_ENV].session_secret,
  resave: true,
  saveUninitialized:true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()) // flash messages stored in session


/**
 *  view
 */
app.set('view engine', 'ejs');
app.set('views', './app/views')


/**
 *  models
 */
const models = require("./app/models");


/**
 *  routes
 */
 //load passport strategies
const passportRoute = require('./app/config/passport/passport.js')(passport,models.User);

const authRoute = require('./app/routes/auth_routes.js')(app,passport);

const apiV1 = require('./app/routes/v1_0/messages_routes.js')(app);


/**
 *  database
 */
models.sequelize.sync().then(function(){
  console.log('Database Connected!')
}).catch(function(err){
  console.log(err, "Something went wrong with the Database Update!")
});


/**
 *  home page
 */
app.get('/', function (req, res) {
  // if user is auth in the session, carry on
  if (req.isAuthenticated()) {
    // load the index.ejs
    res.render('index.ejs', {
      user: req.user
    })
  } else {
    res.render('index.ejs', {
      user: false
    })
  }
});


// Route not found (404)
app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});


// other error
app.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
});


/* Start app --------------------------------- */
var server = app.listen(port, '127.0.0.1', function () {
  let host = server.address().address
  let port = server.address().port

  console.log(`${process.env.NODE_ENV} running on http://${host}:${port}`);
});

