import axios from 'axios';

export const lifestyleService = {
    saveLifestyle: async (lifestyleData) => {
        try {
            const response = await axios.post('/api/patient/lifestyle', lifestyleData);
            return response.data;
        } catch (error) {
            console.error('Error in lifestyle service:', error);
            throw error;
        }
    },

    getLifestyle: async (patientId) => {
        try {
            const response = await axios.get(`/api/patient/getlifestyle?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error in lifestyle service:', error);
            throw error;
        }
    }
};