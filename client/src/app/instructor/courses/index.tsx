import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { editCourseService, fetchInstructorCourseListService } from "@/services";
import { useEffect, useState, useCallback } from "react"
import { useUserDetails } from "@/app/auth/useUserDetails";
import type { InstructorCourse } from "../types";

const InstructorCourses = () => {
  const navigate = useNavigate();

  const [coursesList, setCoursesList] = useState<InstructorCourse[]>([]);
  const {id} = useUserDetails();

  const fetchAllCourses = useCallback(async  ()=>{
    const response = await fetchInstructorCourseListService(id);
    if(response.success){
    setCoursesList(response.data);
    }
  },[id]);

  useEffect(()=>{
    fetchAllCourses();
  },[]);

  const archiveCourse = async (course: InstructorCourse)=>{
    const payload = {
     isPublished: !course.isPublished,
    };

    const response =   await editCourseService(course._id,payload);
    if(response.success){
      fetchAllCourses();
    }
  }




  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button className="p-6" onClick={()=> navigate('create-new-course')}>Create New Course</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Courese</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {
                  coursesList.map((course)=>(
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.students.length}</TableCell>
                      <TableCell>{Number(course.pricing)*course.students.length}</TableCell>
                      <TableCell className="text-right flex justify-end">
                        <Button variant='ghost' size='sm' onClick={()=> navigate(`edit-course/${course._id}`)}>
                          <Edit />
                        </Button>
                        <Button variant='ghost' size='sm' className="text-red-500" onClick={()=> archiveCourse(course)}>
                          {course.isPublished ? 'Archive Course':'Unarchive Course'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                }
                
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
export default InstructorCourses