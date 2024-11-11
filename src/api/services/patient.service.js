import axios from 'axios';
import { tokenService } from './token.service';

export const patientService = {
    createPatient: async (patientData) => {
        try {
            const token = await tokenService.getAuthToken();
            console.log('Retrieved new token from patient.service Token:', token);
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