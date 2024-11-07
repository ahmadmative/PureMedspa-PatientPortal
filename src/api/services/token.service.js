import axios from 'axios';

const getTokenFromServer = async () => {
    try {
        const formData = new URLSearchParams();
        formData.append('username', 'pankaj@iosandweb.net');
        formData.append('password', 'Iosandweb@@54321');
        formData.append('grant_type', 'password');

        const response = await axios.post('https://stgwbclientapi.azurewebsites.net/Token', 
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

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
                localStorage.setItem('AUTH_TOKEN', token);
            }
            return token;
        } catch (error) {
            console.error('Token fetch error:', error);
            throw error;
        }
    },

    getStoredToken: async () => {
        // If we have a cached token, return it
        if (cachedToken) {
            return cachedToken;
        }

        // If we're in the browser
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('AUTH_TOKEN');
            if (token) {
                cachedToken = token;
                return token;
            }
        }
        
        // If no token found, get a new one
        return await tokenService.getAuthToken();
    }
}; 