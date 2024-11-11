import axios from 'axios';
import cors from './middleware/cors'

export default async function handler(req, res) {
    await cors(req, res);

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('username', 'pankaj@iosandweb.net');
        formData.append('password', 'Iosandweb@@54321');
        formData.append('grant_type', 'password');

        const response = await axios.post(
            'https://stgwbclientapi.azurewebsites.net/Token',
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal server error' });
    }
} 