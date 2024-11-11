import axios from 'axios';
import cors from '../middleware/cors';

export default async function handler(req, res) {
    await cors(req, res);

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { patientId } = req.query;

    if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]
        const response = await axios.get(
            `https://stgwbclientapi.azurewebsites.net/api/encounter/GetEncounters?patientId=${patientId}`,
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