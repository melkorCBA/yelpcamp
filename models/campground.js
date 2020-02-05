mongoose = require("mongoose");

//schema setup
var campgroundScheam=new mongoose.Schema({ 
    name: String,
    image: String,
    description: String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

//compile the schema to a  model
module.exports= mongoose.model("Campground", campgroundScheam);