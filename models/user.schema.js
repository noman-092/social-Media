const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String, 
   
},
{timestamps:true},
);
userSchema.plugin(plm);
const usercollection= mongoose.model('user',userSchema);
module.exports=usercollection;
