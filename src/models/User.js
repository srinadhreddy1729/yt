const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    usernumber:{type:String},
    profileid:{type:String,require:false},
    phonenumber:{ type: String,require:false,default:'1234567890' },
    email:{type:String,require:false,},
    nickname:{type:String,require:false},
    gender:{type:String,require:false},
    dateofbirth:{type:Date,require:false},
    logourl:{type:String,require:false},
    status:{type:String,default:'active',require:false},
    isOnline:{type:String,default:false}
});
const userProfile= mongoose.model('UserProfile', userSchema);
module.exports=userProfile;