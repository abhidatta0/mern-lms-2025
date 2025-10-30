const express = require('express');
const { getAllStudentViewCourses, getStudentViewCourseDetails, getCoursesByStudentId } = require('../../controllers/student/course-controller');

const router = express.Router();

router.get('/get', getAllStudentViewCourses);
router.get('/get/details/:id/:studentId', getStudentViewCourseDetails);

router.get('/get/mycourses/:studentId', getCoursesByStudentId);


module.exports = router;