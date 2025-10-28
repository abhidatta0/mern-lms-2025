import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudentContext } from "../StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
import type { InstructorCourse } from "@/app/instructor/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import VideoPlayer from "@/components/video-player";
import { languageOptions } from "@/config";

const CourseDetails = () => {
  const {id} = useParams();
  const {setIsLoading, isLoading} = useStudentContext();

  const [courseDetails, setCourseDetails] = useState<InstructorCourse|null>(null);

  async function fetchDetails() {
    if(id){
        setIsLoading(true);
        const response = await fetchStudentViewCourseDetailsService(id);
        if (response.success) setCourseDetails(response.data);
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    if(id){
      fetchDetails();
    }
  },[id])

 
  if(isLoading){
    return <Skeleton className="w-full h-screen p-4"/>
  }

   if(!courseDetails){
    return <p className="leading-2 text-center p-4">No details found</p>
  }

    const getIndexOfFreePreviewUrl = courseDetails.curriculum.findIndex(
          (item) => item.freePreview
        ) ?? -1;


  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {courseDetails.title}
        </h1>
        <p className="text-xl mb-4">{courseDetails.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {courseDetails.instructorName}</span>
          <span>Created On {new Date(courseDetails.date).toLocaleDateString()}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {languageOptions.find(item => item.id === courseDetails.primaryLanguage)?.label}
          </span>
          <span>
            {courseDetails.students.length}{" "}
            {courseDetails.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {courseDetails.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{courseDetails.description}</CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {courseDetails.curriculum.map(
                (curriculumItem, index) => (
                  <li
                    className={`${
                      curriculumItem.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    key={index}
                  >
                    {curriculumItem.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? courseDetails.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${courseDetails.pricing}
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      </div>
  )
}
export default CourseDetails;