import axios from 'axios';
import { authService } from './auth.service';
export const physicianService = {
    getPrimaryPhysician: async (patientId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/patient/GetPrimaryPhysician?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in getting primary physician:', error);
            throw error;
        }
    }
}; 