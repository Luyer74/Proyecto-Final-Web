//importar paquetes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//variables de puerto y URL de mongo
require('dotenv').config();
const port = process.env.PORT || 3000;
const connectionUrl = process.env.MONGO_URL || 'mongodb://localhost/app-test';

const app = express();


//conectar a mongo (local, cambiar a remoto cuando se tenga)
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

//middleware
app.use(cors());
app.use(express.json());

//settings
app.set('views','views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

//importar rutas
const indexRoutes = require('./routes/routeindex');

//Usar rutas
app.use('/', indexRoutes);

//Iniciar servidor
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})