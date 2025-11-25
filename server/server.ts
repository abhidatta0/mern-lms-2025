import cors from  'cors';
import mongoose from 'mongoose';
import express,{ Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth';
import instructorCourseRoutes from './routes/instructor/course-routes';
import instructorMediaRoutes from './routes/instructor/media-routes';
/*
const studentCourseRoutes = require('./routes/student/course-routes');
const studentOrderRoutes = require('./routes/student/order-routes');
*/
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

app.listen(port, (err)=>{
    if(err){
        console.error("Failed to start ",err);
    }
    console.log("Server started !!!");
})

app.use("/auth",authRoutes);
app.use("/media",instructorMediaRoutes);
app.use('/instructor/course',instructorCourseRoutes);
// app.use('/student/course',studentCourseRoutes);
// app.use('/student/order',studentOrderRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});