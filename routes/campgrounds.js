var express = require("express");
var router = express.Router();
var Campground  =require("../models/campground");
var middlware   =require("../middleware"); //this is a directry, it will look for index.js inside it



//INDEX Route (RESTFULL)
router.get("/", function (req, res) {
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
        }

    });

});

//NEW Route (RESTFULL)
router.get("/new", middlware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//CREATE Route (RESTFULL)
router.post("/",middlware.isLoggedIn, function (req, res) {

    var name = req.body.name; //req.body for POST requests, //req.param is for GET requests
    var image = req.body.image;
    var description = req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = { name: name, image: image, description: description, author:author}
    //create new campground and save to DB
    Campground.create(newCampground, function (err, campgroundNew) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Campground Created Successfully");
            res.redirect("/campgrounds");
        }
    })




});

//SHOW Route (RESTFULL) has to define after NEW Route (/campground/new)
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundedCampground) {
        if (err) {
            console.log(err)
        }
        else {
            //render show template with that campground
            //console.log(foundedCampground);
            res.render("campgrounds/show", { campground: foundedCampground });
        }

    })

});

//Edit
router.get("/:id/edit", middlware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundedCampground){
        res.render("campgrounds/edit",{campground:foundedCampground});
    });
});
               

//Update
router.put("/:id", middlware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        req.flash("success", "Campground Updated");
        res.redirect("/campgrounds/"+req.params.id);
    });
});

//Destroy Route
router.delete("/:id",middlware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Campground Removed");
            res.redirect("/campgrounds");
        }
            
    });
});





module.exports = router;
