//Schema para un producto
var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var ProductSchema = Schema ({
    name: String,
    price: Number,
    brand: String,
    type: String,
    url: String,
    img_url : String,
    description : [String]
});

module.exports = mongoose.model('product', ProductSchema);
