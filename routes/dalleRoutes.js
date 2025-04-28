import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Define the POST route for text-to-image
router.post('/text-to-image', async (req, res) => {
  const { prompt } = req.body;

  const options = {
    method: 'POST',
    url: 'https://dall-e-34.p.rapidapi.com/v1/images/generations',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'dall-e-34.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      prompt: prompt,  // use dynamic prompt here!
      n: 1,
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
    },
  };

  try {
    // 1. First call to generate the image
    const response = await axios.request(options);

    const imageUrl = response.data.data[0].url; 

    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer', // important to get binary data
    });

    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

    // 4. Send back Base64 with MIME type
    res.json({
      base64: `data:image/png;base64,${base64Image}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router;
