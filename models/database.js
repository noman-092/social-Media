const mongoose = require('mongoose');

exports.connect= async () =>{
    try{
        const conn = await mongoose.connect(process.env.MongoUrl);
        console.log("connected")
    }catch(err){
         console.log(err.message);
    }
}