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


const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signin');

  const [formData, setFormData] = useState({});
  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={'/'} className="flex items-center justify-center">
          <GraduationCap className="size-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
       </header>
       <div className="flex items-center justify-center min-h-screen bg-background">
         <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="signin" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <CommonForm buttonText="Submit" 
              formControls={signInFormControls} formData={formData} setFormData={setFormData}
              handleSubmit={(data)=> console.log(data)}
              />
            </TabsContent>
            <TabsContent value="signup">
              <CommonForm buttonText="Submit" 
              formControls={signUpFormControls} formData={formData} setFormData={setFormData}
              handleSubmit={(data)=> console.log(data)}
              />
            </TabsContent>
          </Tabs>
       </div>
    </div> 
  )
}
export default AuthPage;