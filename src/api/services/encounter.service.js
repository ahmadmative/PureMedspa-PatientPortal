import { axiosAuthInstance } from '../config/axios.config';
import { axiosInstance } from '../config/axios.config';
import axios from 'axios';
import { authService } from './auth.service';
export const encounterService = {

    createEncounterBackend: async (data) => {
        try {
            const token = authService.getAccessToken();
            const response = await axiosAuthInstance.post('/api/encounter', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Encounter error:', error);
            throw error;
        }
    },

    createEncounter: async (encounterData) => {
        try {
            const token = authService.getAccessToken();
            
            // First API call to create encounter
            const response = await axios.post('/api/encounter/create', encounterData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const encounterId = response.data;
            console.log('encounterId from 1st api call:', encounterId);

            // Check if first response is an integer
            if (!Number.isInteger(Number(encounterId))) {
                throw new Error('First API call did not return a valid encounter ID');
            }

            // Second API call to process payment
            const processPaymentData = {
                PatientId: encounterData.PatientId,
                EncounterId: encounterId,
                PaymentAmount: 0,
                IsSuccess: 1,
                PaymentId: "1",
                CreditCardLast4digit: "1111",
                ServiceTypeId: 1
            };

            const response1 = await axios.post(`/api/encounter/processpayment`, processPaymentData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const encounterId1 = response1.data.EncounterId;
            console.log('encounterId from 2nd api call:', encounterId1);

            // Check if second response is an integer
            if (!Number.isInteger(Number(encounterId1))) {
                throw new Error('Second API call did not return a valid encounter ID');
            }

            // Third API call to create encounter in backend
            const formData = new FormData();
            formData.append('encounter_id', encounterId1.toString());
            console.log('formData:', formData.get('encounter_id'));
            
            const response2 = await axiosAuthInstance.post('/api/encounter', formData);
            console.log('response2:', response2.data);
            return response2.data;

        } catch (error) {
            console.error('Error in encounter flow:', error);
            throw error;
        }
    },

    processPayment: async (data) => {
        const token = authService.getAccessToken();
        try {
            const response = await axiosAuthInstance.post('/api/encounter/processpayment', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in process payment:', error);
            throw error;
        }
    },

    getEncounters: async (patientId) => {
        try {
            const token = authService.getAccessToken();
            const response = await axios.get(`/api/encounter/GetEncounters?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting encounters:', error);
            throw error;
        }
    }
}; 