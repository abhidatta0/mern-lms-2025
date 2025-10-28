const Course = require('../../models/Course');


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
     const {id} = req.params;
     const course = await Course.findOne({_id:id});
     if(!course){
        res.status(200).json({
            success: false,
            message: 'No course found',
        })
     }
     res.status(200).json({
        success: true,
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