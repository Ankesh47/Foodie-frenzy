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

// More permissive CORS for development
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handle preflight requests
app.options('*', cors())


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