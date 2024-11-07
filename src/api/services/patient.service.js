import axios from 'axios';

export const patientService = {
    createPatient: async (patientData) => {
        try {
            const response = await axios.post('/api/patient/createpatient', patientData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};