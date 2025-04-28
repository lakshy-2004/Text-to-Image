import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:'50mb'}));


app.use(express.static(path.resolve(__dirname, "./client/dist")));

// app.get('/', async (req,res) => {
//     res.send('Hello from Me');
// })


app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);


app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});


const startServer  = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8000, ()=> console.log('Server is started on Port 8000'));
    } catch (error) {
        console.log('Databse not connected !!!!!!!:',error);
    }
}

startServer(); 