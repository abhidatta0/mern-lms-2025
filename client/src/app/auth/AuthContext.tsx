import { initialSignInFormData, initialSignUpFormData } from '@/config';
import { registerUser, loginUser, checkAuth } from '@/services';
import {createContext, useState,useContext, useEffect } from 'react';
import type {FormEvent, ReactNode} from 'react';

type AuthContextType = {
  signInFormData: typeof initialSignInFormData,
  signUpFormData: typeof initialSignUpFormData,
  setSignInFormData: (val:typeof initialSignInFormData)=>void,
  setSignUpFormData:(val:typeof initialSignUpFormData)=> void,
  handleRegisterUser:(event:FormEvent<HTMLFormElement>)=> void,
  handleLoginUser:(event:FormEvent<HTMLFormElement>)=> void,
};
export const AuthContext = createContext<AuthContextType|null>(null);

export type Props = {
    children:ReactNode,
}
export default function AuthProvider({children}:Props){
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const [auth, setAuth] = useState({authenticate: false, user: null});

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
        authenticate:true,
        user:data.data.user,
       })
    }else{
      setAuth({authenticate: false, user: null})
    }
  }


  async function checkAuthUser() {
    const data = await checkAuth();

    if(data.success){
      setAuth({
        authenticate:true,
        user:data.data.user,
       })
    }else{
      setAuth({authenticate: false, user: null})
    }

  }
  useEffect(()=>{
    checkAuthUser()
  },[]);

   return (
    <AuthContext value={{signInFormData,signUpFormData,setSignInFormData, setSignUpFormData,
     handleRegisterUser,handleLoginUser}}>
      {children}
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