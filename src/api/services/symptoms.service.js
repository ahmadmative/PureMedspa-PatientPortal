import axios from 'axios';

export const symptomsService = {
    getSymptoms: async (conditionId) => {
        try {
            const response = await axios.get(`/api/reason/symptoms?conditionId=${conditionId}`);
            return response.data;
        } catch (error) {
            console.error('Error in symptoms service:', error);
            throw error;
        }
    }
}; 