import axios from 'axios';
import cors from '../middleware/cors'
import { tokenService } from '../../../api/services/token.service';

export default async function handler(req, res) {
    // Run cors middleware
    await cors(req, res)

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get token directly
        const token = await tokenService.getAuthToken();
        
        console.log('Token:', token); // This should now show the actual token

        const response = await axios.get(
            'https://stgwbclientapi.azurewebsites.net/api/reason/conditions',
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