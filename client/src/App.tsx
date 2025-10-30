import AuthPage from "./app/auth/page";
import {Route, Routes} from 'react-router-dom';
import RouteGuard from "./components/route-guard/RouteGuard";
import StudentHomePage from "./app/student/home/page";
import NotFoundPage from "./app/not-found/page";
import AddNewCourse from "./app/instructor/courses/add-new-course/AddNewCourse";
import InstructorDashboardRoot from "./app/instructor/page";
import CoursesListPage from "./app/student/courses/CoursesListPage";
import Home from "./app/student/home/Home";
import CourseDetails from "./app/student/course-details/CourseDetails";
import PaymentReturn from "./app/student/payment/PaymentReturn";
import MyCoursesList from "./app/student/courses/MyCoursesList";
import CourseProgress from "./app/student/course-progress/CourseProgress";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RouteGuard />}>
        <Route path="/"  Component={StudentHomePage} >
           <Route path="home"  Component={Home} />
           <Route path="courses" Component={CoursesListPage} />
           <Route path="course/details/:id" Component={CourseDetails} />
           <Route path="payment-return" Component={PaymentReturn} />
           <Route path="student-courses" Component={MyCoursesList} />
           <Route path="course-progress/:id" Component={CourseProgress} />
        </Route>
        <Route path="auth" Component={AuthPage}/>
        <Route path="instructor">
          <Route index Component={InstructorDashboardRoot} />
          <Route path="create-new-course" Component={AddNewCourse}/>
          <Route path="edit-course/:courseId" Component={AddNewCourse} />
        </Route>
      </Route>

      <Route path="*" Component={NotFoundPage} />
    </Routes>
  )
}

export default App
