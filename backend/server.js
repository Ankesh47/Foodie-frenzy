import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';

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
            'http://localhost:3001'
        ]
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        }
        else {
            callback(new Error("not allowed by CORS"))
        }
    },
    credentials: true

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

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})