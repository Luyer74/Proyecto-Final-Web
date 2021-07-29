//Schema para un producto
var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema ({
    name: String,
    username: Number,
    password: String,
    setups: Array
});

module.exports = mongoose.model('user', UserSchema);
