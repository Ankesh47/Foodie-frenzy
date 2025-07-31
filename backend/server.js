import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config({ path: 'env.local' });

import userRouter from './routes/userRoute.js'
import itemRouter from './routes/itemRoute.js'
import cartRouter from './routes/cartRoute.js'

import path from 'path'
import { fileURLToPath } from 'url';
import orderRouter from './routes/orderRoute.js';


const app = express();
const port = process.env.PORT || 4000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// middleware

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:5174',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001'
        ]
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(new Error("not allowed by CORS"))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Database

connectDB();



// routes
app.use('/api/user', userRouter )

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/items', itemRouter)

app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)


app.get('/', (req, res) => {
    res.send('API WORKING')
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})