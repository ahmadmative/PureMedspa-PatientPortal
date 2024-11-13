import axios from 'axios';
import cors from '../middleware/cors'
import { tokenService } from '../../../api/services/token.service';

export default async function handler(req, res) {
    await cors(req, res)

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { conditionId } = req.query;

    if (!conditionId) {
        return res.status(400).json({ message: 'Condition ID is required' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]

        const response = await axios.get(
            `https://wbclientapi.webdoctors.com/api/reason/symptoms?conditionId=${conditionId}`,
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
        return res.status(error.response?.status || 500).json(
            error.response?.data || { message: 'Internal server error' }
        );
    }
} 