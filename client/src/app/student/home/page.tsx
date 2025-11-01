import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const StudentViewCommonLayout = () => {
  const location = useLocation();
 
  console.log({location})
  const shouldHeaderBeShown = ()=> !(location.pathname.startsWith("/course-progress"))
  return (
    <div>
      {shouldHeaderBeShown() && <Header />}
      <Outlet />
    </div>
  )
}
export default StudentViewCommonLayout