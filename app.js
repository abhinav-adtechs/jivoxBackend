var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	  = require('passport');
var config      = require('./config/database'); 
var Buyer        = require('./models/buyer'); 
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var favicon = require('serve-favicon');

var path = require('path');
var cookieParser = require('cookie-parser');

mongoose.connect(config.database);
/*require('./config/passport')(passport);*/

/*var MongoClient = require("mongodb").MongoClient, assert = require("assert") ;
var url = 'mongodb://jordiie11:password11@ds145315.mlab.com:45315/jivoxdb';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected succesfully to server");

  db.close();
});*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
  res.send('Hello! The API is at  Testcode...:' + port + '/api');
});


////////
var apiRoutes = express.Router();

apiRoutes.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.displayname) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newBuyer = new Buyer({
      username: req.body.username,
      password: req.body.password,
      displayname: req.body.displayname
    });
    // save the user
    newBuyer.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  Buyer.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});









///////






app.use('/api', apiRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
