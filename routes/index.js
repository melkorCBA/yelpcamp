var express     =require("express");
var router      =express.Router();
var User        =require("../models/user");
var passport    =require("passport");
//var bodyParser  =require("body-parser");

//router.use(bodyParser.urlencoded({extended:true}));
//Auth Routes -----------------------------------------------------------

//show registor form
router.get("/signup", function(req,res){
    res.render("signup");
})

//handel signup logic
router.post("/signup", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, registeredUser){
        if(err){
            //console.log(err.message);
            req.flash("error", err.message);
            //console.log(typeof(req.flash("error")));
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,function(){ //login as the new user
            req.flash("success", "Welcome "+newUser.username);
            res.redirect("/campgrounds");
        });
    });
})

//login Routes .......................
//show login form
router.get("/login", function(req,res){
    res.render("login");
})

//handle logins
//app.post("/login", middleware, callback)
router.post("/login",passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req,res){})

//logout Route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "successfuly logged out")
    //console.log(typeof(req.flash("success")));
    res.redirect("/campgrounds");
});

//isLogedIn middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

module.exports=router;