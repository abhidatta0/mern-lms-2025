const express = require('express');
const cors = require('express');

const app = express();
const mongoose = require('mongoose');

const port = process.env.port;
const MONGO_URI = process.env.MONGO_URI;

cors({
    origin:process.env.CLIENT_URL,
    allowedHeaders:['Content-Type','Authorization']
})

app.use(express.json());

mongoose.connect(MONGO_URI).then(()=> console.log("Mongodb connected")).catch(console.log)

app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message:'Something went wrong'
    })
})

app.listen(port, (err)=>{
    if(err){
        console.error("Failed to start ",err);
    }
    console.log("Server started !!!");
})
