import { initialSignInFormData, initialSignUpFormData } from '@/config';
import { registerUser } from '@/services';
import {createContext, useState,useContext } from 'react';
import type {FormEvent, ReactNode} from 'react';

type AuthContextType = {
  signInFormData: typeof initialSignInFormData,
  signUpFormData: typeof initialSignUpFormData,
  setSignInFormData: (val:typeof initialSignInFormData)=>void,
  setSignUpFormData:(val:typeof initialSignUpFormData)=> void,
  handleRegisterUser:(event:FormEvent<HTMLFormElement>)=> void,
};
export const AuthContext = createContext<AuthContextType|null>(null);

export type Props = {
    children:ReactNode,
}
export default function AuthProvider({children}:Props){
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  async function handleRegisterUser(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const data = await registerUser(signUpFormData);
    console.log(data);
  }

   return (
    <AuthContext value={{signInFormData,signUpFormData,setSignInFormData, setSignUpFormData, handleRegisterUser}}>
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