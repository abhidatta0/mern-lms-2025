import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function artificalDelay(){
  return new Promise((res)=> setTimeout(res,3000))
}

export const createQueryStringForFilters = (filters:Record<string,string[]|string>)=>{
  const queryParams = [];
  for(const [key, value] of Object.entries(filters)){
    if(Array.isArray(value) && value.length >0){
      const paramValue = value.join(',');
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join('&');
}