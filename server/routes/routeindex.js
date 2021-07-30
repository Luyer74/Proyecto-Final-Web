const express = require('express');
const app = express();
const Setup = require('../models/setup.model');
const User = require('../models/user.model');
const verify = require("../middleware/verifyAccess");
var fs = require('fs');
var jwt = require("jsonwebtoken");


//pagina de inicio
app.get('/', async function(req,res){
    //var setups = await Setup.find();
    //console.log(setups);
    res.render('index');
});

//para crear un setup
app.get('/setup/create',verify, async (req, res) => {
    res.render('createSetup');
})

//post agregar un setup
app.post('/setup/add', async  (req,res) => {
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

app.post('/login', async function(req,res){

    var email = req.body.email;
    var password = req.body.password;
    
  
    var user = await User.findOne({email:email});
  
    //si no existe
    if(!user) {

      //req.flash('message','El usuario no existe')
        res.redirect('/login');
      //  return res.status(404).send("El usuario no existe");
    }
    // si existe, validar la contraseña
    else {
  
        var valid = await user.validatePassword(password);
  
      // si la contraseña es valida. Crear un token
        if (valid) {
  
        var token = jwt.sign({id:user.email,permission:true},process.env.SECRET,{expiresIn: "1h"});
        res.cookie("token",token,{httpOnly: true})
        res.redirect("/");
    }
      // si no es valida
        else {
        //req.flash('message','La contraseña es incorrecta')
            req.flash('message', 'La contraseña es incorrecta')
        
            res.redirect('/login');
        }
  
    }
  
});

// Pagina de registro
app.get('/register', function(req,res){
    res.render('register')
});

// agregar un nuevo usuario
app.post('/addUser', async function(req,res){

    var user = new User(req.body);
    user.password = user.encryptPassword(user.password);

    await user.save()

        res.redirect("/login")

});

app.get('/mySetups',verify, async function(req,res){

    //var tasks = await Task.find({user_id: req.userId});
    res.render('mySetups');
});


app.get('/logout',  async (req,res) =>{

    res.clearCookie("token");
    res.redirect('/')
})

module.exports = app;