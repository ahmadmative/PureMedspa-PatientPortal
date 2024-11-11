import axios from 'axios';
import { authService } from './auth.service';


export const conditionsService = {
    getConditions: async () => {
        try {
            const token = authService.getAccessToken();
            
            const response = await axios.get('/api/reason/conditions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in conditions service:', error);
            throw error;
        }
    }
};