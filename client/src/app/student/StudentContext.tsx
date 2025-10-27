import {createContext,useContext, useState } from 'react';
import type { ReactNode} from 'react';
import type { InstructorCourse } from '../instructor/types';

type StudentContextType = {
    studentViewCoursesList:InstructorCourse[],
    setStudentViewCoursesList:(studentViewCoursesList:InstructorCourse[])=>void,
};

// eslint-disable-next-line react-refresh/only-export-components
export const StudentContext = createContext<StudentContextType|null>(null);

export type Props = {
    children:ReactNode,
}
export default function StudentProvider({children}:Props){

  const [studentViewCoursesList, setStudentViewCoursesList] = useState<InstructorCourse[]>([]);

   return (
    <StudentContext value={{studentViewCoursesList,setStudentViewCoursesList}}>
        {children}
    </StudentContext>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStudentContext = () => {
  const authContext = useContext(StudentContext);

  if (!authContext) {
    throw new Error(
      "useStudentContext has to be used within <StudentProvider>"
    );
  }

  return authContext;
};