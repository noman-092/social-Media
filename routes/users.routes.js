var express = require('express');
var router = express.Router();

const passport = require('passport');
const localStrategy=require('passport-local')
const userCollection = require('../models/user.schema');

passport.use(new localStrategy(userCollection.authenticate()));


module.exports = router;
