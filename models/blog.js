const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// schema
const blogschema = new Schema({
    
    title:{
        type:String,
        required:true
    },
    snippet:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
},{timestamps: true});

// models

const Blog = mongoose.model('Blog',blogschema); 
module.exports = Blog; 