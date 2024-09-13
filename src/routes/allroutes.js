const controllers = require('../controllers/allcontrollers');
const express=require('express')
const router=express.Router()
const mongoose=require('mongoose');
router.post("/sendOTP",controllers.sendOTP);
router.post("/verifyOTPs",controllers.verifyOTPs);
router.get("/example",controllers.example);
router.post("/sendUserDetails",controllers.sendUserDetails);
router.get("/getUserDetails/:id",controllers.getUserDetails);


module.exports=router;