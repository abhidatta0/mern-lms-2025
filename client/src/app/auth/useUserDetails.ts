import { useAuthContext } from "./AuthContext";

// This is a special use to prevent cases like auth?.user?.id !!
export const useUserDetails = ()=>{
    const {auth} = useAuthContext();
    if(!auth.user){
      throw new Error("Should not happen")
    }

    return auth.user;
}

