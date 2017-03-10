/**
 * File name: users.js
 * Author: Shawn McLaughlin <shawnmcdev@gmail.com>
 * Site: https://shawnmcla-portfolio2.herokuapp.com/
 * Description: Defines mongoose schema for User documents.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

//create a model class
let usersSchema = Schema({
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'Username is required.'
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'Email is required.'
    },
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display name is required.'
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    }
},
    {
        collection: "users"
    });

let options = ({ missingPasswordError: "Wrong Password" });

usersSchema.plugin(passportLocalMongoose, options);

exports.User = mongoose.model('user', usersSchema);