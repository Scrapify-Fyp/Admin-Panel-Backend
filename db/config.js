const mongoose = require("mongoose");
require('dotenv').config();

const uri =  process.env.MONGODB_URI;

const connectDB = ()=>{
    mongoose.connect(uri).then(()=>{
        console.log("connected to DB!")
    }).catch((error)=>{
        console.log("Error connecting to DB!",error)
    })
}

module.exports = connectDB;