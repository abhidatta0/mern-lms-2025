import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useCallback, Fragment } from "react";
import { ArrowUpDownIcon,SlidersHorizontal , UserRound} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortOptions, filterOptions, courseCategories } from "@/config";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { useStudentContext } from "../StudentContext";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchStudentViewCourseListService } from "@/services";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {useNavigate} from 'react-router-dom';
import type { InstructorCourse } from "@/app/instructor/types";
import { useUserDetails } from "@/app/auth/useUserDetails";
import { Badge } from "@/components/ui/badge"
import { createQueryStringForFilters } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"

const CoursesListPage = () => {
  const navigate = useNavigate();
  const user = useUserDetails();
  const [sort, setSort] = useState(sortOptions[0].id);
  const [filters, setFilters] = useState<Record<string,string[]>>({});
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log({searchParams})
  const {studentViewCoursesList, setStudentViewCoursesList, isLoading, setIsLoading} = useStudentContext();

  const fetchAllStudentViewCourses = useCallback(async ()=> {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    })
    setIsLoading(true);
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) setStudentViewCoursesList(response.data);
    setIsLoading(false);
  },[filters, setIsLoading, setStudentViewCoursesList, sort])

  useEffect(()=>{
    if(filters!==null && sort !== null){
      fetchAllStudentViewCourses();
    }
  },[filters,sort, setIsLoading, setStudentViewCoursesList, fetchAllStudentViewCourses]);

  useEffect(()=>{
    const buildQueryStringForFilters = createQueryStringForFilters(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  },[filters, setSearchParams]);

  const updateFilters = useCallback((key:string, value:string)=>{
     setFilters({
        ...filters,
        [key]:value.split(','),
      })
  },[filters]);

  useEffect(()=>{
    for(const [key, value] of searchParams.entries()){
      updateFilters(key, value);
    }
  },[]);

  const handleFilterOnChange = (section: string, currentOptionId: string)=>{
    let copyFilters = {...filters};
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(section);

    if(indexOfCurrentSection === -1){
      copyFilters = {
        ...copyFilters,
        [section]:[currentOptionId]
      }
    }
    else{
      const indexOfCurrentOption = copyFilters[section].indexOf(currentOptionId);
      
      if(indexOfCurrentOption === -1){
        copyFilters[section].push(currentOptionId);
      }else{
        copyFilters[section].splice(indexOfCurrentOption,1);
        if(copyFilters[section].length === 0){
          const {[section]:_, ...rest} = copyFilters;
          copyFilters = {...rest};
        }
      }

      console.log({indexOfCurrentOption});
    }
    setFilters(copyFilters);
  }

  const isCourseBought = (course:InstructorCourse)=>{
    return course.students.findIndex(s=> s.studentId === user._id) !== -1;
  }

  return (
    <div>
     <div className="container mx-auto p-4 space-y-2">
      <h1 className="text-3xl font-bold">All Courses</h1>
      <div className="flex justify-between items-center mb-2">
        <div>
          <Button variant='outline' onClick={()=> setShowFiltersSidebar(!showFiltersSidebar)}>
            <SlidersHorizontal className="text-primary"/>
            Filter
            {Object.keys(filters).length > 0 && <div className="size-1 bg-primary rounded-full"></div>}
          </Button>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <span className="text-sm">Sort by:</span>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>{sortOptions.find(option=> option.id === sort)?.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-6">
        <span className="text-sm text-black font-bold self-end">
          {studentViewCoursesList.length} Results
        </span>
        <Separator />
      </div>
      <div className={`flex flex-col md:flex-row ${showFiltersSidebar && 'gap-4'}`}>
        <aside 
        className={`space-y-4 overflow-hidden transition-all duration-200 ${
            showFiltersSidebar ? "w-[250px] border" : "w-0"
          }`}
        >
          {
            Object.entries(filterOptions).map(([keyItem, values])=>(
              <Fragment key={keyItem}>
              <div className="p-4">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {
                    values.map((option)=>(
                    <Label className="flex font-medium items-center gap-3" key={option.id}>
                        <Checkbox checked={Object.keys(filters).length > 0 && filters[keyItem] && filters[keyItem].includes(option.id)} onCheckedChange={()=> handleFilterOnChange(keyItem,option.id)}/>
                        {option.label}
                    </Label>
                    ))
                  }
                </div>
              </div>
              <Separator />
              </Fragment>
            ))
          }
        </aside>
        <main className="flex-1">
          <div className="space-y-4 flex flex-wrap gap-2">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  className="cursor-pointer w-[300px] h-full flex flex-col justify-between"
                  key={courseItem._id}
                  onClick={()=> navigate(`/course/details/${courseItem._id}`)}
                >
                  <CardContent className="space-y-4 ">
                      <img
                        src={courseItem.image}
                        className="w-full h-[234px] object-fill"
                      />
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 p-1 text-sm text-primary">
                        {courseCategories.find(c=> c.id === courseItem.category)?.label ?? ''}
                        </div>
                        <p className="font-bold text-base text-primary">
                          ${courseItem.pricing}
                        </p>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {courseItem.title}
                      </CardTitle> 
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between h-[30px] items-center border-t">
                      {isCourseBought(courseItem) ? <Badge variant='outline'>Already Enrolled</Badge> : <Badge> View Course</Badge>}
                      {courseItem.students.length > 0 && <div className="flex items-center justify-between gap-0.5">
                        <UserRound className='h-5 text-primary'/>
                        <span className="text-base">{courseItem.students.length} students</span>
                      </div>}
                  </CardFooter>
                </Card>
              ))
            ) : isLoading ? <Skeleton className="w-full h-[250px]"/> : (
              <h1 className="font-extrabold text-4xl">No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
    </div>
  )
}
export default CoursesListPage;