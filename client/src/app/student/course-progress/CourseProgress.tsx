import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, } from "lucide-react";
import {useState,useEffect, useCallback} from 'react';
import { getCurrentCourseProgressService } from "@/services";
import { useUserDetails } from "@/app/auth/useUserDetails";
import type { CourseCurriculumFormData, InstructorCourse } from "@/app/instructor/types";
import type { CourseProgress } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Label} from '@/components/ui/label';
import Confetti from 'react-confetti'

const CourseProgress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserDetails();
  const [lockCourse, setLockCourse] = useState(false);

  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState<{courseDetails: InstructorCourse|null,progress:CourseProgress[]}>({courseDetails:null, progress:[]})
  const [currentLecture, setCurrentLecture] = useState<CourseCurriculumFormData|null>(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const fetchCurrentCourseProgress = useCallback(async ()=> {
    const response = await getCurrentCourseProgressService({userId:user._id, courseId:id ?? ''});
    console.log({response});
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
            return;
          }
      }
    }
  },[])

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id,fetchCurrentCourseProgress]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 5000);
  }, [showConfetti]);

  console.log({currentLecture,studentCurrentCourseProgress})
  return (
      <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}

      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
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