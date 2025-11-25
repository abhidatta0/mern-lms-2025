import { RequestHandler } from 'express';
import { db } from '../../config/database';
import { courses } from '../../config/schema';
import { eq } from 'drizzle-orm';

export const addNewCourse:RequestHandler<{},{},typeof courses.$inferSelect> = async (req, res)=>{
    try{
    const courseData = req.body;

    const saveCourse =  await db
    .insert(courses)
    .values(courseData).returning();
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

export const getAllCourses:RequestHandler<{instructorId:number}> = async (req, res)=>{
    const {instructorId} = req.params;
    try{
      const coursesList = await db
      .select()
      .from(courses)
      .where((eq(courses.instructor_id, instructorId)));


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

export const getCourseDetailsByID:RequestHandler<{id:number}>  = async (req, res)=>{
    try{
       const course = await db
      .select()
      .from(courses)
      .where((eq(courses.instructor_id, req.params.id)));

      if(!course){
        return res.status(404).json({
            success: false,
            message: 'Course not found!'
        })
      }
      res.status(200).json({
            success: true,
            data:course[0],
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}

export const updateCourseByID:RequestHandler<{id:number},{},typeof courses.$inferInsert> = async (req, res)=>{
    try{
        const {id} = req.params;
        const updatedCourseData = req.body;
        const updatedCourse =  await db.update(courses).set(updatedCourseData).where(eq(courses.id, id));

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