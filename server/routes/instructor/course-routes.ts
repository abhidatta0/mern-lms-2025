import express from 'express';
import {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
} from "../../controllers/instructor/course-controller";
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get/list/:instructorId", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

export default router;