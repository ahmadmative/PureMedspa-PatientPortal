import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getTokenFromServer = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Token`);
        console.log('got response from token =>>>>>>>>>>>>>>>>>>', response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error('Token fetch error:', error);
        throw error;
    }
};

let cachedToken = null;

export const tokenService = {
    getAuthToken: async () => {
        try {
            const token = await getTokenFromServer();
            cachedToken = token;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('STGWB_AUTH_TOKEN', token);
            }
            return token;
        } catch (error) {
            console.error('Token fetch error:', error);
            throw error;
        }
    },

    getStoredToken: async () => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('STGWB_AUTH_TOKEN');
        }
        return null;
    }
}; 