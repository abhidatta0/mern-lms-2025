import { useAuthContext } from "@/app/auth/AuthContext";
import { Navigate, useLocation, Outlet } from "react-router-dom"

const RouteGuard = () => {

  const location = useLocation();
  const {auth} = useAuthContext();

  const {authenticated, user} = auth;


  if(!authenticated && !location.pathname.includes('/auth')){
    return <Navigate to="/auth" />
  }

  if(authenticated && user?.role !== 'instructor' && (location.pathname.includes('instructor') || location.pathname.includes('auth'))){
    return <Navigate to="/home" />
  }

  if(authenticated && user?.role === 'instructor' && !location.pathname.includes('instructor')){
    return <Navigate to="/instructor" />
  }
  return (
    <Outlet />
  )
}
export default RouteGuard