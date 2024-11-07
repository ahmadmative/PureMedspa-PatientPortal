import axios from 'axios';
import cors from '../middleware/cors'
import { tokenService } from '@components/api/services/token.service';

export default cors(async function handler(req, res) {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { patientId } = req.query;
        const token = tokenService.getStoredToken();

        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const response = await axios.get(
            `https://stgwbclientapi.azurewebsites.net/api/encounter/GetEncounters?patientId=${patientId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Set CORS headers for the actual response
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal server error' });
    }
}); 