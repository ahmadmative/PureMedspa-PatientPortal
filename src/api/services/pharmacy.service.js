import axios from 'axios';
import { authService } from './auth.service';
export const pharmacyService = {
    searchPharmacy: async (params) => {
        const token = authService.getAccessToken();
        try {
            const queryString = new URLSearchParams({
                name: params.name || '',
                city: params.city || '',
                state: params.state || '',
                zipcode: params.zipcode || '',
                distance: params.distance || '1',
                type: params.type || '1',
                patientid: params.patientId
            }).toString();

            const response = await axios.get(`/api/pharmacy/search?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error searching pharmacy:', error);
            throw error;
        }
    },

    addPreferredPharmacy: async (patientId, pharmacyCode) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.post('/api/patient/addpreferredpharmacy', {
                PatientId: patientId,
                Code: pharmacyCode
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding preferred pharmacy:', error);
            throw error;
        }
    },

    getPreferredPharmacy: async (patientId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/patient/GetPreferredPharmacy?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in getting preferred pharmacy:', error);
            throw error;
        }
    }
}; 