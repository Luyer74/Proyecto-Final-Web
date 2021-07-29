//Schema para un producto
var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var ProductSchema = Schema ({
    name: String,
    price: Number,
    brand: String,
    type: String
});

module.exports = mongoose.model('product', ProductSchema);
