import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortOptions, filterOptions } from "@/config";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useStudentContext } from "../StudentContext";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchStudentViewCourseListService } from "@/services";
import { useSearchParams } from "react-router-dom";


const createQueryStringForFilters = (filters:Record<string,string[]>)=>{
  const queryParams = [];
  for(const [key, value] of Object.entries(filters)){
    if(Array.isArray(value) && value.length >0){
      const paramValue = value.join(',');
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join('&');
}
const CoursesListPage = () => {
  const [sort, setSort] = useState(sortOptions[0].id);
  const [filters, setFilters] = useState<Record<string,string[]>>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {studentViewCoursesList, setStudentViewCoursesList} = useStudentContext();

  async function fetchAllStudentViewCourses() {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    })
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) setStudentViewCoursesList(response.data);
  }

  useEffect(()=>{
    if(filters!==null && sort !== null){
      fetchAllStudentViewCourses();
    }
  },[filters,sort]);

  useEffect(()=>{
    const buildQueryStringForFilters = createQueryStringForFilters(filters);
    setSearchParams(buildQueryStringForFilters);
  },[filters]);

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
      }

      console.log({indexOfCurrentOption});
    }
    setFilters(copyFilters)
  }

  return (
    <div>
     <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div>
            {
              Object.entries(filterOptions).map(([keyItem, values])=>(
                <div className="space-y-4 p-4" key={keyItem}>
                  <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                  <div className="grid gap-2 mt-2">
                    {
                     values.map((option)=>(
                      <Label className="flex font-medium items-center gap-3" key={option.id}>
                          <Checkbox checked={Object.keys(filters).length > 0 && filters[keyItem]?.includes(option.id)} onCheckedChange={()=> handleFilterOnChange(keyItem,option.id)}/>
                          {option.label}
                      </Label>
                     ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
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
            <span className="text-sm text-black font-bold">
              {studentViewCoursesList.length} Results
            </span>
          </div>
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  className="cursor-pointer"
                  key={courseItem._id}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem.image}
                        className="w-ful h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By{" "}
                        <span className="font-bold">
                          {courseItem.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mt-3 mb-2">
                        {`${courseItem.curriculum.length} ${
                          courseItem.curriculum.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">
                        ${courseItem.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
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