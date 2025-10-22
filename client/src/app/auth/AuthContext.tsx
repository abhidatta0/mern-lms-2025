import { initialSignInFormData, initialSignUpFormData } from '@/config';
import { registerUser, loginUser, checkAuth } from '@/services';
import {createContext, useState,useContext, useEffect } from 'react';
import type {FormEvent, ReactNode} from 'react';
import type { User } from './types';
import { Skeleton } from '@/components/ui/skeleton';

type AuthContextType = {
  signInFormData: typeof initialSignInFormData,
  signUpFormData: typeof initialSignUpFormData,
  setSignInFormData: (val:typeof initialSignInFormData)=>void,
  setSignUpFormData:(val:typeof initialSignUpFormData)=> void,
  handleRegisterUser:(event:FormEvent<HTMLFormElement>)=> void,
  handleLoginUser:(event:FormEvent<HTMLFormElement>)=> void,
  auth: {authenticated: boolean, user: User|null}
};
export const AuthContext = createContext<AuthContextType|null>(null);

export type Props = {
    children:ReactNode,
}
export default function AuthProvider({children}:Props){
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const [auth, setAuth] = useState({authenticated: false, user: null});
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const data = await registerUser(signUpFormData);
    console.log(data);
  }

  async function handleLoginUser(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const data = await loginUser(signInFormData);
    console.log(data);

    if(data.success){
       sessionStorage.setItem('accessToken',data.data.accessToken);
       setAuth({
        authenticated:true,
        user:data.data.user,
       })
    }else{
      setAuth({authenticated: false, user: null})
    }

  }


  async function checkAuthUser() {
    try{
      const data = await checkAuth();

      if(data.success){
        setAuth({
          authenticated:true,
          user:data.data.user,
        })
      }else{
        setAuth({authenticated: false, user: null})
      }
    }catch(e){
      console.error(e);
      setAuth({authenticated: false, user: null})
    }finally{
      setLoading(false); 
    }

  }
  useEffect(()=>{
    checkAuthUser()
  },[]);

   return (
    <AuthContext value={{signInFormData,signUpFormData,setSignInFormData, setSignUpFormData,
     handleRegisterUser,handleLoginUser,auth}}>
      {loading ? <Skeleton className="h-4 w-[250px]" /> :children}
    </AuthContext>
   )
}

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "useAuthContext has to be used within <AuthProvider>"
    );
  }

  return authContext;
};