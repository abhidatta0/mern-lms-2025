import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudentContext } from "../StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
import type { InstructorCourse } from "@/app/instructor/types";
import { Skeleton } from "@/components/ui/skeleton";

const CourseDetails = () => {
  const {id} = useParams();
  const {setIsLoading, isLoading} = useStudentContext();

  const [courseDetails, setCourseDetails] = useState<InstructorCourse|null>(null);

  async function fetchDetails() {
    if(id){
        setIsLoading(true);
        const response = await fetchStudentViewCourseDetailsService(id);
        console.log({response})
        if (response?.success) setCourseDetails(response.data);
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    if(id){
      fetchDetails();
    }
  },[id])

  console.log({courseDetails})

 
  if(isLoading){
    return <Skeleton className="w-full h-screen p-4"/>
  }

   if(!courseDetails){
    return <p className="leading-2 text-center p-4">No details found</p>
  }

  return (
    <div>CourseDetails {id}</div>
  )
}
export default CourseDetails;