import AuthPage from "./app/auth/page";
import {Route, Routes} from 'react-router-dom';
import RouteGuard from "./components/route-guard/RouteGuard";
import { useAuthContext } from "./app/auth/AuthContext";
import InstructorDashboard from "./app/instructor/page";
import StudentViewCommonLayout from "./components/student-view/CommonLayout";
import StudentHomePage from "./app/student/home/page";
import NotFoundPage from "./app/not-found/page";
function App() {
  const {auth} = useAuthContext();
  return (
    <Routes>
      <Route path="/auth" element={<RouteGuard 
      element={<AuthPage /> } 
      authenticated={auth.authenticated}
      user={auth.user}
      />} />

      <Route path="/instructor" element={<RouteGuard 
      element={<InstructorDashboard /> } 
      authenticated={auth.authenticated}
      user={auth.user}
      />} />

      <Route path="/" element={<RouteGuard 
      element={<StudentViewCommonLayout /> } 
      authenticated={auth.authenticated}
      user={auth.user}
      />}>
        <Route path="home" Component={StudentHomePage} />
      </Route>

      <Route path="*" Component={NotFoundPage} />
    </Routes>
  )
}

export default App
