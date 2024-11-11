import axios from 'axios';
import { authService } from './auth.service';
export const medicationService = {
    
    searchMedications: async (searchTerm) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/medication/search?Name=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in medication search:', error);
            throw error;
        }
    },

    getCurrentMedications: async (patientId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/patient/Medication?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting current medications:', error);
            throw error;
        }
    },

    deleteCurrentMedication: async (medicationData) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.post(`/api/patient/DeleteCurrentMedication`, medicationData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error removing medication:', error);
            throw error;
        }
    },

    saveCurrentMedication: async (medicationData) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.post(`/api/patient/currentMedication`, medicationData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error saving medication:', error);
            throw error;
        }
    }
}; 