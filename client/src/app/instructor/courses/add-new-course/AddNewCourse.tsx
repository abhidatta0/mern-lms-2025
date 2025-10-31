import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCurriculum from "./CourseCurriculum";
import CourseLanding from "./CourseLanding";
import CourseSettings from "./CourseSettings";
import { useInstructorContext } from "../../InstructorContext";
import { addNewCourseService, editCourseService, fetchInstructorCourseDetailsService } from "@/services";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import { useUserDetails } from "@/app/auth/useUserDetails";
import { useEffect } from "react";
import type { CourseLandingFormData } from "../../types";

const AddNewCourse = () => {
  const {courseCurriculumFormData, courseLandingFormData, setCourseLandingFormData, setCourseCurriculumFormData} = useInstructorContext();
  const user = useUserDetails();
  const navigate = useNavigate();
  const {courseId} = useParams();

  const isEditing = !!courseId;

  async function fetchCourseDetails(courseId:string){
   const response =await fetchInstructorCourseDetailsService(courseId);

   if(response.success && typeof response.data === 'object'){
     const courseFormDataOfEdited = Object.entries(
     courseLandingInitialFormData
    ).reduce<CourseLandingFormData>((acc, [key, initialValue]) => {
      const typedKey = key as keyof CourseLandingFormData;
      // @ts-expect-error Ignore type check
      acc[typedKey] = response.data[typedKey] ?? initialValue;
      return acc;
    }, {} as CourseLandingFormData);;

    setCourseLandingFormData(courseFormDataOfEdited);
    setCourseCurriculumFormData(response.data.curriculum)
   }
  }

  useEffect(()=>{
    if(isEditing){
      fetchCourseDetails(courseId);
    }

    return ()=>{
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
    }
  },[]);

  const isEmpty = (value:unknown)=>{
    if(Array.isArray(value)){
      return value.length === 0;
    }

    if(typeof value === 'string'){
      return value.trim().length === 0;
    }

    return value === null || value === undefined

  }
  const validateFormData = ()=>{
    // eslint-disable-next-line 
    for (const [_, value]  of Object.entries(courseLandingFormData)) {
      if (isEmpty(value)) {
        return false;
      }
    }
    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  const handleCreateCourse = async ()=> {
    const payload = {
      instructorId: user._id,
      instructorName: user.userName,
      date: new Date(),
      ...courseLandingFormData,
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    const response = isEditing ? await editCourseService(courseId,payload) : await addNewCourseService(payload);
    if(response.success){
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumFormData);
      navigate('/instructor');
    }
  }
  return (
    <div className="mx-auto p-4"> 
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold mb-5">{isEditing ? 'Edit' : 'Create a new'} course</h1>

        <Button disabled={!validateFormData()} className="text-sm tracking-wider font-bold px-8" onClick={handleCreateCourse}>{isEditing ? 'Update Course' : 'Submit'}</Button>
    </div>
    <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default AddNewCourse