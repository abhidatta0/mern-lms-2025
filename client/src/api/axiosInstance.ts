import axios, { AxiosError } from 'axios';
import { toast } from "sonner"

const axiosInstance = axios.create({
    baseURL:'http://localhost:5000'
});


axiosInstance.interceptors.request.use(config=>{
    const accessToken = sessionStorage.getItem('accessToken');
    
    // to check accessToken everytime page is refreshed
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }


    return config;
},(err)=> Promise.reject(err))

axiosInstance.interceptors.response.use(function onFulfilled(response) {
    return response;
  }, function onRejected(error) {
    if(error instanceof AxiosError){
        if(!error.config?.url?.includes('/auth/check-auth') && !error.response?.data.success){
            const message = error.response?.data.message ?? "Something went wrong";
            toast.error(message)
        }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
export default axiosInstance;