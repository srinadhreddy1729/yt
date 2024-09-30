const emailcontrollers=require('../controllers/useremailcontroller')
const express=require('express');
const app=express();
app.post("/sendEmail",emailcontrollers.sendEmail);
app.post("/verifyOTP",emailcontrollers.verifyOTP)
module.exports=app;