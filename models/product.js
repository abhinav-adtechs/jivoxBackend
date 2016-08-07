var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productname: {
        type: String,
        unique: false,
        required: true
    },
    productId : {
        type: Number,
        unique: true,
        required: true 
    },    
    productRating: {
        type: Number,
        required: true
    }
});