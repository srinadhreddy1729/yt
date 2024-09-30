const userprofilecontroller=require('../controllers/userprofilecontroller')
const express=require('express');
const app=express();
app.post("/sendprofiledetails",userprofilecontroller.saveprofileDetails);
app.post("/getprofiledetails",userprofilecontroller.getprofileDetails)
module.exports=app;