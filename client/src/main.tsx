import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './app/auth/AuthContext.tsx'
import InstructorProvider from './app/instructor/InstructorContext.tsx'
import StudentProvider from './app/student/StudentContext.tsx'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
         <App />
        </StudentProvider>
      </InstructorProvider>
    </AuthProvider>
    <Toaster position="top-center" duration={3000}/>
    </BrowserRouter>
  </StrictMode>,
)
