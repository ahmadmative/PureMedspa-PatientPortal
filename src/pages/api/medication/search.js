import axios from 'axios';
import cors from '../middleware/cors';
import { tokenService } from '../../../api/services/token.service';

export default async function handler(req, res) {
    await cors(req, res);

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { Name } = req.query;

    if (!Name || Name.length < 3) {
        return res.status(400).json({ message: 'Search term must be at least 3 characters' });
    }

    try {
        // Get token from service
        const token = await tokenService.getAuthToken();

        const response = await axios.get(
            `https://stgwbclientapi.azurewebsites.net/api/medication/search?Name=${Name}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal server error' });
    }
} 