import express from 'express';
var mongoose = require('mongoose');
const passport = require("passport");


import { User } from '../models';

const loginController = express.Router();




loginController.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));


loginController.get("/auth/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.send(req.user);
    res.send("you reached the redirect URI");
  });

loginController.get("/auth/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

//   loginController.route('/login').get(
//     (req, res) => {
//         res.render('form', {
//             title: "Login", //page title
//             action: "/login", //post action for the form
//             fields: [
//             {name:'email',type:'text',property:'required'},   //first field for the form
//             {name:'password',type:'password',property:'required'}   //another field for the form
//             ]
//         });
// });


  
export default loginController;