const express = require('express');
const app = express();
const Setup = require('../models/setup.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const verify = require("../middleware/verifyAccess");
var fs = require('fs');
var jwt = require("jsonwebtoken");


//pagina de inicio
app.get('/', async function(req,res){
    res.render('index');
});

//pagina de listas
app.get('/lists',verify, async function(req,res){
    var lists = await Setup.find({user: req.userId});
    res.render('lists', {lists});
});

//para crear una lista
app.get('/lists/create',verify, async (req, res) => {
    res.render('createSetup');
})

//post agregar una lista
app.post('/lists/add', verify, async  (req,res) => {
    var setup = new Setup(req.body);
    setup.user = req.userId;
    setup.products = [];
    setup.img = ''
    await setup.save();
    res.redirect('/products');
});

//obtener listas
app.get('/lists/get', verify, async (req, res) => {
    var lists = await Setup.find({user: req.userId});
    res.json(lists);
})

//ver una lista especifica
app.get('/lists/:id', verify, async (req, res) => {
    var id = req.params.id;
    var list  = await Setup.findById(id);
    res.render('list', {list});
})

app.post('/products/:id/addToList', verify, async(req, res) => {
    var id = req.params.id;
    //encontrar producto por id
    var product = await Product.findById(id);
    //sacar id de la lista
    var list_id = req.body.list_id;
    var list = await Setup.findById(list_id);
    // list.product = list.product || [];
    var prod = id.toString();
    list.products.push(prod);
    await list.save();
    res.send("added product");
})

app.get('/products', async (req, res) => {
    var allProducts = await Product.find();
    //inicializar matriz de productos
    var products = [];
    for(var i = 0; i < 5; i++){
        products[i]=[];
    };
    allProducts.forEach(p => {
        if (p.type == "Computer") {
            products[0].push(p);
        } else if (p.type == "Monitor") {
            products[1].push(p);
        } else if (p.type == "Mouse") {
            products[2].push(p);
        } else if (p.type == "Keyboard") {
            products[3].push(p);
        } else if (p.type == "Desk") {
            products[4].push(p);
        }
    });
    res.render('products', {products});
})

app.get('/products/:id', async (req, res) => {
    var id = req.params.id;
    var product = await Product.findById(id);
    res.render('product', {product});
})


//agregar un producto nuevo, desde postman o insomnia
app.post('/product/add', async  (req,res) => {
    var product = new Product(req.body);
    await product.save()
    res.send(product)
});

//para editar una lista
// app.get('/lists/edit/:id',verify, async (req, res) => {
//     id = req.params.id;
//     var setup  = await Setup.findById(id);
//     allProducts = await Product.find();
//     products = [];
//     for(var i = 0; i < 5; i++){
//         products[i]=[];
//     };
//     products[0] = [];
//     allProducts.forEach(p => {
//         if (p.type == "Computer") {
//             products[0].push(p);
//         } else if (p.type == "Monitor") {
//             products[1].push(p);
//         } else if (p.type == "Mouse") {
//             products[2].push(p);
//         } else if (p.type == "Keyboard") {
//             products[3].push(p);
//         } else if (p.type == "Desk") {
//             products[4].push(p);
//         }
//     });
//     res.render('editSetup', {setup, products, id});
// })

// app.post('/lists/edit/:id',verify, async (req, res) => {
//     id = req.params.id;
//     var setup  = await Setup.findById(id);
//     console.log(setup);
//     setup.name = req.body.name;
//     setup.description = req.body.description;
//     setup.price = 0;
//     setup.user = req.userId;
//     ((req.body.computer != '') ? computer = await Product.findById(req.body.computer) : computer = null);
//     ((req.body.monitor != '') ? monitor = await Product.findById(req.body.monitor) : monitor = null);
//     ((req.body.mouse != '') ? mouse = await Product.findById(req.body.mouse) : mouse = null);
//     ((req.body.keyboard != '') ? keyboard = await Product.findById(req.body.keyboard) : keyboard = null);
//     ((req.body.desk != '') ? desk = await Product.findById(req.body.desk) : desk = null);
//     setup.products[0] = computer;
//     setup.products[1] = monitor;
//     setup.products[2] = mouse;
//     setup.products[3] = keyboard;
//     setup.products[4] = desk;
    
//     setup.products.forEach( p => {
//         if (p != null) {
//             setup.price = setup.price + p.price;
//         }
//     })
//     await Setup.updateOne({_id: id}, setup)
//     console.log(setup)
//     res.redirect('/lists')
// })

//para ver setups
app.get('/setups', async (req, res) => {
    res.render('setups');
})

//render de la pagina de login
app.get('/login', (req,res) => {
    res.render('login');
})

//verificacion para el login
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

    res.redirect('/login')

});

app.get('/logout',  async (req,res) =>{

    res.clearCookie("token");
    res.redirect('/')
})

module.exports = app;