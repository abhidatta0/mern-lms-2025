import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config';
import {createContext, useState,useContext} from 'react';
import type {ReactNode} from 'react';
import type { CourseLandingFormData,CourseCurriculumFormData } from './types';

type InstructorContextType = {
  courseLandingFormData: CourseLandingFormData,
  setCourseLandingFormData: (data:CourseLandingFormData )=> void,
  courseCurriculumFormData: CourseCurriculumFormData[],
  setCourseCurriculumFormData: (data:CourseCurriculumFormData[] )=> void,
  mediaUploadProgress: boolean,
  setMediaUploadProgress:(value: boolean)=> void,
  mediaUploadProgressPercentage: number,
  setMediaUploadProgressPercentage: (value: number)=> void,
}

export const InstructorContext = createContext<InstructorContextType|null>(null);

export type Props = {
    children:ReactNode,
}
export default function InstructorProvider({children}:Props){

  const [courseLandingFormData, setCourseLandingFormData] = useState<CourseLandingFormData>(courseLandingInitialFormData);
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState<CourseCurriculumFormData[]>(courseCurriculumInitialFormData);

  const [ mediaUploadProgress,setMediaUploadProgress] = useState(false);
  const [ mediaUploadProgressPercentage,setMediaUploadProgressPercentage] = useState(0);

  return <InstructorContext value={{courseLandingFormData,setCourseLandingFormData, courseCurriculumFormData, setCourseCurriculumFormData,
    mediaUploadProgress,setMediaUploadProgress,mediaUploadProgressPercentage, setMediaUploadProgressPercentage,
  }}>{children}</InstructorContext>
}

export const useInstructorContext = () => {
  const instructorContext = useContext(InstructorContext);

  if (!instructorContext) {
    throw new Error(
      "useInstructorContext has to be used within <InstructorProvider>"
    );
  }

  return instructorContext;
};