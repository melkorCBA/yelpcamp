var Campground  =require("../models/campground");
var Comment     =require("../models/comment");
var middlewareObj = {};

//checkCampgroundOwnership middleware
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //is user loged in at all
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundedCampground) {
            if (err) {
                console.log(err);
                req.flash("error", "campground not found");
                res.redirect("back");
            }
            else {

                if (foundedCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "permision denied");  
                    res.redirect("back");
                }

            }

        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }


}

//isLogedIn middleware
middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

//checkCommentOwner
middlewareObj.checkCommentOwner=function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundedComment){
            if(err){
                console.log(err);
                req.flash("error", "campground not found");
                res.redirect("back");
            }
            else{
                //console.log(foundedComment.author.id);
                //console.log(req.user._id);
                if(foundedComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "permision denied");
                    res.redirect("back");
                }

                
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.render("login");
        console.log("not loged in")
    }
}


module.exports = middlewareObj;