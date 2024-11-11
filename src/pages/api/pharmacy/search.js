import axios from 'axios';
import cors from '../middleware/cors'

export default async function handler(req, res) {
    await cors(req, res)

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, city, state, zipcode, distance, type, patientid } = req.query;

    try {
        const token = req.headers.authorization?.split(' ')[1]
       
       
        const response = await axios.get(
            `https://stgwbclientapi.azurewebsites.net/api/pharmacy/search`,
            {
                params: {
                    name: name || '',
                    city: city || '',
                    state: state || '',
                    zipcode: zipcode || '',
                    distance: distance || '1',
                    type: type || '1',
                    patientid
                },
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