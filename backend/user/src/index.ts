import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import { createClient } from 'redis';

dotenv.config();
connectDb()

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
})

redisClient.connect()
    .then(() => {
        console.log('Connected to Redis');
    }).catch((err) => {
        console.log('Error connecting to Redis', err);
    })

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})