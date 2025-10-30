import { useEffect, useState } from "react";
import { useStudentContext } from "../StudentContext";
import { fetchInstructorCourseDetailsService, fetchMyCourses } from "@/services";
import { useUserDetails } from "@/app/auth/useUserDetails";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type BoughtCourseInfo } from "../types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Watch } from "lucide-react";
import type { InstructorCourse } from "@/app/instructor/types";
import { Skeleton } from "@/components/ui/skeleton";

const MyCoursesList = () => {
  const { isLoading, setIsLoading} = useStudentContext();

  const navigate = useNavigate();

  const [boughtCourses,setBoughtCourses] = useState<BoughtCourseInfo[]>([]);
  const [coursesInfos,setCoursesInfos] = useState<InstructorCourse[]>([]);


  const user = useUserDetails();

  async function fetchAllStudentViewCourses() {
    setIsLoading(true);
    const response:{success: boolean, data: BoughtCourseInfo[]} = await fetchMyCourses(user._id);
    if(response.success){
      setBoughtCourses(response.data);
      const listOfCourseIds = response.data.map(course => course.courseId);
      await fetchInstructorAndCourseDetails(listOfCourseIds);
    }
    setIsLoading(false);
  }

  const fetchInstructorAndCourseDetails = async (listOfCourseIds:string[])=>{
    const coursePromises = await listOfCourseIds.map(id=> fetchInstructorCourseDetailsService(id));
    const list = await Promise.all(coursePromises);
    const coursesInfoFromApi = list.filter(l=> l.success).map(l=> l.data);
    setCoursesInfos(coursesInfoFromApi);
  }

  useEffect(()=>{
    fetchAllStudentViewCourses();
  },[]);

  const getCourseInfoById  = (id:string)=>{
    return coursesInfos.find(item=> item._id === id);
  }


  if(isLoading){
    return <Skeleton className="w-full h-screen p-4"/>
  }
  
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {boughtCourses && boughtCourses.length > 0 ? (
          boughtCourses.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={getCourseInfoById(course.courseId)?.image??undefined}
                  alt={getCourseInfoById(course.courseId)?.title??''}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{getCourseInfoById(course.courseId)?.title??''}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {getCourseInfoById(course.courseId)?.instructorName??''}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  )
}
export default MyCoursesList