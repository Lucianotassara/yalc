require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { yalcController } from './server/controller'

const app = express();

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/views'));

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// API
app.use(yalcController);

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
