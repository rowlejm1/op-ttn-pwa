var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//---------------------
// Routes
//---------------------

app.get("/loader.js", function(req,res) {
  res.header("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname,"loader.js"));
});

app.get("/sw.js", function(req,res) {
  res.header("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname,"sw.js"));
});

app.get("/", function(req,res) {
  res.sendFile(path.join(__dirname,"views/index.html"));
});

app.get("/about", function(req,res) {
  res.sendFile(path.join(__dirname,"views/about.html"));
});

app.get("/contact", function(req,res) {
  res.sendFile(path.join(__dirname,"views/contact.html"));
});

//require('./routes/index')(app);
//require('./routes/about')(app);
//require('./routes/contact')(app);

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
  res.sendFile(path.join(__dirname,"views/error.html"));
});

module.exports = app;
