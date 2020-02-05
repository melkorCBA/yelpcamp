 var express        = require("express"),
 app                = express(),
 bodyParser         =require("body-parser"), //turn request to js a object
 flash              =require("connect-flash"),
 mongoose           =require("mongoose"),
 passport           =require("passport"),
 localStrategy      =require("passport-local"),
 methodeOveride     =require("method-override"),

 //route files
 campgroundRoutes   =require("./routes/campgrounds"),
 commentRoutes      =require("./routes/comments"),
 indexRoutes        =require("./routes/index"),
  
//models
 Campground         =require("./models/campground"),
 Comment            =require("./models/comment"),
 User               =require("./models/user"),   
 seedDB             =require("./seeds");

 //passport config
 app.use(require("express-session")({ 
     secret:"let the sky fall",
     resave:false,
     saveUninitialized:false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new localStrategy(User.authenticate())); //User.authenticate comes with passportLocalMongoose package
passport.serializeUser(User.serializeUser());   //comes with passportLocalMongoose package
passport.deserializeUser(User.deserializeUser());   //comes with passportLocalMongoose package

//use flash
app.use(flash());

//middleware for addiing currentUser to every template - will be calles on every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error  =   req.flash("error");
    res.locals.success = req.flash("success");
    next(); 
});

app.use(bodyParser.urlencoded({extended:true}));

//methode override - enable PUT requests
app.use(methodeOveride("_method"));


//using the seperate route files
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);



//seed databses
//seedDB();

//create db
var URL=process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
console.log(process.env.DATABASEURL);
app.set("view engine", "ejs");

//make available custom style sheets
app.use(express.static("public"));





app.get("/", function (req, res) {
    res.render("landing");
});



app.listen(process.env.PORT || 5000, function () {
    console.log("server started");
});

//RESTFUL Routes
/*
INDEX   /dogs       GET     display a list of dogs
NEW     /dogs/new   GET     Display form to add new dogs
CREATE  /dogs       POST    add new dog to DB
SHOW    /dogs/:id   GET     shows info about one dog          



*/ 