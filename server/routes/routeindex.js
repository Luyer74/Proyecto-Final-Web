const express = require('express');
const app = express();
const Setup = require('../models/setup.model');

//pagina de inicio
app.get('/', async function(req,res){
    var setups = await Setup.find();
    console.log(setups);
    res.json(setups);
});

//agregar un setup
app.post('/add', async  (req,res) => {
    var setup = new Setup(req.body);
    await setup.save()
    .then(() => res.json("agregado"))
    .catch(err => res.status(400).json('Error ' + err));
});

module.exports = app;