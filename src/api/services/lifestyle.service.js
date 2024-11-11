import axios from 'axios';
import { authService } from './auth.service';

export const lifestyleService = {
    saveLifestyle: async (lifestyleData) => {
        try {
            const token = authService.getAccessToken();
            console.log("token from save lifestyle", token);
            const response = await axios.post('/api/patient/lifestyle', lifestyleData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in lifestyle service:', error);
            throw error;
        }
    },

    getLifestyle: async (patientId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/patient/getlifestyle?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in lifestyle service:', error);
            throw error;
        }
    }
};