import axios from 'axios';
import cors from '../middleware/cors'

export default async function handler(req, res) {
    await cors(req, res)

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { PatientId, Code } = req.body;

    if (!PatientId || !Code) {
        return res.status(400).json({ message: 'Patient ID and Pharmacy Code are required' });
    }

    try {
               
        const token = req.headers.authorization?.split(' ')[1]
       
       
        const response = await axios.post(
            'https://wbclientapi.webdoctors.com/api/patient/addpreferredpharmacy',
            {
                PatientId,
                Code
            },
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