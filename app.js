var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var hbs = require('express-handlebars');

var app = express();

app.use(cors());

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//---------------------
// Routes
//---------------------
app.get("/manifest.json", function(req,res) {
  console.log("PRE-GOT")
  res.header("Content-Type", "application/manifest+json");
  res.sendFile(path.join(__dirname,"manifest.json"));
  console.log("GOT")
})

app.get("/loader.js", function(req,res) {
  res.header("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname,"loader.js"));
});

app.get("/sw.js", function(req,res) {
  res.header("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname,"sw.js"));
});

require('./routes/index')(app);
require('./routes/about')(app);
require('./routes/contact')(app);

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
