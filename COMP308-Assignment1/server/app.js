/**
 * File name: app.js
 * Author: Shawn McLaughlin <shawnmcdev@gmail.com>
 * Site: https://shawnmcla-portfolio2.herokuapp.com/
 * Description: Web App entry point. Initializes modules.
 */

// include all of our middleware - internal/external modules
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
//auth modules
let session = require('express-session');
let passport = require('passport');
let passportlocal = require('passport-local');
let LocalStrategy = passportlocal.Strategy;
let flash = require('connect-flash'); //display errors/login messages

// adding the mongoose module
let mongoose = require('mongoose');

//mongodb URI
let dbConfig = require('./config/db');

// connect to mongodb and use the 'games' database
mongoose.connect(process.env.URI || dbConfig.URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB");
});

let index = require('./routes/index');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, '..', 'client', 'Assets', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client')));


// setup sessions
app.use(session({
  secret: "CommunismWillPrevail",
  saveUninitialized: true,
  resave: true
}));

//initialize passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

//Passport User Configuration
let UserModel = require('./models/users');
let User = UserModel.User;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Handle 404 Errors
app.use(function (req, res) {
  res.status(400);
  res.render('errors/404', {
    title: '404: File Not Found'
  });
});

// Handle 500 Errors
app.use(function (error, req, res, next) {
  res.status(500);
  res.render('errors/500', {
    title: '500: Internal Server Error',
    error: error
  });
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error', { 'title': 'Error' });
});

module.exports = app;
