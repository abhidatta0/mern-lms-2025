import { Button } from "@/components/ui/button";
import {Link} from 'react-router-dom';
import { courseCategories } from "@/config";
import { useStudentContext } from "../StudentContext";
import { useEffect } from "react";
import { fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
import { createQueryStringForFilters } from "@/lib/utils";

const Home = () => {
  const {studentViewCoursesList, setStudentViewCoursesList} = useStudentContext();
  const navigate = useNavigate();
  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response.data);
  }

  function handleNavigateToCoursesPage(id:string) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [id],
    };

    const filtersParams = new URLSearchParams(createQueryStringForFilters(currentFilter));
    navigate(`/courses?${filtersParams}`);
  }
  
  useEffect(()=>{
   fetchAllStudentViewCourses();
  },[])

  return (
   <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
          <p className="text-bold text-gray-500">
            Our mision is to help people to find the best course online and learn with expert anytime, anywhere.
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src='/images/banner.png'
            width={600}
            height={400}
            className="w-full h-auto border-0 rounded-r-lg"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
       <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <Link to={`/course/details/${courseItem._id}`} key={courseItem._id}>
              <div
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem.pricing}
                  </p>
                </div>
              </div>
              </Link>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  )
}
export default Home;