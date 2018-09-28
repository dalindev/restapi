// DB etc...
const config = require('./config/conf.json')

const express 		= require('express');
const session  		= require('express-session');
const cookieParser 	= require('cookie-parser');
const bodyParser 	= require('body-parser');

// log request to console
const morgan 		= require('morgan');

const app 			= express();
const port			= process.env.PORT || 3000;

// Auth
const passport 		= require('passport');

// display msg in session
const flash    		= require('connect-flash');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// ejs templating
app.set('view engine', 'ejs');

// start app =======
app.listen(port);
console.log('restapp running on port ' + port);