import axiosInstance from "@/api/axiosInstance";
import type { CreateCoursePayload } from "@/app/instructor/types";
import type { Order } from "@/app/student/types";
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

export async function mediaBulkUploadService(formData:FormData, onProgressCallback:(completed: number)=> void) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData,{
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

export async function addNewCourseService(formData:CreateCoursePayload) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function editCourseService(id:string,formData:CreateCoursePayload) {
  const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);

  return data;
}


export async function fetchInstructorCourseListService(instructorId: string) {
  const { data } = await axiosInstance.get(`/instructor/course/get/list/${instructorId}`);

  return data;
}


export async function fetchInstructorCourseDetailsService(id:string) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function fetchStudentViewCourseListService(query: URLSearchParams) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);
  return data;
}


export async function fetchStudentViewCourseDetailsService(id:string) {
  const { data } = await axiosInstance.get(`/student/course/get/details/${id}`);
  return data;
}

export async function createPaymentService(payload: Order) {
  const { data } = await axiosInstance.post(`/student/order/create`, payload);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId:string,
  payerId:string,
  orderId:string
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}