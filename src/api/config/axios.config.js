import axios from 'axios';
import { tokenService } from '../services/token.service';

// Create instance for backend API (login/auth)
const axiosAuthInstance = axios.create({
    baseURL: 'https://puremedspa.alturahc.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'multipart/form-data'
        // 'Content-Type': 'application/json'
    }
});

// Create instance for main API
const axiosInstance = axios.create({
    baseURL: 'https://wbclientapi.webdoctors.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for auth instance
axiosAuthInstance.interceptors.request.use(
    (config) => {
        const backendToken = window.localStorage.getItem('AUTH_TOKEN_BACKEND');
        if (backendToken) {
            config.headers.Authorization = `Bearer ${backendToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add request interceptor for main instance
axiosInstance.interceptors.request.use(
    async (config) => {
        let token = tokenService.getStoredToken();
        
        // If no token exists, try to get a new one
        if (!token) {
            try {
                await tokenService.getAuthToken();
                token = tokenService.getStoredToken();
            } catch (error) {
                console.error('Failed to get auth token:', error);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosInstance, axiosAuthInstance };

