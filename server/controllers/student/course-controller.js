const Course = require('../../models/Course');


const getAllStudentViewCourses = async (req, res)=>{
    try{
        const courses = await Course.find({isPublished: true});
        res.status(200).json({
            success: true,
            data:courses,
        })
    }catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

const getStudentViewCourseDetails = async (req, res)=>{
    try{
     const {id} = req.params;
     const course = await Course.findOne({_id:id});
     if(!course){
        res.status(200).json({
            success: false,
            message: 'No course found',
        })
     }
     res.status(200).json({
        success: false,
        data:course
     })
    }catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

module.exports = {getAllStudentViewCourses, getStudentViewCourseDetails};