const controllers = require('../controllers/allcontrollers');
const express=require('express')
const router=express.Router()
const mongoose=require('mongoose');
router.post("/sendOTP",controllers.sendOTP)
router.post("/verifyOTPs",controllers.verifyOTPs)
router.get("/example",controllers.example)

module.exports=router;