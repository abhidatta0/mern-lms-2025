import axiosInstance from "@/api/axiosInstance";
import type { CreateCoursePayload, InstructorCourse, UpdateCoursePayload } from "@/app/instructor/types";
import type { CourseProgress, Order } from "@/app/student/types";
import type { initialSignInFormData, initialSignUpFormData } from "@/config";
import {type AxiosRequestConfig} from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

async function apiCall<T = unknown>(
  {method, url,payload,config}:
  {method: HttpMethod,
  url: string,
  payload?: unknown,
  config?:AxiosRequestConfig,
}): Promise<T> {
  const response = await axiosInstance[method]<T>(
    url,
    method === 'get' || method === 'delete' ? undefined : payload,
    config,
  );

  return response.data;
}

export async function registerUser(formData: typeof initialSignUpFormData){
  return apiCall({method: 'post',url:'/auth/register',payload:{
    ...formData,
    role:'user'
  }});
}

export async function loginUser(formData: typeof initialSignInFormData){
  return apiCall({method: 'post',url:'/auth/login',payload:formData});
}

export async function checkAuth(){
  return apiCall({method: 'get',url:'/auth/check-auth'});
}

export async function mediaUploadService(formData:FormData, onProgressCallback:(completed: number)=> void) {
  return apiCall({method: 'post',url:'/media/upload',payload:formData, config:{
    onUploadProgress:progressEvent=>{
       const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
      );
      onProgressCallback(percentCompleted); 
    }
  }});
}

export async function mediaBulkUploadService(formData:FormData, onProgressCallback:(completed: number)=> void) {
   return apiCall({method: 'post',url:'/media/bulk-upload',payload:formData, config:{
    onUploadProgress:progressEvent=>{
       const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
      );
      onProgressCallback(percentCompleted); 
    }
  }});
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

export async function editCourseService(id:string,formData:UpdateCoursePayload) {
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

export async function fetchStudentViewCourseListService(query?: URLSearchParams) {
  const { data } = await axiosInstance.get(`/student/course/get?${query ?? ''}`);
  return data;
}


export async function fetchStudentViewCourseDetailsService(id:string, studentId: string) {
  const { data } = await axiosInstance.get(`/student/course/get/details/${id}/${studentId}`);
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

export async function fetchMyCourses(id:string) {
  const { data } = await axiosInstance.get(`/student/course/get/mycourses/${id}`);
  return data;
}

export async function getCurrentCourseProgressService({userId, courseId}:{userId:string, courseId:string}) {
  const { data } = await axiosInstance.post<{data: {courseDetails:InstructorCourse,isPurchased:boolean,progress:CourseProgress[],completed?:boolean},success:boolean}>(`/student/course/mycourse/progress`,{
    userId,
    courseId,
  });
  return data;
}

export async function markCurrentLectureAsViewedService({userId, courseId, lectureId}:{userId:string, courseId:string,lectureId:string}) {
  const { data } = await axiosInstance.post(`/student/course/mycourse/lecture-viewed`,{
    userId,
    courseId,
    lectureId,
  });
  return data;
}

export async function resetCurrentCourseProgressService({userId, courseId}:{userId:string, courseId:string}) {
  const { data } = await axiosInstance.post(`/student/course/mycourse/progress-reset`,{
    userId,
    courseId,
  });
  return data;
}