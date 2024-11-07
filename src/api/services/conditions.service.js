import axios from 'axios';

export const conditionsService = {
    getConditions: async () => {
        try {
            const response = await axios.get('/api/reason/conditions');
            return response.data;
        } catch (error) {
            console.error('Error in conditions service:', error);
            throw error;
        }
    }
};