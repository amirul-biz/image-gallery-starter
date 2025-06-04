import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { paramsToSign } = req.body;
  
    if (!paramsToSign || typeof paramsToSign !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid paramsToSign' });
    }
  
    try {
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET
      );
  
      return res.status(200).json({ signature });
    } catch (error) {
      console.error('Signature error:', error);
      return res.status(500).json({ error: 'Failed to generate signature' });
    }
  }
  