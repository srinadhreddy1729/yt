  const { response } = require('express');
const modelFiles=require('../models/UserDetailsModel')
  const emailSevices=require('../services/emailService')
  const userService=require('../services/userService')
 async function sendOTP(request,response)
 {
  emailSevices.sendOtp(request,response);
 }
 function verifyOTPs(request,response)
 {
  emailSevices.verifyOTP(request,response);
 }
 function example(request,response)
 {
  emailSevices.example(request,response)
 }
 function sendUserDetails(request,response)
 {
  userService.sendUserDetails(request,response);
 }
 function getUserDetails(request,response)
 {
  userService.getUserDetails(request,response);
 }
module.exports = {sendOTP,verifyOTPs,example,sendUserDetails,getUserDetails};
