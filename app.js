const express=require('express')
const ejs=require('ejs')
const cors=require('cors')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const routes=require('./src/routes/allroutes')
const app=express();
app.use(cors())
app.use(express.json())
dotenv.config()
app.set('view engine','ejs')
const PORT_NUMBER=process.env.PORT_NUMBER
mongoose.connect("mongodb://127.0.0.1:27017/DosthiApplicationDatabase").then((sucess)=>
{
    console.log("connected")
})

app.use("/api",routes)
app.listen(PORT_NUMBER,()=>console.log(`app is running.......at ${PORT_NUMBER}`))