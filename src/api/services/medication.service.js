import axios from 'axios';
export const medicationService = {
    
    searchMedications: async (searchTerm) => {
        try {
            const response = await axios.get(`/api/medication/search?Name=${searchTerm}`);
            return response.data;
        } catch (error) {
            console.error('Error in medication search:', error);
            throw error;
        }
    },

    getCurrentMedications: async (patientId) => {
        try {
            const response = await axios.get(`/api/patient/Medication?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting current medications:', error);
            throw error;
        }
    },

    deleteCurrentMedication: async (medicationData) => {
        try {
            const response = await axios.post(`/api/patient/DeleteCurrentMedication`, medicationData);
            return response.data;
        } catch (error) {
            console.error('Error removing medication:', error);
            throw error;
        }
    },

    saveCurrentMedication: async (medicationData) => {
        try {
            const response = await axios.post(`/api/patient/currentMedication`, medicationData);
            return response.data;
        } catch (error) {
            console.error('Error saving medication:', error);
            throw error;
        }
    }
}; 