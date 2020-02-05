var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require('./models/comment');

var data = [
    {
        name: "Camp Nou",
        image: "https://en.as.com/futbol/imagenes/2017/09/24/primera/1506248407_687803_1506248477_noticia_normal.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        
    },
    {
        name: "Santiago Bernabéu",
        image: "https://images.unsplash.com/photo-1556962021-9d0303621643?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description: "Camp Nou has been the home stadium of FC Barcelona since its completion in 1957, and it is located in Carrer d'Arístides Maillol. With a seating capacity of 99,354, it is the largest stadium in Spain and Europe, and the third largest football stadium in the world in capacity."
    }
    

]

function seedDB() {
    //clear current data
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("data cleared..");
            //add few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, createdCampground) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // console.log("Camground added..");
                        // //add few comments
                        // Comment.create({
                        //     text: "This place is greate, but I whish there was internet",
                        //     author: "Homer"
                        // }, function (err, createdComment) {
                        //     if (err) {
                        //         console.log(err);
                        //     }
                        //     else {
                                
                                //createdCampground.comments.push(createdComment);
                                createdCampground.save();
                                console.log("comment added..");
                        //     }
                        // })
                    }
                })
            });
        }
    });






}

module.exports = seedDB;