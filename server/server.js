const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const instructorRoutes = require('./routes/instructor/media-routes');
const instructorCourseRoutes = require('./routes/instructor/course-routes');
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

/* For debugging only
app.use((req, res, next) => {
    console.log(`\n=== INCOMING REQUEST ===`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Origin: ${req.get('origin')}`);
    console.log(`Headers:`, req.headers);
    next();
});
*/

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}));

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.use(express.json());

mongoose.connect(MONGO_URI).then(()=> console.log("Mongodb connected")).catch(console.log)

app.use("/auth",authRoutes);
app.use("/media",instructorRoutes);
app.use('/instructor/course',instructorCourseRoutes);
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
