import { useAuthContext } from "@/app/auth/AuthContext";
import { Navigate, useLocation, Outlet } from "react-router-dom"

const RouteGuard = () => {

  const location = useLocation();
  const {auth} = useAuthContext();

  const {authenticated} = auth;


  if(!authenticated && !location.pathname.includes('/auth')){
    return <Navigate to="/auth" />
  }

  return (
    <Outlet />
  )
}
export default RouteGuard