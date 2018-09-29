// DB etc...
const config = require('./config/conf.json')

const express 		= require('express');
const session  		= require('express-session');
const cookieParser 	= require('cookie-parser');
const cookie     	= require('cookie');
const bodyParser 	= require('body-parser');
const morgan 		= require('morgan');

const app 			= express();
const port			= process.env.PORT || 3000;

// Auth
const passport 		= require('passport');

// display msg in session
const flash    		= require('connect-flash');

/* ------------------------------------------- */
if(process.env.NODE_ENV == undefined) {
	process.env.NODE_ENV = 'development';
	console.log(`
================================================
|
| 	Environment missing!
|
|	running default : development
|
| 	NODE_ENV=development node app.js
|
================================================
`	);
}

// log request to console
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// to support JSON-encoded bodies (fir auth)
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

// ejs templating
app.set('view engine', 'ejs');
// view
app.set('views', './app/views')

app.use(express.static('public'))


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

/* Start app --------------------------------- */
var server = app.listen(port, '127.0.0.1', function () {
	let host = server.address().address
	let port = server.address().port

	console.log(`${process.env.NODE_ENV} running on http://${host}:${port}`
	);
});

