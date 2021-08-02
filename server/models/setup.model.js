//Schema para un setup de escritorio
var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var SetupSchema = Schema ({
    name: String,
    description: String,
    price: {type: Number, default: 0},
    user: {type: String, required: true},
    products: [String],
    img: String
});

module.exports = mongoose.model('setup', SetupSchema);
