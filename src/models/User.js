const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    profile:{ type: String, default: '' },
    nickname:{type:String,require:true},
    gender:{type:String,require:true},
    dateofbirth:{type:Date,require:true}
});
const userModel= mongoose.model('UserProfile', userSchema);
module.exports=userModel;