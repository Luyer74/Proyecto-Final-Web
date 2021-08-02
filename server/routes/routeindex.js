const express = require('express');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Setup = require('../models/setup.model');
const app = express();
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
    var list = await Setup.findById(id);
    var products = null;
    await Setup.findById(id)
    .populate('products')
    .then(function(data){
        if(data != null){
            products = data.products;
        }
    })
    if(products != null){
        res.render('list', {list, products});
    }
    else{
        res.redirect('/lists');
    }
})

//borrar lista
app.get('/lists/:id/delete', verify, async (req, res) => {
    var id = req.params.id;
    await Setup.remove({_id: id});
    res.redirect('/lists');
})

//borrar producto de lista
app.post('/lists/:id/deleteProduct', verify, async (req, res) => {
    var id = req.params.id;
    var prod_id = req.body.prod_id;
    var list = await Setup.findById(id);
    list.products.pull({_id: prod_id});
    await list.save();
    res.send('producto eliminado');
})

//agregar producto a lista
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

//para editar una lista
app.get('/lists/:id/edit',verify, async (req, res) => {
    id = req.params.id;
    var list = await Setup.findById(id);
    res.render('editSetup', {list});
})

//actualizar lista editada
app.post('/lists/:id/edit', verify, async (req, res) => {
    var id = req.params.id;
    var setup = await Setup.findById(id);
    var updated_data = {
        name: req.body.name,
        description: req.body.description
    }
    var result = await Setup.updateOne({_id: id}, updated_data);
    await setup.save();
    res.redirect('/lists');
})

app.get('/products', async (req, res) => {
    var allProducts = await Product.find();
    //inicializar matriz de productos
    var products = [];
    for(var i = 0; i < 4; i++){
        products[i]=[];
    };
    allProducts.forEach(p => {
         if (p.type == "Monitor") {
            products[0].push(p);
        } else if (p.type == "Mouse") {
            products[1].push(p);
        } else if (p.type == "Keyboard") {
            products[2].push(p);
        } else if (p.type == "Desk") {
            products[3].push(p);
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
    console.log(req.body);
    var product = new Product(req.body);
    await product.save()
    res.send(product)
});

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