//Schema para un setup de escritorio
var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var SetupSchema = Schema ({
    name: String,
    description: String,
    price:  Number,
    user: {type: String, required: true},
    products: [],
    img: String
    /*username: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: String, required: true},
    description: {type: String, required: true},
    products: {type: [String], required: true}*/
});

module.exports = mongoose.model('setup', SetupSchema);
