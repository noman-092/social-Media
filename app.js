var createError = require('http-errors');
require('dotenv').config({path:'./.env'});
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// db connection
const db = require("./models/database");
db.connect();

// fileUpload
 const fileUpload = require("express-fileupload")

var userRoutes = require("./routes/users.routes");
var indexRoutes = require("./routes/index.routes");
var postRoutes = require("./routes/posts.routes");

var app = express();

const session=require('express-session');
const passport=require('passport');
const userCollection = require('./models/user.schema');
const postCollection = require('./models/posts.schema');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// fileUpload
app.use(fileUpload({
    limits:{fileSize:50*1024*1024},
  })
);

app.use(session({
  secret:process.env.secret,
  resave:false,
  saveUninitialized:true,
})
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userCollection.serializeUser());
passport.deserializeUser(userCollection.deserializeUser())


app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
