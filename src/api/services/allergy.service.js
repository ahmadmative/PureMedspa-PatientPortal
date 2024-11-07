import axios from 'axios';

export const allergyService = {
    searchAllergies: async (searchTerm) => {
        try {
            const response = await axios.get(`/api/allergy/search?Name=${searchTerm}`);
            return response.data;
        } catch (error) {
            console.error('Error in allergy search:', error);
            throw error;
        }
    },
    
    addAllergy: async (allergyData) => {
        try {
            const response = await axios.post('/api/patient/addallergy', allergyData);
            return response.data;
        } catch (error) {
            console.error('Error in adding allergy:', error);
            throw error;
        }
    },

    getCurrentAllergies: async (patientId) => {
        try {
            const response = await axios.get(`/api/patient/Allergies?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getting current allergies:', error);
            throw error;
        }
    },

    deleteAllergy: async (deletePayload) => {
        try {
            const response = await axios.post('/api/patient/deleteallergy', deletePayload);
            return response.data;
        } catch (error) {
            console.error('Error in deleting allergy:', error);
            throw error;
        }
    }
}; 