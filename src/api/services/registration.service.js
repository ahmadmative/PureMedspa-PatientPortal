import { axiosAuthInstance } from '../config/axios.config';

export const registrationService = {
    register: async (formData) => {
        try {
            const response = await axiosAuthInstance.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}; 