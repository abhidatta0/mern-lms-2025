import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {useState,useEffect, useCallback} from 'react';
import { getCurrentCourseProgressService, markCurrentLectureAsViewedService } from "@/services";
import { useUserDetails } from "@/app/auth/useUserDetails";
import type { CourseCurriculumFormData, InstructorCourse } from "@/app/instructor/types";
import type { CourseProgress as CourseProgressType } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Label} from '@/components/ui/label';
import Confetti from 'react-confetti'
import { useStudentContext } from "../StudentContext";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const CourseProgress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserDetails();
  const [lockCourse, setLockCourse] = useState(false);
  const {setIsLoading, isLoading} = useStudentContext();

  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState<{courseDetails: InstructorCourse|null,progress:CourseProgressType[]}>({courseDetails:null, progress:[]})
  const [currentLecture, setCurrentLecture] = useState<CourseCurriculumFormData|null>(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const [showConfetti, setShowConfetti] = useState(false);

  const fetchCurrentCourseProgress = useCallback(async ()=> {
    setIsLoading(true);

    const response = await getCurrentCourseProgressService({userId:user._id, courseId:id ?? ''});
    setLockCourse(false);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
          setStudentCurrentCourseProgress({
            courseDetails: response.data.courseDetails,
            progress: response.data.progress,
          })
          if(response.data.completed){
            setCurrentLecture(response.data.courseDetails.curriculum[0]);
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);
          }

          else if(!response.data.progress || response.data.progress.length === 0){
            setCurrentLecture(response.data.courseDetails.curriculum[0])
          }else{
            const lastIndexOfLectureViewedTrue = response.data.progress.reduceRight((acc, current, index)=> acc === -1 && current.viewed ? index : acc,-1);
            setCurrentLecture(response.data.courseDetails.curriculum[lastIndexOfLectureViewedTrue+1])
          }
      }
    }
    setIsLoading(false);

  },[id,setIsLoading,user._id])

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id,fetchCurrentCourseProgress]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 5000);
  }, [showConfetti]);

  const handleCurrentLectureViewed = async ()=>{
    if(currentLecture && id){
     const response = await markCurrentLectureAsViewedService({userId: user._id, courseId:id, lectureId:currentLecture._id});
     if(response.success){
      fetchCurrentCourseProgress()
     }
    }
  }

  if(isLoading){
    return <Skeleton className="w-full h-screen p-4"/>
  }

   if(!studentCurrentCourseProgress){
    return <p className="leading-2 text-center p-4">No details found</p>
  }

  console.log({currentLecture})
  return (
      <div className="flex flex-col h-screen text-white">
      {showConfetti && <Confetti />}

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block text-foreground">
            {studentCurrentCourseProgress.courseDetails?.title}
          </h1>
        </div>
         <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex h-screen border overflow-hidden">
        <div
          className={`flex flex-col flex-1`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl ?? undefined}
            onVideoEnded={()=> currentLecture ? handleCurrentLectureViewed():null}
          />
          <div className="p-6 ">
            <h2 className="text-2xl text-foreground font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>
        <div
          className={`transition-all duration-200 border-l border-primary ${
            isSideBarOpen ? "w-[400px]" : "w-0"
          }`}
        >
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                value="content"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        className="flex items-center space-x-2 text-sm text-foreground font-bold cursor-pointer"
                        key={item.title}
                      >
                        <span>{item.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4 text-primary">About this course</h2>
                  <p className="text-foreground">
                    {studentCurrentCourseProgress.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
     
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent aria-describedby={undefined}  className="sm:w-[425px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription  className="flex flex-col gap-3" asChild>
              <div>
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>
                  My Courses Page
                </Button>
                <Button>Rewatch Course</Button>
              </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default CourseProgress