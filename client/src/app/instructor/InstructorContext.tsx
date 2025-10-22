import { courseLandingInitialFormData } from '@/config';
import {createContext, useState,useContext,ReactNode} from 'react';
import type { CourseLandingFormData } from './types';

type InstructorContextType = {
  courseLandingFormData: CourseLandingFormData,
  setCourseLandingFormData: (data:CourseLandingFormData )=> void,
}

export const InstructorContext = createContext<InstructorContextType|null>(null);

export type Props = {
    children:ReactNode,
}
export default function InstructorProvider({children}:Props){

  const [courseLandingFormData, setCourseLandingFormData] = useState<CourseLandingFormData>(courseLandingInitialFormData);

  return <InstructorContext value={{courseLandingFormData,setCourseLandingFormData}}>{children}</InstructorContext>
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