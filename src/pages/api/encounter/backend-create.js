import axios from 'axios';
import cors from '../middleware/cors';

export default async function handler(req, res) {
    await cors(req, res);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { encounter_id } = req.body;
    const backendToken = req.headers.authorization?.split(' ')[1];

    if (!encounter_id || !backendToken) {
        return res.status(400).json({ 
            message: 'Encounter ID and authorization token are required' 
        });
    }

    try {
        const formData = new FormData();
        formData.append('encounter_id', encounter_id);

        console.log('Backend token:', backendToken);

        const response = await axios.post(
            'https://alturahealth.webjerky.com/api/encounter',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                }
            }
        );

        console.log('response from backend-create:', response.data);

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Backend API Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(
            error.response?.data || { message: 'Internal server error' }
        );
    }
} 