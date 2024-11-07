import axios from 'axios';
export const physicianService = {

    getPrimaryPhysician: async (patientId) => {
        try {
            const response = await axios.get(`/api/patient/GetPrimaryPhysician?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getting primary physician:', error);
            throw error;
        }
    }
}; 