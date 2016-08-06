var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/usera", function(req,res){
    res.send("Hello from user route");
});

router.post("/authen", function(req, res) {
    var username = req.body.username;
    
    //res.sendStatus(500);
    
    if(username == "abhinav"){
        res.status(200).json({
           //gdsgfsdf 
        });
        res.json({
            success : true,
            message : "Logged in successfully"
        });
    }else{
        res.json({
            success : false,
            message : "Username does not match"
        });
    }
})

module.exports = router;
