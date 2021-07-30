const express = require('express');
const app = express();
const Setup = require('../models/setup.model');

//pagina de inicio
app.get('/', async function(req,res){
    //var setups = await Setup.find();
    //console.log(setups);
    res.render('index');
});

//agregar un setup
app.post('/add', async  (req,res) => {
    var setup = new Setup(req.body);
    await setup.save()
    .then(() => res.json("agregado"))
    .catch(err => res.status(400).json('Error ' + err));
});

//para ver una lista especifica
app.get('/setup/:id', async (req, res) => {
    id = req.params.id;
    var setup  = await Setup.findById(id);
    res.render('setup', {setup});

})

//para ver listas
app.get('/setups', async (req, res) => {
    res.render('setups');
})

app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/login', async (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    res.send('/login');
})

module.exports = app;