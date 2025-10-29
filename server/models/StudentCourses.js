const mongoose = require('mongoose');


const StudentCourseSchema = new mongoose.Schema({
  userId: String,
  courses:[
    {
      courseId: String,
      title: String,
      instructorId:String,
      dateOfPurchase:String,
    }
  ]
});

module.exports = mongoose.model('StudentCourse',StudentCourseSchema);
