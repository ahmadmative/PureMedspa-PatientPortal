import { axiosAuthInstance } from '../config/axios.config';

export const authService = {
    login: async (email, password) => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await axiosAuthInstance.post('/api/login', formData);
            
            if (response.data.token) {
                localStorage.setItem('AUTH_TOKEN_BACKEND', response.data.token);
                // Save user data
                localStorage.setItem('USER', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('AUTH_TOKEN_BACKEND');
    },

    logout: () => {
        localStorage.removeItem('AUTH_TOKEN_BACKEND');
        localStorage.removeItem('USER'); // Also remove user data on logout
    },

    // Add method to get user data
    getCurrentUser: () => {
        const userStr = localStorage.getItem('USER');
        return userStr ? JSON.parse(userStr) : null;
    }
}; 