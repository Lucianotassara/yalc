require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
const cookieSession = require("cookie-session");

import { yalcController, loginController } from './server/controller'

import { User } from './server/models';


const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.YALC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.YALC_GOOGLE_SECRET,
        callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {

      // passport callback function
      // check if user already exists in our db with the given profile ID
      console.log(`************** MUESTRO MI PROFILE: ${JSON.stringify(profile)}`)

      User.findOne({googleId: profile.id}).then((currentUser)=>{
        
        
        if(currentUser){

          //if we already have a record with the given profile ID
          done(null, currentUser);
        } else{

             //if not, create a new user 
            new User({
              googleId: profile.id,
              picture: profile._json.picture,
              displayName: profile.displayName,
              email: profile._json.email
            }).save().then((newUser) =>{
              done(null, newUser);
            });
         } 
      })
    })
);

const app = express();

// const session = require('express-session');

// app.use(session({
//   secret: 'secret string',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { test: 'jaja', sarasa: 'jeje' }
// }));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
})



app.use(cookieSession({
  // milliseconds of a day
  maxAge: 24*60*60*1000,
  keys:[
    process.env.YALC_COOKIE_KEY,
    'jaja',
    'jeje'
  ]
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/views'));

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// API
app.use(yalcController, loginController);

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });

const portYalcApi = process.env.YALC_API_PORT || 3007;
const mongoDBUri = process.env.YALC_MONGO_URI;
const mongoHostName =  process.env.YALC_MONGO_HOSTNAME;

app.listen(portYalcApi, () => {
  console.log(`Started successfully server at port ${portYalcApi}`);
  mongoose
    .connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Conneted to mongoDB at ${mongoHostName}`);
    });
});
