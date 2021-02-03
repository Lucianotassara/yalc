import express from "express";
var mongoose = require("mongoose");
const passport = require("passport");

import { User } from "../models";

const loginController = express.Router();

loginController.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

loginController.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    
    res.send({
      user: req.user,
      message: "you reached the redirect URI",
    });
  }
);

loginController.get("/auth/logout", (req, res) => {
  res.send(req.user);
  req.logout();
});

loginController.route("/login").get((req, res) => {
  // res.send({message: 'login work\'s'});

  res.render("form", {
    title: "Login", //page title
    action: "/login", //post action for the form
    fields: [
      { name: "email", type: "text", property: "required" }, //first field for the form
      { name: "password", type: "password", property: "required" }, //another field for the form
    ],
  });
});

loginController.get(
  '/users' ,
  (req, res) => {
    User.find({}, (err, result) => {
      res.status(200).json(result/*{
        //data: result,
        result
      }*/);
    });
  }
);

export default loginController;
