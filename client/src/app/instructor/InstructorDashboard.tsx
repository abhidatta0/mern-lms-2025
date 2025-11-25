import { fetchInstructorCourseListService } from "@/services";
import { DollarSign, Users } from "lucide-react";
import { useEffect, useState, useCallback } from "react"
import type { InstructorCourse } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserDetails } from "../auth/useUserDetails";

const InstructorDashboard = () => {
    const [coursesList, setCoursesList] = useState<InstructorCourse[]>([]);
  
    const {id} = useUserDetails();
  
  const fetchAllCourses = useCallback(async  ()=>{
      const response = await fetchInstructorCourseListService(id);
      if(response.success){
      setCoursesList(response.data);
      }
    },[id]);
  
    useEffect(()=>{
      fetchAllCourses();
    },[]);

   function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit } = coursesList.reduce<{totalStudents:number,totalProfit:number}>(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += Number(course.pricing) * studentCount;
        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
      }
    );

    return {
      totalProfit,
      totalStudents,
    };
  }

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: calculateTotalStudentsAndProfit().totalProfit,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
export default InstructorDashboard