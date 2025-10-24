import axiosInstance from "@/api/axiosInstance";
import type { initialSignInFormData, initialSignUpFormData } from "@/config";

export async function registerUser(formData: typeof initialSignUpFormData){
    const {data} = await axiosInstance.post('/auth/register',{
      ...formData,
      role:'user'
    });

    return data;
}

export async function loginUser(formData: typeof initialSignInFormData){
    const {data} = await axiosInstance.post('/auth/login',{
      ...formData,
    });

    return data;
}

export async function checkAuth(){
    const {data} = await axiosInstance.get('/auth/check-auth');

    return data;
}

export async function mediaUploadService(formData:FormData, onProgressCallback:(completed: number)=> void) {
  const { data } = await axiosInstance.post("/media/upload", formData,{
    onUploadProgress:progressEvent=>{
       const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
      );
      onProgressCallback(percentCompleted); 
    }
  });

  return data;
}

export async function deleteSingleMedia(publicId: string) {
  const { data } = await axiosInstance.post(`/media/delete`,{
    publicId,
  });

  return data;
}