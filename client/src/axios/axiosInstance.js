import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast';

  export const axiosInstance = axios.create({
        baseURL:'http://localhost:8000/api/v1',
        withCredentials:true
    });


    axiosInstance.interceptors.response.use(
        (res) => res,
        async(error) => {
            console.log("axios Interceptors called...");
            const orginalRequest = error.config;
            if(error.response.status === 401 && !orginalRequest._retry){
                orginalRequest._retry = true;
                try {
                    await axiosInstance.post('http://localhost:8000/api/v1/refresh-token');
                   return axiosInstance(orginalRequest);
                } catch (refreshError) {
                    toast.error('Token Expired Please Login again');
                   window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );