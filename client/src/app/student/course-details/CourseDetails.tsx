import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentContext } from "../StudentContext";
import { createPaymentService, fetchStudentViewCourseDetailsService } from "@/services";
import { type CourseCurriculumFormData, type InstructorCourse } from "@/app/instructor/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import VideoPlayer from "@/components/video-player";
import { languageOptions } from "@/config";
import { Button } from "@/components/ui/button";
import { useUserDetails } from "@/app/auth/useUserDetails";
import type { Order } from "../types";
import { Spinner } from "@/components/ui/spinner"

// Generate a random payment ID
function generatePaymentId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PAY_${timestamp}_${random}`;
}

// Generate a random payer object
function generatePayerId() {

  return `PAYER_${Math.floor(Math.random() * 100000)}`
  
}

const CourseDetails = () => {
  const {id} = useParams();
  const {setIsLoading, isLoading} = useStudentContext();

  const [courseDetails, setCourseDetails] = useState<InstructorCourse|null>(null);

  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const user = useUserDetails();

  const navigate = useNavigate();

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState<CourseCurriculumFormData['videoUrl']|null>(null);

  async function fetchDetails() {
    if(id){
        setIsLoading(true);
        const response = await fetchStudentViewCourseDetailsService(Number(id), user.id);
        if (response.success) { 
          setCourseDetails(response.data);
          if(response.isCoursePurchased){
            navigate(`/course-progress/${id}`)
          }
        };
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

  const handleSetFreePreview = (curriculumItem: CourseCurriculumFormData)=>{
   setDisplayCurrentVideoFreePreview(curriculumItem.videoUrl);
   setShowFreePreviewDialog(true);
  } 

  const handleCreatePayment = async ()=>{
    const payload:Order = {
      userId:user.id,
      orderStatus:'pending',
      paymentMethod:'razorpay', // dummy payment !
      paymentStatus:'initiated',
      orderDate: new Date(),
      paymentId:'',
      payerId:'',
      instructorId: courseDetails.instructorId,
      courseId: courseDetails._id,
      coursePricing: courseDetails.pricing,  // enhance : different pricing due to discount
    };

    setIsPaying(true);
    /* Here, I am making a dummy payment call.
     I call razorpay api internally via server and server will redirect to razoprpay page,
     once successfully I will be redirected to /payment-return which will further complete the course buy
    */
    const response = await createPaymentService(payload);
    if(response.success){
      sessionStorage.setItem('currentOrderId',JSON.stringify(response.data.orderId));
      const paymentId=generatePaymentId();
      const payerId=generatePayerId();

      // redirect
      const url = new URL(`${window.origin}/payment-return`);
      url.searchParams.append('paymentId', paymentId);
      url.searchParams.append('payerId', payerId);
      window.location.href = url.toString();
    }
    setIsPaying(false);

  }


  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {courseDetails.title}
        </h1>
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
                    onClick={curriculumItem.freePreview ? ()=> handleSetFreePreview(curriculumItem): undefined}
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
              <Button 
              onClick={handleCreatePayment}
              disabled={isPaying}
              className="w-full">
                {isPaying && <Spinner />}
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog open={showFreePreviewDialog} onOpenChange={setShowFreePreviewDialog}>
      <DialogContent className="sm:max-w-md" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Course Preview</DialogTitle>
        </DialogHeader>
        <div>
          <VideoPlayer
            url={displayCurrentVideoFreePreview??''}
            width="100%"
            height="200px"
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </div>
  )
}
export default CourseDetails;