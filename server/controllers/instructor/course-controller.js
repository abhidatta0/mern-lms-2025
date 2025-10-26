const Course = require('../../models/Course');

const addNewCourse = async (req, res)=>{
    try{
     const courseData = req.body;
     const newlyCreatedCourse = new Course(courseData);
     const saveCourse = await newlyCreatedCourse.save();
     if(saveCourse){
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data:saveCourse,
        })
     }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

const getAllCourses = async (req, res)=>{
    const {instructorId} = req.params;
    try{
      const coursesList = await Course.find({instructorId});
      res.status(200).json({
            success: true,
            data:coursesList,
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

const getCourseDetailsByID = async (req, res)=>{
    try{
      const course = await Course.findOne({_id:req.params.id});
      if(!course){
        return res.status(404).json({
            success: false,
            message: 'Course not found!'
        })
      }
      res.status(200).json({
            success: true,
            data:course,
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

const updateCourseByID = async (req, res)=>{
    try{
        const {id} = req.params;
        const updatedCourseData = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(id,updatedCourseData,{new: true});
        if(!updatedCourse){
        return res.status(404).json({
            success: false,
            message: 'Course not found!'
        })
      }
      res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data:updatedCourse,
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

module.exports = {addNewCourse, getAllCourses, getCourseDetailsByID,updateCourseByID};