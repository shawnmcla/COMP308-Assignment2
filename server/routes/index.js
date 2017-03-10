/**
 * File name: index.js
 * Author: Shawn McLaughlin <shawnmcdev@gmail.com>
 * Site: https://shawnmcla-portfolio2.herokuapp.com/
 * Description: Routing instructions for URLs
 */

// Modules for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define user models
let UserModel = require('../models/users');
let User = UserModel.User;

// function to check if the user is authenticated
function requireAuth(req, res, next) {
  //check if user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. */
router.get('/', (req, res, next) => {
  let currentDate = new Date();
  res.render('content/index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET contact page */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET login page */
router.get('/login', (req, res, next) => {
  //check to see if user is not already logged in
  if (!req.user) {
    res.render('auth/login', {
      title: 'Login',
      messages: req.flash('error'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/'); // redirect to index 
  }
});
// POST /login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/contacts',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET /register
router.get('/register', (req, res, next) => {
  //check if user not already logged in
  if (!req.user) {
    res.render('auth/register', {
      title: 'Register',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  }
  else {
    res.redirect('/');
  }
});

// POST /register
router.post('/register', (req, res, next) => {
  User.register(
    new User(
      {
        username: req.body.username,
        //password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
      }),
    req.body.password,
    (err) => {
      if (err) {
        console.log('Error registering user.');
        console.log(err);
        if (err.name == "UserExistsError") {
          req.flash('registerMessage', "Registration Error: User already exists!");
        }
        res.render('auth/register', {
          title: 'Register',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      // if registration is successful
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/contacts');
      });
    });
});

// GET /logout - logout the user and redir. to homepage
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
