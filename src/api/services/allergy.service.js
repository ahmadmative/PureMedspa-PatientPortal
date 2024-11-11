import axios from 'axios';
import { authService } from './auth.service';

export const allergyService = {
    searchAllergies: async (searchTerm) => {
        try {
            const token = authService.getAccessToken();

            const response = await axios.get(`/api/allergy/search?Name=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in allergy search:', error);
            throw error;
        }
    },
    
    addAllergy: async (allergyData) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.post('/api/patient/addallergy', allergyData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in adding allergy:', error);
            throw error;
        }
    },

    getCurrentAllergies: async (patientId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/patient/Allergies?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in getting current allergies:', error);
            throw error;
        }
    },

    deleteAllergy: async (deletePayload) => {
        try {
                const token = authService.getAccessToken();
            const response = await axios.post('/api/patient/deleteallergy', deletePayload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in deleting allergy:', error);
            throw error;
        }
    }
}; 