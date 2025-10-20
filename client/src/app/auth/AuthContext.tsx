import {createContext } from 'react';
import type {ReactNode} from 'react';

export const AuthContext = createContext(null);

export type Props = {
    children:ReactNode,
}
export default function AuthProvider({children}:Props){
   return (
    <AuthContext value={null}>
      {children}
    </AuthContext>
   )
}