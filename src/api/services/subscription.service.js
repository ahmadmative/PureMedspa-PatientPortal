import { axiosAuthInstance } from '../config/axios.config';

export const subscriptionService = {
    createSubscription: async (data) => {
        try {
            const response = await axiosAuthInstance.post('/api/subscription', data);
            return response.data;
        } catch (error) {
            console.error('Subscription error:', error);
            throw error;
        }
    }
}; 