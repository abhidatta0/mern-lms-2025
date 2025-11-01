const express = require('express');
const { getAllStudentViewCourses, getStudentViewCourseDetails, getCoursesByStudentId,
    getCurrentCourseProgress,markCurrentLectureAsViewed, resetCurrentCourseProgress
 } = require('../../controllers/student/course-controller');

const router = express.Router();

router.get('/get', getAllStudentViewCourses);
router.get('/get/details/:id/:studentId', getStudentViewCourseDetails);

router.get('/get/mycourses/:studentId', getCoursesByStudentId);
router.post('/mycourse/progress', getCurrentCourseProgress);
router.post('/mycourse/lecture-viewed', markCurrentLectureAsViewed);
router.post('/mycourse/progress-reset', resetCurrentCourseProgress);


module.exports = router;