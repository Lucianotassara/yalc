import express from 'express';
var mongoose = require('mongoose');
const shortid = require('shortid');

import { Url } from '../models';


const yalcController = express.Router();


// GET MAIN endpoint
yalcController.route('/').get(
   async (req, res) => {
    let links = await Url.find({}).exec();  
        console.log(links);
        res.render('index', {links: links});
    }
  );

  //GET Acceder a un enlace corto
yalcController.route('/l/:shortUrl').get(
    (req, res) => {
         Url.findOneAndUpdate({'shortUrl': req.params.shortUrl}, { $inc: {'requests': 1 } }, {new: false}, 
            function(err, e) {
           if (err)
             res.send(err);
           res.redirect(e.url);
         });
    }
 );

// GET url list
yalcController.route('/list').get(
    (req, res) => {
        Url.find({}, function(err, n) {
            if (err)
              res.send(err);
            res.json(n);
          }).sort('-createdAt');
    }
);

//POST Crear nuevo enlace
yalcController.route('/link').post(
    async (req, res) => 
    {
        let urlobject = {
            url: req.body.url,
            nombre: req.body.nombre,
            faIcon: req.body.faIcon,
            shortUrl: shortid.generate(),
        }

        if(urlobject.url.startsWith('http://') || urlobject.url.startsWith('https://')){
            let regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
            if(req.body.url.match(regex)){
                var newUrl = new Url(urlobject);
                newUrl.save(function(err, n) {
                if (err)
                    res.send(err);
                res.json(n);
                });
            } else {
                res.status(401).json({message: `${urlobject.url} is not a valid url`})
            }
        } else {
            res.status(401).json({message: `${urlobject.url} is not a valid url, it should start with http:// or https://`})
        }        
    }
);

// DELETE Eliminar url acortada. Id de parametro es el ID de la base de datos.
yalcController.route('/:id').delete(
    async (req, res) => 
    {
        Url.remove({ _id: req.params.id }, function(err, n) {
            if (err)
                res.send(err);
            res.json({ message: 'Link successfully deleted' });
        });
    }
  );

  yalcController.route('/login').get(
    (req, res) => {
        res.render('form', {
            title: "Login", //page title
            action: "/login", //post action for the form
            fields: [
            {name:'email',type:'text',property:'required'},   //first field for the form
            {name:'password',type:'password',property:'required'}   //another field for the form
            ]
        });
});

export default yalcController;
