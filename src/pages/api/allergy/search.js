import axios from 'axios';
import cors from '../middleware/cors'



export default async function handler(req, res) {
    await cors(req, res)

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { Name } = req.query;

    try {
        const token = req.headers.authorization?.split(' ')[1]

        if(!token)
        {
            alert('No token found');
        }
        else{
            const response = await axios.get(
                `https://wbclientapi.webdoctors.com/api/allergy/search?Name=${Name}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
        }
        

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal server error' });
    }
} 