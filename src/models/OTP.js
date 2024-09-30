const mongoose = require('mongoose')
const UserDetailsSchema = new mongoose.Schema({
    userEmail: { type: String ,require:true},
    userOtp: { type: String,require:true },
    otpExpiry:{type:String,require:true}

});
let UserOTP = mongoose.model('UserDetails', UserDetailsSchema)
module.exports =UserOTP;