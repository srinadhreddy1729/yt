  const modelFiles=require('../models/UserDetailsModel')
  const emailSevices=require('../services/emailService')
 async function sendOTP(request,response)
 {
  emailSevices.sendOtp(request,response);
 }
 function verifyOTPs(request,response)
 {
  emailSevices.verifyOTP(request,response);
 }
module.exports = {sendOTP,verifyOTPs};
