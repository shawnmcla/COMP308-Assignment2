/**
 * File name: index.js
 * Author: Shawn McLaughlin <shawnmcdev@gmail.com>
 * Site: https://shawnmcla-portfolio2.herokuapp.com/
 * Description: Routing instructions for /contacts URLs
 */

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define user model
let UserModel = require('../models/users');
let User = UserModel.User;
//define contact model
let Contact = require('../models/contacts');

// function to check if the user is authenticated
function requireAuth(req, res, next) {
    //check if user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

/* GET /contacts - contacts List */
router.get('/', requireAuth, (req, res, next) => {
    //find all contacts in the contacts collection
    Contact.find({}).sort({ name: 1 }).exec((err, contacts) => {
        if (err) return console.error(err);
        else {
            res.render('contacts/index', {
                title: 'contacts',
                contacts: contacts,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});


//  GET the contact Details page in order to add a new contact
router.get('/add', requireAuth, (req, res, next) => {
    res.render('contacts/details', {
        title: "Add a new contact",
        contacts: '',
        displayName: req.user ? req.user.displayName : ''
    });
});

// POST process the contact Details page and create a new contact - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    let newcontact = Contact({
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email
    });

    Contact.create(newcontact, (err, contact) => {
        if (err) {
            console.log(err);
            res.end("Error: " + err.message);
            return;
        } else {
            res.redirect('/contacts');
        }
    });
});


/* GET edit - show current contact to edit */
router.get('/:id', requireAuth, (req, res, next) => {
    try {
        //get a reference to the contact id
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
        //find contact to edit by its id
        Contact.findById(id, (err, contacts) => {
            if (err) {
                console.error(err);
                res.end(error);
            }
            else {
                //show the edit view
                res.render('contacts/details', {
                    title: 'contact Details',
                    contacts: contacts,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect('/errors/404');
    }
});

/* POST edit - process the contact to edit */
router.post('/:id', requireAuth, (req, res, next) => {
    //get a reference to the contact id
    let id = req.params.id;

    let newcontact = new Contact({
        _id: id,
        name: req.body.name,
        number: req.body.number,
        email: req.body.email
    });

    Contact.update({ _id: id }, newcontact, (err) => {
        if (err) {
            console.log(err);
            res.end(error);
        } else {
            res.redirect('/contacts');
        }
    });
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
    // get a reference to the id from the url
    let id = req.params.id;

    Contact.remove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the contacts list
            res.redirect('/contacts');
        }
    });
});

module.exports = router;