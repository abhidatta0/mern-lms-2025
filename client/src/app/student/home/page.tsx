import { Outlet } from "react-router-dom";
import Header from "./Header";

const StudentViewCommonLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
export default StudentViewCommonLayout