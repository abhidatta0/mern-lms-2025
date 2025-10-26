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
import { CircleX, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourseListService } from "@/services";
import { useEffect, useState, useCallback } from "react"
import { useUserDetails } from "@/app/auth/useUserDetails";
import type { InstructorCourse } from "../types";

const InstructorCourses = () => {
  const navigate = useNavigate();

  const [coursesList, setCoursesList] = useState<InstructorCourse[]>([]);
  const {_id} = useUserDetails();

  const fetchAllCourses = useCallback(async  ()=>{
    const response = await fetchInstructorCourseListService(_id);
    if(response.success){
    setCoursesList(response.data);
    }
  },[_id]);

  useEffect(()=>{
    fetchAllCourses();
  },[]);


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
                      <TableCell>${course.pricing}</TableCell>
                      <TableCell>{Number(course.pricing)*course.students.length}</TableCell>
                      <TableCell className="text-right">
                        <Button variant='ghost' size='sm' className="mr-2" onClick={()=> navigate(`edit-course/${course._id}`)}>
                          <Edit />
                        </Button>
                        <Button variant='ghost' size='sm' className="text-red-500">
                          <CircleX />
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