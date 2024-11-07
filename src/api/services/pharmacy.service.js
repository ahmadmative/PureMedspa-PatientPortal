import axios from 'axios';
export const pharmacyService = {
    searchPharmacy: async (params) => {
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

            const response = await axios.get(`/api/pharmacy/search?${queryString}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error searching pharmacy:', error);
            throw error;
        }
    },

    addPreferredPharmacy: async (patientId, pharmacyCode) => {
        try {
            const response = await axios.post('/api/patient/addpreferredpharmacy', {
                PatientId: patientId,
                Code: pharmacyCode
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
            const response = await axios.get(`/api/patient/GetPreferredPharmacy?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getting preferred pharmacy:', error);
            throw error;
        }
    }
}; 