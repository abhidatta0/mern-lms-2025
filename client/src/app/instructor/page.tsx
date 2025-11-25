import { BarChart, Book, LogOut } from "lucide-react";
import InstructorCourses from "./courses";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import InstructorDashboard from "./InstructorDashboard";
import { useAuthContext } from "../auth/AuthContext";

const menuItems = [
    {
      icon:BarChart,
      label:'Dashboard',
      value:'dashboard',
      component:<InstructorDashboard />
    },
     {
      icon:Book,
      label:'Courses',
      value:'courses',
      component:<InstructorCourses />
    },
];
const InstructorDashboardRoot = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const {resetCredentials} = useAuthContext();
  const handleLogout = ()=>{
    resetCredentials();
    sessionStorage.clear();
  }
  
  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold b-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem)=> (
              <Button className="w-full justify-start mb-2" key={menuItem.value}
              variant={activeTab === menuItem.value ? 'default':'ghost'}
              onClick={
                menuItem.value === 'logout' ? handleLogout: ()=> setActiveTab(menuItem.value)
              }
              >
                <menuItem.icon className="mr-2 size-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>  
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {menuItems.map((menuItem)=>(
                <TabsContent key={menuItem.value} value={menuItem.value}>
                  {menuItem.component !== null ? menuItem.component: null}
                </TabsContent>
              ))}
            </Tabs>
          </div>
      </main>
    </div>
  )
}
export default InstructorDashboardRoot;