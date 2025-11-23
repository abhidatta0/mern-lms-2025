import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState } from "react";
import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthContext } from "./AuthContext";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signin');


  const {signInFormData, signUpFormData, setSignInFormData, setSignUpFormData,handleRegisterUser, handleLoginUser} = useAuthContext();

  const checkIfSignInFormValid = ()=>{
    return signInFormData && signInFormData.userEmail.trim() != '' && signInFormData.password.trim() != '';
  }

   const checkIfSignUpFormValid = ()=>{
    return signUpFormData && signUpFormData.userEmail.trim()  != '' && signUpFormData.password.trim() != '';
  }

  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={'/'} className="flex items-center justify-center">
          <GraduationCap className="size-8 mr-4" />
          <span className="font-extrabold text-xl">E-tutor</span>
        </Link>
       </header>
       <div className="flex items-center justify-center min-h-screen bg-background">
         <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="signin" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Login</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommonForm buttonText="Login" 
                    formControls={signInFormControls} formData={signInFormData} setFormData={setSignInFormData}
                    handleSubmit={handleLoginUser}
                    isButtonDisabled={!checkIfSignInFormValid()}
                    />
                </CardContent>
              </Card>
              
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommonForm buttonText="Register" 
                  formControls={signUpFormControls} formData={signUpFormData} setFormData={setSignUpFormData}
                  handleSubmit={handleRegisterUser}
                  isButtonDisabled={!checkIfSignUpFormValid()}
                  />
                </CardContent>
              </Card>
             
            </TabsContent>
          </Tabs>
       </div>
    </div> 
  )
}
export default AuthPage;