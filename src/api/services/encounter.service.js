import { axiosAuthInstance } from '../config/axios.config';
import { axiosInstance } from '../config/axios.config';
import axios from 'axios';

export const encounterService = {
    
    createEncounterBackend: async (data) => {
        try {
            const response = await axiosAuthInstance.post('/api/encounter', data);
            return response.data;
        } catch (error) {
            console.error('Encounter error:', error);
            throw error;
        }
    },

    createEncounter: async (encounterData) => {
        try {
            const response = await axios.post('/api/encounter/create', encounterData);
            const encounterId = response.data;

            console.log('encounterId from 1st api call:', encounterId);

            const formData = new FormData();
            formData.append('encounter_id', encounterId.toString());

            console.log('formData:', formData.get('encounter_id'));
            const response2 = await axiosAuthInstance.post('/api/encounter', formData);
            console.log('response2:', response2.data);
            return encounterId;
        } catch (error) {
            console.error('Error in encounter flow:', error);
            throw error;
        }
    },

    getEncounters: async (patientId) => {
        try {
            const response = await axios.get(`/api/encounter/GetEncounters?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting encounters:', error);
            throw error;
        }
    }
}; 