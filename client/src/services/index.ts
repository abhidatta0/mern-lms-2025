import axiosInstance from "@/api/axiosInstance";
import type { initialSignInFormData } from "@/config";

export async function registerUser(formData: typeof initialSignInFormData){
    const data = await axiosInstance.post('/auth/register',{
      ...formData,
      role:'user'
    });

    return data;
}