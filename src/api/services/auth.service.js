import { axiosAuthInstance } from '../config/axios.config';

export const authService = {
    login: async (email, password) => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await axiosAuthInstance.post('/api/login', formData);
            
            if (response.data.token) {
                window.localStorage.setItem('AUTH_TOKEN_BACKEND', response.data.token);
                // Save user data
                window.localStorage.setItem('USER', JSON.stringify(response.data.user));

                window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!window.localStorage.getItem('AUTH_TOKEN_BACKEND');
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('AUTH_TOKEN_BACKEND');
            window.localStorage.removeItem('USER'); // Also remove user data on logout
            window.localStorage.removeItem('ACCESS_TOKEN');
            // window.localStorage.removeItem('STGWB_AUTH_TOKEN');
        }
    },

    // Add method to get user data
    getCurrentUser: () => {
        const userStr = window.localStorage.getItem('USER');
        return userStr ? JSON.parse(userStr) : null;
    },

    getAccessToken: () => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('ACCESS_TOKEN');
        }
        return 'window is undefined';
    }
}; 
