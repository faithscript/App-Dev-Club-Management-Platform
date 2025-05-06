import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout for image uploads
    maxContentLength: 10 * 1024 * 1024, // 10MB max content length
});

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios error:', error);
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        }
        return Promise.reject(error);
    }
);