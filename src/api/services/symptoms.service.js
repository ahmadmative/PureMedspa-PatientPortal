import axios from 'axios';
import { authService } from './auth.service';

export const symptomsService = {
    getSymptoms: async (conditionId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/reason/symptoms?conditionId=${conditionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in symptoms service:', error);
            throw error;
        }
    }
}; 