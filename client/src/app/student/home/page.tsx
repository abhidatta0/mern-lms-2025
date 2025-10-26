import { useAuthContext } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";

const StudentViewCommonLayout = () => {
  const {resetCredentials} = useAuthContext();

   const handleLogout = ()=>{
    resetCredentials();
    sessionStorage.clear();
  }
  return (
    <div>StudentViewCommonLayout

     <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
export default StudentViewCommonLayout