const Course = require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses');
const StudentCourse = require('../../models/StudentCourses');
const CourseProgress = require('../../models/CourseProgress');


const getAllStudentViewCourses = async (req, res)=>{
    try{
        const {category = [], level = [], primaryLanguage = [], sortBy} = req.query;
        const filters = {isPublished: true}; 
        if(category.length){
            filters.category = {$in: category.split(',')};
        }
        if(level.length){
            filters.level = {$in: level.split(',')};
        }
        if(primaryLanguage.length){
            filters.primaryLanguage = {$in: primaryLanguage.split(',')};
        }
        let sort = {};
        switch (sortBy){
            case 'price-lowtohigh':
                sort.pricing = 1;
                break;
            case 'price-hightolow':
                sort.pricing = -1;
                break;
            case 'title-atoz':
                sort.title = 1;
                break;
            case 'title-ztoa':
                sort.title = -1;
                break;
            default:
                sort.pricing = 1;
                break;
        }
        const courses = await Course.find(filters).sort(sort);
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
     const {id, studentId} = req.params;
     const course = await Course.findOne({_id:id});
     if(!course){
        res.status(200).json({
            success: false,
            message: 'No course found',
        })
     }

     // check if current student purchased this course or not
     const studentCourse  = await StudentCourses.findOne({
       userId: studentId,
     });

     console.log({studentCourse, ind: studentCourse.courses.findIndex(item => item.courseId === id)})

     const isCoursePurchased = !!studentCourse && (studentCourse.courses.findIndex(item => item.courseId === id) !== -1)

     console.log({isCoursePurchased})
     res.status(200).json({
        success: true,
        data:course,
        isCoursePurchased,
     })
    }catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

const getCoursesByStudentId = async (req, res)=>{
    try{
      const {studentId} = req.params;
      const studentBoughtCourses = await StudentCourse.findOne({userId: studentId});
      res.status(200).json({
        success: true,
        data:studentBoughtCourses?.courses || [],
      })
    }catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

const getCurrentCourseProgress =  async (req, res)=>{
    try{
       const {userId, courseId} = req.body;
       const studentCourse = await StudentCourse.findOne({userId});
       const isCoursePurchased = !!studentCourse && (studentCourse.courses.findIndex(item => item.courseId === courseId) !== -1)


       if(!isCoursePurchased){
        res.status(200).json({
            success: true,
            data:{
               isPurchased: false,
            },
            message: 'You  need to purchase this course to access it'
        })
       }

       const currentUserCourseProgress = await CourseProgress.findOne({userId, courseId});
        
        const courseDetails = await Course.findById(courseId);

       // for first time , after buying
       if(!currentUserCourseProgress || currentUserCourseProgress?.lectureProgress.length === 0){
        res.status(200).json({
            success: true,
            message: 'No progress found.You  can start watching',
            data:{
                courseDetails: courseDetails,
                progress: [],
                isPurchased: true
            }
        })
       }else{
        res.status(200).json({
            success: true,
            message: 'No progress found.You  can start watching',
            data:{
                courseDetails: courseDetails,
                progress: currentUserCourseProgress.lectureProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true
            }
        })
       }

    }catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

module.exports = {getAllStudentViewCourses, getStudentViewCourseDetails,getCoursesByStudentId,
   getCurrentCourseProgress,
};