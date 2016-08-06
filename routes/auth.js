var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://jordiie11:password11@ds145315.mlab.com:45315/jivoxdb';
var bodyParser = require("body-parser");
var app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var emailId, username, password, userType ;

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/ ;
    return re.test(email);
}


router.get("/", function(req,res){
    res.send("Auth Module");
});

router.post("/loginbuyer", function(req, res){
    console.log(JSON.stringify(req.body));
   username = req.body.username ;
   password = req.body.password ;
   
   if(username.length!=0 && password.length > 6 && password.length < 32){
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            findUser(db, function() {
            db.close();
        });
    });
   }
   
});



var findUser = function(db, callback) {
   var cursor = db.collection('users').find({"username": username}, {"password": password});
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else if(err){
          console.log(err);
      } else{
          callback();
      }
      
   });
};


router.post("/signup", function(req, res){
     console.log(JSON.stringify(res.body)) ;
     emailId = res.body.emailId ;
     username = res.body.username ;
     password = res.body.password ;
     userType = res.body.userType ;
     
     if(!validateEmail(emailId)){
         res.status(403).json({
                 "message":"Invalid emailId"
             }) ;
     }else if(username.length == 0){
        res.status(403).json({
                "message" : "Username not acceptable"
        }); 
     }else if(password.length == 0){
        res.status(403).json({
                "message" : "Password field is empty"
        }); 
     }else{
        MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        registerUserBuyer(db, function() {
            db.close();
            res.status(200).json({
                "status": "success",
                "token" : "slkdjwkldjKLSJFKfjksccdv"
            })
  });
});
         
     }
});


var registerUserBuyer = function(db, callback) {
   db.collection('buyer').insertOne( {
      "username" : username,
      "emailId" : emailId,
      "password" : password,
      "userType" : userType
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  }
  );
};

module.exports = router;


