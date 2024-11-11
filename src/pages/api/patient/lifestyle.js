import axios from 'axios';
import cors from '../middleware/cors'

export default async function handler(req, res) {
    // Run cors middleware
    await cors(req, res)

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization?.split(' ')[1]

    console.log("token from lifestyle in lifestyle.js", token);
    console.log("request.body in lifestyle.js", req.body);

    try {
        console.log("req.body in lifestyle.js", req.body);
        console.log("token in lifestyle.js", token);
        const response = await axios.post(
            'https://stgwbclientapi.azurewebsites.net/api/patient/lifestyle',
            req.body,
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