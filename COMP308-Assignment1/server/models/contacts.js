/**
 * File name: contacts.js
 * Author: Shawn McLaughlin <shawnmcdev@gmail.com>
 * Site: https://shawnmcla-portfolio2.herokuapp.com/
 * Description: Defines mongoose schema for Contact documents.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//create a model class
let contactsSchema = Schema({
    name: String,
    number: String,
    email: String
},
    {
        collection: "contacts"
    });


exports.Contact = mongoose.model('contact', usersSchema);