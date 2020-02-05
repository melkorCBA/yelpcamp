var express     =require("express");
var router      = express.Router({mergeParams:true});
var Campground  =require("../models/campground");
var Comment     =require("../models/comment");
var middlware   =require("../middleware");


//add comment ROUTES----------------------------------------------------------
//NEW (comment) ROUTE
// app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
//     Campground.findById(req.params.id, function(err, foundedCampground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.render("comments/new", {campground: foundedCampground});
//         }
//     })
   
// });

//CREATE (comment) ROUTE
router.post("/",middlware.isLoggedIn, function(req,res){
    //lookup camground using id
    Campground.findById(req.params.id, function(err, foundedCampground){
        if(err){
            res.redirect("/campground/"+req.params.id);
        }
        else{
            //var tempComment={text:req.body.commentText}
            Comment.create(req.body.comment, function(err, createdComment){
                if(err){
                    req.flash("error", "Somthing went wrong");
                    console.log(err);
                }
                else{
                    //add username and id to comment
                    createdComment.author.id=req.user.id;
                    createdComment.author.username=req.user.username;
                    createdComment.save();
                    foundedCampground.comments.push(createdComment);
                    foundedCampground.save();
                    //console.log(createdComment);
                    req.flash("success", "Comment Added");
                    res.redirect("/campgrounds/"+foundedCampground._id);
                }
            })
        }
    })
 
});

//Edit
router.get("/:commentId/edit", middlware.checkCommentOwner, function(req,res){
     
    Comment.findById(req.params.commentId, function(err, foundedComment){
            res.render("comments/edit",{campground_id:req.params.id, comment:foundedComment});
    })
});

//Update
router.put("/:commentId", middlware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//Destroy
router.delete("/:commentId", middlware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");

            
        }else{
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
       
    })
});




module.exports=router;