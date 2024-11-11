import axios from 'axios';
import { authService } from './auth.service';

export const patientService = {
    createPatient: async (patientData) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.post('/api/patient/createpatient', patientData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};