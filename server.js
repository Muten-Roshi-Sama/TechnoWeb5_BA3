const PORT = 8000;

//express Setup
// let express = require('express');  //old way to import express
import express from 'express';
import Televisions from './models/Televisions.js';


let app = express();
//Body parser
app.use(express.urlencoded({extended : true}));  //to use .body
app.use(express.static('public')); //to use files in the public folder like css

//Connect to mySQLServer trough Models.js


//router setup
// let router = require('./routes');
// app.use('/', router); //use all routes of Router from the root file.

//---------Variables-----------------


//---------Main code------------------

app.get('/', async (req, res)=> {
    // const tv = {id : "012", brand : "Sony",dimensions:"80x120cm" price: 123, bought: 0, broken:0, brokencause:""};
    // const tv2 = {id : "045", brand : "Samsung", price: 347, bought: 1, broken: 1, brokencause:"Fell over."};
    // TVlist.push(tv);
    // TVlist.push(tv2);
    // TVlist.push(loadMany());
    const TVlist = await Televisions.loadMany();
    console.log(TVlist);
    res.render("home.ejs", {tvs:TVlist, moneyspent:moneySpent(TVlist)});
});


app.post('/add', async (req, res) => {
    let newTV = {
                "brand" : req.body.Brand,
                "dimensions": req.body.Dimensions,
                "price" : req.body.Price,
                "bought" : req.body.Bought,
                "broken" : req.body.Broken,
                brokencause : null   //Cause
            };
            //console.log(JSON.stringify(newTV));
    const tv = new Televisions();
    tv.update(newTV);
    await tv.save(); 
    res.redirect("/");   
});

// app.post("/update", async (req, res)=> {
//     // let urlid = req.params.urlid;
//     let updatedTV = {
//                     "id": req.body.id,
//                     "brand" : req.body.Brand,
//                     "dimensions": req.body.Dimensions,
//                     "price" : req.body.Price,
//                     "bought" : req.body.Bought,
//                     "broken" : req.body.Broken,
//                     "brokencause" : req.body.Broken_Cause
//                 };
//     const tv = await Televisions.load({id:req.body.id});
//     tv.update(updatedTV);
//     await tv.save();
// });



//Toggle isBroken
app.get("/isBroken/:id", async (req, res) => {
    let i = req.params.id;
    const tv = await Televisions.load({id:i})
    const updatedBroken = tv.broken === 1 ? 0 : 1;
    tv.update({broken:updatedBroken})
    await tv.save();
    // res.render("home.ejs", {tvs:TVlist, moneyspent:moneySpent(TVlist)});
    res.redirect("/");
});

//Toggle isBought
app.get("/isBought/:id", async (req, res) => {
    let i = req.params.id;
    const tv = await Televisions.load({id:i})
    const updatedBought = tv.bought === 1 ? 0 : 1;
    tv.update({bought:updatedBought})
    await tv.save();
    res.redirect("/");
});


//Delete
app.get("/delete/:id", async (req, res) => {
    let i = req.params.id;
    const tv = await Televisions.delete({id:i})
    res.redirect("/");
})
// 




//----------------Functions--------------------------------------
function moneySpent(myList) {
    let sum = 0;
    for(const tv of myList) {
        if(tv.bought){sum += tv.price;};
    };
    return sum;
};

//--------------Server Start-------------------------------------
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});





//================================================================


// app.get('/', (req, res)=>{
//     // res.send('Hello');
//     console.log(req.body);
//     //response.render("home.ejs", {});
//     res.render("home.ejs");
    
// });

// app.get("/user", (req, res)=>{
//     connection.query("SELECT * FROM user;", function(err, resSQL){
//         if (err) {
//             res.status(400).send(err);  //400 : err
//             console.log(err);}
//         else {res.status(200);} //200 : OK 
//         res.render("home.ejs", {users:resSQL});
//     })
// });


// app.get("/user/add", (req, res)=>{res.render("userAdd.ejs")});


// app.post("/user", (req, res)=>{
//     let user = {"lastname": req.body.lastname, 
//                 "firstname" : req.body.firstname};
//     connection.query("INSERT INTO user SET ? ", user, function(err, res){ // "?" replaced with value
//         if (err) console.log(err);
//     });
//     res.redirect("/user");
// });

// //send update form
// app.get("/user/update/:i", (req, res) => {
//     let i = req.params.i;
//     connection.query("SELECT * FROM user WHERE iduser= ?;", i, function(err, resSQL) {
//         if(err) console.log(err);
//         res.render("userUpdate.ejs", {"iduser": resSQL[0].iduser, "lastname": resSQL[0].lastname, "firstname":resSQL[0].firstname })
//     })
// })

// //Update user in db
// app.post("/user/update", (req, res) => {
//     let i = req.body.iduser;
//     let user = {"lastname": req.body.lastname, "firstname" : req.body.firstname};
//     connection.query("UPDATE user SET ? WHERE iduser = ?;", [user, i], function(err, res2) {if(err) console.log(err);})
//     res.redirect("/user");
// })

// //Delete User
// app.get("/user/delete/:i", (req, res) => {
//     let i = req.params.i;
//     connection.query("DELETE FROM user WHERE iduser= ?;", i, function(err, res2) {if(err) console.log(err);})
//     res.redirect("/user");
// })





